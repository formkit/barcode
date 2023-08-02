import { FormKitNode } from '@formkit/core';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

const getFormatsHint = (formats: any) => new Map([
  [DecodeHintType.POSSIBLE_FORMATS, formats ? formats : [BarcodeFormat.CODE_128]]
]);

export const zxingMultiFormatReader = (node: FormKitNode) => {
  if (node.props.type !== 'barcode') return;

  const codeReader = new BrowserMultiFormatReader();

  if (!codeReader.isMediaDevicesSuported) return console.warn('Media Stream API is not supported in your device.');

  codeReader.hints = getFormatsHint(node.props.formats);

  node.on('prop:formats', ({ payload }) => {
    codeReader.hints = getFormatsHint(payload);
  });

  node.on('created', () => {
    node.context!.scannerLoading = false;

    node.context!.handlers.openCamera = async () => {
      const dialog = document.getElementById(`${node.props.id}-dialog`) as HTMLDialogElement;

      node.context!.scannerLoading = true;

      codeReader.decodeFromVideoDevice(null, `${node.props.id}-video`, (res) => {
        if (res) {
          node.input(res.getText());
          dialog.close();
        }
      }).then(() => {
        dialog.showModal();
      }).catch(() => {
        node.setErrors('Camera access denied.');
        codeReader.reset();
        dialog.close();
      }).finally(() => {
        node.context!.scannerLoading = false;
      });
    };

    node.context!.handlers.closeCamera = (event: Event) => {
      const dialog = document.getElementById(`${node.props.id}-dialog`) as HTMLDialogElement;
      codeReader.reset();
      dialog.close();
    };
  });

  node.on('destroying', () => {
    codeReader.reset();
  });
};
