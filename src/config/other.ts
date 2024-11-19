import type { Linter } from "eslint";

import { restrictedSyntaxRules } from "./restricted-syntax";

export const otherRules = {
  "@denis-sokolov/exhaustive-deps-async": [
    "error",
    { additionalHooks: "useAsyncEffectAndCatch" },
  ],
  "@denis-sokolov/no-single-letter-generic-types": "error",
  "@denis-sokolov/no-todos": "error",

  "@qawolf/restrict-names": "error",
  "@qawolf/restrict-stop-propagation": "error",

  // “warn” instead of “error” because of too many existing uses
  "@qawolf/max-lines": "warn",

  "@typescript-eslint/no-non-null-assertion": "error",

  // We choose this rule over noUnusedLocals and noUnusedParameters because:
  // - we can ignore this rule for generated files;
  // - this rule detects variables that are written to but never read from;
  // - this rule detects unused type names in [foo in bar] syntax;
  // - this rule provides more customization.
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      // This allows const { sibling, ...rest } = props;
      ignoreRestSiblings: true,

      varsIgnorePattern: "^_",
    },
  ],

  eqeqeq: ["error", "always", { null: "ignore" }],

  "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
  "eslint-comments/require-description": [
    "error",
    { ignore: ["eslint-enable"] },
  ],

  "github/a11y-aria-label-is-well-formatted": "error",
  "github/async-currenttarget": "error",
  "github/async-preventdefault": "error",

  // https://github.com/mmkal/expect-type#within-test-frameworks
  "jest/expect-expect": [
    "error",
    {
      assertFunctionNames: ["expect", "expectTypeOf", "expectForbiddenError"],
    },
  ],
  "jest/no-commented-out-tests": "error",
  "jest/no-disabled-tests": "error",

  "max-params": ["error", { max: 3 }],

  "no-constant-condition": [
    "error",
    {
      // Prefer allExceptWhileTrue when upgraded to eslint 9
      checkLoops: false,
    },
  ],
  "no-throw-literal": "error",

  "node/no-unsupported-features/es-syntax": [
    "error",
    {
      // https://github.com/mysticatea/eslint-plugin-node/blob/HEAD/docs/rules/no-unsupported-features/es-syntax.md#ignores
      ignores: ["dynamicImport", "modules"],
    },
  ],

  "no-restricted-globals": [
    "error",
    {
      name: "isNaN",
      message:
        "Use Number.isNaN. It is newer and has more reliable and predictable behavior.",
    },
  ],
  "no-restricted-syntax": ["error", ...restrictedSyntaxRules],

  "promise/catch-or-return": ["error", { allowFinally: true }],
  "promise/no-nesting": "error",
  "promise/no-promise-in-callback": "error",
  "promise/no-return-in-finally": "error",
  "promise/valid-params": "error",

  "react-compiler/react-compiler": "error",

  "redos/no-vulnerable": [
    "error",
    {
      permittableComplexities: ["polynomial"],
    },
  ],
} satisfies Linter.Config["rules"];
