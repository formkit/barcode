import { createSection } from '@formkit/inputs';

/**
 * Dialog box where the video layer will appear.
 *
 * @public
 */
export const dialog = createSection('dialog', () => ({
  $el: 'dialog',
  attrs: {
    id: '$id + "-dialog"',
  }
}));
