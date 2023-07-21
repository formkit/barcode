import { FormKitTypeDefinition } from '@formkit/core';
import {
  outer,
  wrapper,
  label,
  inner,
  icon,
  prefix,
  textInput,
  suffix,
  help,
  messages,
  message,
} from '@formkit/inputs';
import {
  barcodeButton,
  barcodeIcon,
  dialog,
  video,
} from './sections';

export default {
  type: 'input',
  family: 'text',
  props: [
    'formats',
  ],
  schema: outer(
    wrapper(
      label('$label'),
      inner(
        icon('prefix', 'label'),
        prefix(),
        textInput(),
        barcodeButton(barcodeIcon()),
        suffix(),
        icon('suffix')
      )
    ),
    dialog(video()),
    help('$help'),
    messages(message('$message.value'))
  )
} as FormKitTypeDefinition;
