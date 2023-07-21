import { FormKitNode } from '@formkit/core';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import barCodeReader from './schema';

const inputBarcodeReader = (node: FormKitNode) => {
  if (node.props.type !== 'barcode') return;

  const codeReader = new BrowserMultiFormatReader();

  codeReader.hints = new Map([
    [DecodeHintType.POSSIBLE_FORMATS, node.props.formats ? node.props.formats : [BarcodeFormat.CODE_128]]
  ]);

  node.on('created', () => {
    if (!node.context) return;

    node.context.handlers.openCamera = async () => {
      if (!node.props.id) return;

      const dialog = document.getElementById(`${node.props.id}_dialog`) as HTMLDialogElement;
      dialog.addEventListener('close', () => {
        codeReader.reset();
      });
      dialog.showModal();

      codeReader.decodeFromVideoDevice(null, `${node.props.id}_video`, (res) => {
        if (res) node.input(res.getText());
      });
    };

    node.context.handlers.closeCamera = (event: Event) => {
      if (!node.props.id) return;

      const dialog = document.getElementById(`${node.props.id}_dialog`) as HTMLDialogElement;
      dialog.removeEventListener('close', () => {
        codeReader.reset();
      });

      if ((event.target as HTMLElement).nodeName === 'DIALOG') {
        dialog.close();
      }
    };
  });

  node.on('destroying', () => {
    codeReader.reset();
  });
};

inputBarcodeReader.library = (node: FormKitNode) => {
  const isMediaStreamAPISupported = navigator &&
    navigator.mediaDevices &&
    'enumerateDevices' in navigator.mediaDevices;

  if (node.props.type === 'barcode') {
    if (!isMediaStreamAPISupported) return console.warn('Media Stream API is not supported in your device.');

    return node.define(barCodeReader)
  };
}

export default inputBarcodeReader;
