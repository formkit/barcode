import { FormKitNode } from "@formkit/core";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";

const getFormats = (formats: string[] | null): BarcodeFormat[] | null => {
  if (!formats) return null;
  return formats.map(
    (format) => BarcodeFormat[format as keyof typeof BarcodeFormat]
  );
};

export const zxingMultiFormatReader = (node: FormKitNode) => {
  if (node.props.type !== "barcode") return;

  const codeReader = new BrowserMultiFormatReader();

  function closeCamera() {
    const dialog = document.getElementById(
      `${node.props.id}-dialog`
    ) as HTMLDialogElement;
    codeReader.reset();

    if (dialog) {
      dialog.close();
    }
  }

  node.on("created", () => {
    node.context!.scannerLoading = false;

    if (!codeReader.isMediaDevicesSuported) {
      node.context!.scannerLoading = false;
      node.setErrors("Camera access not supported on your device.");
      return console.warn("Media Stream API is not supported in your device.");
    }

    node.context!.handlers.openCamera = async () => {
      node.clearErrors();

      const dialog = document.getElementById(
        `${node.props.id}-dialog`
      ) as HTMLDialogElement;

      node.context!.scannerLoading = true;

      codeReader
        .decodeFromVideoDevice(null, `${node.props.id}-video`, (res) => {
          if (res) {
            const format: BarcodeFormat = res.getBarcodeFormat();
            const allowedFormats = getFormats(node.props.formats);
            // set an error if the format is not allowed
            if (allowedFormats && !allowedFormats.includes(format)) {
              return;
            } else {
              node.input(res.getText());
            }
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
                .catch(() => {
                  // do nothing
                });
            }
          }
        })
        .catch(() => {
          node.context!.scannerLoading = false;
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
