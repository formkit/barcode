import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "module",
    },
  ],
  plugins: [commonjs(), typescript()],
  external: [
    "@formkit/core",
    "@formkit/inputs",
    "@formkit/utils",
    "@zxing/browser",
  ],
});
