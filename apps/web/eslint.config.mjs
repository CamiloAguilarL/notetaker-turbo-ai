import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{jsx,tsx}"],
    ignores: ["src/components/ui/**/*.{jsx,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            "Use the source-owned shadcn Button from components/ui/button.",
        },
        {
          selector: "JSXOpeningElement[name.name='input']",
          message:
            "Use the source-owned shadcn Input from components/ui/input.",
        },
        {
          selector: "JSXOpeningElement[name.name='textarea']",
          message:
            "Use the source-owned shadcn Textarea from components/ui/textarea.",
        },
        {
          selector: "JSXOpeningElement[name.name='select']",
          message:
            "Use the source-owned shadcn Select from components/ui/select.",
        },
        {
          selector: "JSXOpeningElement[name.name='option']",
          message:
            "Use SelectItem from the source-owned shadcn Select composition.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
