import { createSection } from '@formkit/inputs';

/**
 * The video where the barcode reader will be attached.
 *
 * @public
 */
export const video = createSection('video', () => ({
  $el: 'div',
  children: [
    {
      $el: 'video',
      attrs: {
        poster: 'data:image/gif, AAAA',
        id: '$id + "_video"',
      }
    },
    {
      $el: 'div',
      attrs: {
        class: 'overlay-element'
      }
    },
    {
      $el: 'div',
      attrs: {
        class: 'laser'
      }
    }
  ]
}));
