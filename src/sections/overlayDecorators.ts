import { createSection } from "@formkit/inputs";

/**
 * The decorators for the overlay scanner.
 *
 * @public
 */
export const overlayDecorators = createSection("overlayDecorators", () => ({
  $el: "div",
  attrs: {
    class: "$classes.overlayDecorators",
  },
  children: [
    { $el: "div", attrs: { class: "$classes.overlayDecoratorTopLeft" } },
    { $el: "div", attrs: { class: "$classes.overlayDecoratorTopRight" } },
    { $el: "div", attrs: { class: "$classes.overlayDecoratorBottomLeft" } },
    { $el: "div", attrs: { class: "$classes.overlayDecoratorBottomRight" } },
  ],
}));
