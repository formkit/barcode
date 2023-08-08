import { createSection } from "@formkit/inputs";

/**
 * The scanner laser for the scan bar.
 *
 * @public
 */
export const laser = createSection("laser", () => ({
  $el: "div",
  attrs: {
    class: "$classes.laser",
  },
}));
