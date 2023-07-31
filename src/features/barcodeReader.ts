import { FormKitNode } from '@formkit/core';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

export const zxingMultiFormatReader = (node: FormKitNode) => {
  if (node.props.type !== 'barcode') return;

  const codeReader = new BrowserMultiFormatReader();

  if (!codeReader.isMediaDevicesSuported) return console.warn('Media Stream API is not supported in your device.');

  codeReader.hints = new Map([
    [DecodeHintType.POSSIBLE_FORMATS, node.props.formats ? node.props.formats : [BarcodeFormat.CODE_128]]
  ]);

  node.on('created', () => {
    if (!node.context) return;

    node.context.handlers.openCamera = async () => {
      const dialog = document.getElementById(`${node.props.id}_dialog`) as HTMLDialogElement;

      codeReader.decodeFromVideoDevice(null, `${node.props.id}_video`, (res) => {
        if (res) {
          node.input(res.getText());
          dialog.close();
        }
      });

      dialog.showModal();
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
