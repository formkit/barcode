import { createSection } from '@formkit/inputs';

/**
 * The video where the barcode reader will be attached.
 *
 * @public
 */

export const video = createSection('video', () => ({
  $el: 'video',
  attrs: {
    poster: 'data:image/gif, AAAA',
    id: '$id + "-video"',
  }
}));
