import { createSection } from '@formkit/inputs';

/**
 * The video where the barcode reader will be attached.
 *
 * @public
 */
export const video = createSection('video', () => ({
  $el: 'div',
  attrs: {
    class: '$classes.video + " scanner-container"',
  },
  children: [
    {
      $el: 'video',
      attrs: {
        poster: 'data:image/gif, AAAA',
        id: '$id + "-video"',
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
