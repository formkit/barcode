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
  console.log(node.props.formats, getFormatsHint(node.props.formats), codeReader.hints);

  node.on('prop:formats', ({ payload }) => {
    console.log(payload, getFormatsHint(payload), codeReader.hints);
    codeReader.hints = getFormatsHint(payload);
  });

  node.on('created', () => {
    if (!node.context) return;

    node.context.handlers.openCamera = async () => {
      const dialog = document.getElementById(`${node.props.id}_dialog`) as HTMLDialogElement;

      codeReader.decodeFromVideoDevice(null, `${node.props.id}_video`, (res) => {
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
      });
    };

    node.context.handlers.closeCamera = (event: Event) => {
      const dialog = document.getElementById(`${node.props.id}_dialog`) as HTMLDialogElement;
      codeReader.reset();
      dialog.close();
    };
  });

  node.on('destroying', () => {
    codeReader.reset();
  });
};
