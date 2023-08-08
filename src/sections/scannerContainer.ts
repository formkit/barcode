import { createSection } from "@formkit/inputs";

/**
 * The container for the scanner to live on.
 *
 * @public
 */
export const scannerContainer = createSection("scannerContainer", () => ({
  $el: "div",
  attrs: {
    class: "$classes.scannerContainer",
  },
}));
