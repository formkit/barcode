import { createSection } from "@formkit/inputs";

/**
 * The scanner overlay for the scan bar.
 *
 * @public
 */
export const overlay = createSection("overlay", () => ({
  $el: "div",
  attrs: {
    class: "$classes.overlay",
  },
}));
