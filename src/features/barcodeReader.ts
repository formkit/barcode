import { FormKitNode } from "@formkit/core";
import { BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";

const getFormatsHint = (formats: any) =>
  new Map([
    [
      DecodeHintType.POSSIBLE_FORMATS,
      formats ? formats : ["CODE_128", "QR Code"],
    ],
  ]);

export const zxingMultiFormatReader = (node: FormKitNode) => {
  if (node.props.type !== "barcode") return;

  const codeReader = new BrowserMultiFormatReader();
  codeReader.hints = getFormatsHint(node.props.formats);

  function closeCamera() {
    const dialog = document.getElementById(
      `${node.props.id}-dialog`
    ) as HTMLDialogElement;
    codeReader.reset();

    if (dialog) {
      dialog.close();
    }
  }

  node.on("prop:formats", ({ payload }) => {
    codeReader.hints = getFormatsHint(payload);
  });

  node.on("created", () => {
    node.context!.scannerLoading = false;

    if (!codeReader.isMediaDevicesSuported) {
      node.setErrors("Camera access not supported on your device.");
      return console.warn("Media Stream API is not supported in your device.");
    }

    node.context!.handlers.openCamera = async () => {
      const dialog = document.getElementById(
        `${node.props.id}-dialog`
      ) as HTMLDialogElement;

      node.context!.scannerLoading = true;

      // enable continuous autofocus of camera
      codeReader
        .decodeFromVideoDevice(null, `${node.props.id}-video`, (res) => {
          if (res) {
            node.input(res.getText());
            closeCamera();
          }
        })
        .then(() => {
          dialog.showModal();
          node.context!.scannerLoading = false;

          // enable continuous autofocus of camera
          const videoElement = document.getElementById(
            `${node.props.id}-video`
          ) as HTMLVideoElement | null;

          if (videoElement && videoElement.srcObject instanceof MediaStream) {
            const track = videoElement.srcObject.getVideoTracks()[0];

            if (track) {
              const constraints = {
                focusDistance: { ideal: 0 },
                advanced: [{ zoom: { ideal: 0 } }],
              };

              track
                .applyConstraints(constraints as MediaTrackConstraints)
                .catch((err) =>
                  console.error("Failed to apply constraints:", err)
                );
            }
          }
        })
        .catch(() => {
          node.setErrors("Camera access denied or not available.");
          codeReader.reset();

          if (dialog) {
            dialog.close();
          }
        });
    };

    node.context!.handlers.closeCamera = closeCamera;
  });

  node.on("destroying", () => {
    closeCamera();
  });
};
