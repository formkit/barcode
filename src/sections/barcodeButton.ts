import { createSection } from '@formkit/inputs';

/**
 * Barcode button to open the user defined camera.
 *
 * @public
 */
export const barcodeButton = createSection('barcodeButton', () => ({
  $el: 'button',
  attrs: {
    id: '$id + "_barcode_button"',
    type: 'button',
    onClick: '$handlers.openCamera',
    tabindex: '-1',
  }
}));
