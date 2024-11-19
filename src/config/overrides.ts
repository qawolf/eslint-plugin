import type { Linter } from "eslint";

import { restrictedSyntaxRules } from "./restricted-syntax";

import { overridesWhenThorough } from "./thorough";

export const overrides = [
  ...overridesWhenThorough,
  {
    files: [
      "*.test.ts",
      "*.test.tsx",
      "*.type-test.ts",
      "*.type-test.tsx",
      "*/test/*",
    ],
    rules: {
      // Unit tests validate their results and dynamic values,
      // there is no downside to allowing lax type checking
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // Allow test files to use dev dependencies
      "node/no-unpublished-import": "off",
    },
  },
  {
    files: ["*.d.ts"],
    rules: {
      // Splitting declaration files is less useful, and their contents often have long contents
      // copied from documentation or implementation
      "max-lines": "off",

      // d.ts files describe 3rd-party module APIs which can have default exports,
      "no-restricted-syntax": [
        "error",
        ...restrictedSyntaxRules.filter(
          ({ selector }) => selector !== "ExportDefaultDeclaration",
        ),
      ],
    },
  },
  {
    files: ["*.js", "*.mjs"],
    rules: {
      // .js files are difficult to type and ignoring errors is often the best option
      "@typescript-eslint/ban-ts-comment": "off",

      // Config files do not get packaged
      "node/no-unpublished-import": "off",

      // Config files run Node.js and use CommonJS often
      "@typescript-eslint/no-var-requires": "off",

      "node/no-unpublished-require": "off",
    },
  },
  {
    files: ["jest.config.ts"],
    rules: {
      // Jest config API requires us to use default exports
      "no-restricted-syntax": [
        "error",
        ...restrictedSyntaxRules.filter(
          ({ selector }) => selector !== "ExportDefaultDeclaration",
        ),
      ],
    },
  },
  {
    files: ["**/fixtures/*"],
    rules: {
      "@qawolf/max-lines": "off",
    },
  },
] satisfies Linter.Config["overrides"];
