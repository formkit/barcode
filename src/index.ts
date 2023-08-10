import { FormKitTypeDefinition } from "@formkit/core";
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
} from "@formkit/inputs";
import {
  dialog,
  scannerContainer,
  overlay,
  overlayDecorators,
  laser,
  video,
  barcodeIconWrapper,
} from "./sections";
import { zxingMultiFormatReader } from "./features/barcodeReader";

export { BarcodeFormat } from "@zxing/library";
export const barcode: FormKitTypeDefinition = {
  type: "input",
  family: "text",
  props: ["formats"],
  features: [
    zxingMultiFormatReader,
    defaultIcon("close", "close"),
    defaultIcon("loader", "spinner"),
  ],
  schema: outer(
    wrapper(
      label("$label"),
      inner(
        icon("prefix", "label"),
        prefix(),
        textInput(),

        // show loader or barcode icon depending on
        // loading state
        $if("$scannerLoading", icon("loader")),
        $if("$scannerLoading === false", barcodeIconWrapper(icon("barcode"))),

        suffix(),
        icon("suffix")
      )
    ),
    dialog(
      scannerContainer(
        video(),
        $attrs({ onClick: "$handlers.closeCamera" }, icon("close")),
        overlay(overlayDecorators(), laser())
      )
    ),
    help("$help"),
    messages(message("$message.value"))
  ),
};
