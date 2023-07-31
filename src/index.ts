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
import { zxingMultiFormatReader } from './features/barcodeReader';

export const barcodeReader: FormKitTypeDefinition = {
  type: 'input',
  family: 'text',
  props: [
    'formats',
  ],
  features: [zxingMultiFormatReader],
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
};
