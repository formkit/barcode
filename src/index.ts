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
  $if,
} from '@formkit/inputs';
import {
  barcodeIcon,
  dialog,
  scannerContainer,
  overlay,
  laser,
  video,
} from './sections';
import { zxingMultiFormatReader } from './features/barcodeReader';

export const barcode: FormKitTypeDefinition = {
  type: 'input',
  family: 'text',
  props: [
    'formats',
  ],
  features: [
    zxingMultiFormatReader,
    defaultIcon('close', 'close'),
    defaultIcon('spinner', 'spinner')
  ],
  schema: outer(
    wrapper(
      label('$label'),
      inner(
        icon('prefix', 'label'),
        prefix(),
        textInput(),
        $if('$scannerLoading', icon('spinner'), barcodeIcon()),
        suffix(),
        icon('suffix')
      )
    ),
    dialog(
      scannerContainer(
        video(),
        $attrs({ onClick: '$handlers.closeCamera' }, icon('close')),
        overlay(),
        laser()
      )
    ),
    help('$help'),
    messages(message('$message.value'))
  )
};
