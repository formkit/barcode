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

  // sets default icon while still allowing user to override it
  node.props.barcodeIcon =
    node.props.barcodeIcon ||
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 50"><path fill="currentColor" d="m46.44,42.04c-1.1,0-2-.9-2-2V10.04c0-1.1.9-2,2-2s2,.9,2,2v30c0,1.1-.9,2-2,2Zm-32.88-2V10.04c0-1.1-.9-2-2-2s-2,.9-2,2v30c0,1.1.9,2,2,2s2-.9,2-2Zm3.26,1.5V8.54c0-.28-.22-.5-.5-.5s-.5.23-.5.5v32.99c0,.28.22.5.5.5s.5-.23.5-.5Zm19.49,0V8.54c0-.28-.22-.5-.5-.5s-.5.23-.5.5v32.99c0,.28.22.5.5.5s.5-.23.5-.5Zm-9-.5V9.04c0-.55-.45-1-1-1s-1,.45-1,1v32c0,.55.45,1,1,1s1-.45,1-1Zm14.06,0V9.04c0-.55-.45-1-1-1s-1,.45-1,1v32c0,.55.45,1,1,1s1-.45,1-1Zm-8.95,0V9.04c0-.55-.45-1-1-1s-1,.45-1,1v32c0,.55.45,1,1,1s1-.45,1-1Zm-9.57-.5V9.54c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5v31c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5ZM3,11.5V3h8.5c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5H1.5C.67,0,0,.67,0,1.5v10c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5Zm55,0V1.5c0-.83-.67-1.5-1.5-1.5h-10c-.83,0-1.5.67-1.5,1.5s.67,1.5,1.5,1.5h8.5v8.5c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5ZM13,48.53c0-.83-.67-1.5-1.5-1.5H3v-8.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5v10c0,.83.67,1.5,1.5,1.5h10c.83,0,1.5-.67,1.5-1.5Zm45,.05v-10c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5v8.5h-8.5c-.83,0-1.5.67-1.5,1.5s.67,1.5,1.5,1.5h10c.83,0,1.5-.67,1.5-1.5Z"></path>/svg>`;

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
