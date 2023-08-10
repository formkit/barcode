import { createSection } from "@formkit/inputs";

/**
 * Barcode button to open the user defined camera.
 *
 * @public
 */

export const barcodeIconWrapper = createSection("barcodeIconWrapper", () => ({
  $el: "span",
  attrs: {
    class: "$classes.barcodeIconWrapper",
    onClick: "$handlers.openCamera",
  },
}));
