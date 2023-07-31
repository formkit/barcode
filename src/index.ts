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
  defaultIcon,
  $attrs,
} from '@formkit/inputs';
import {
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
  features: [
    zxingMultiFormatReader,
    defaultIcon('close', 'close')
  ],
  schema: outer(
    wrapper(
      label('$label'),
      inner(
        icon('prefix', 'label'),
        prefix(),
        textInput(),
        barcodeIcon(),
        suffix(),
        icon('suffix')
      )
    ),
    dialog(
      $attrs({ onClick: '$handlers.closeCamera' }, icon('close')),
      video()
    ),
    help('$help'),
    messages(message('$message.value'))
  )
};
