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
      "n/no-unpublished-import": "off",
    },
  },
  {
    files: ["*.d.ts"],
    rules: {
      // `interface` keyword is needed for declaration merging, when amending 3rd-party types
      "@typescript-eslint/consistent-type-definitions": "off",

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
  // We normally disallow process.env, but it's fine to use it in test files,
  // config files, scripts, etc., and also in the `env.ts` file.
  {
    files: [
      "*.test.ts",
      "*.test.tsx",
      "*.type-test.ts",
      "*.type-test.tsx",
      "**/test/**",
      "**/.jest/**",
      "**/env/**/*.ts",
      "**/env.ts",
      "**/environment.ts",
      "**/next-config/**",
      "**/webpack/**",
      "scripts/**",
      "jest.config.*",
      "webpack.config.*",
    ],
    rules: {
      "n/no-process-env": "off",
    },
  },
] satisfies Linter.Config["overrides"];
