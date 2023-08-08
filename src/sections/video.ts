import { createSection } from "@formkit/inputs";

/**
 * The video where the barcode reader will be attached.
 *
 * @public
 */

export const video = createSection("video", () => ({
  $el: "video",
  attrs: {
    class: "$classes.video",
    poster: "data:image/gif, AAAA",
    id: '$id + "-video"',
  },
}));
