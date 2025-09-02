import type { Linter } from "eslint";

export const formattingRules = {
  "@qawolf/restrict-new-error": "error",
  "@qawolf/imports-prefix": "error",

  "@typescript-eslint/camelcase": "off",
  "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  // Also see import/consistent-type-specifier-style: they do similar, but slightly different things
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { fixStyle: "separate-type-imports" },
  ],

  curly: ["error", "multi-or-nest"],

  // Also see @typescript-eslint/consistent-type-imports: they do similar, but slightly different things
  "import/consistent-type-specifier-style": [
    "error",
    "prefer-top-level-if-only-type-imports",
  ],

  "object-shorthand": ["error", "always", { avoidExplicitReturnArrows: true }],

  "perfectionist/sort-array-includes": ["error", { type: "natural" }],
  "perfectionist/sort-classes": ["error", { type: "natural" }],
  "perfectionist/sort-enums": ["error", { type: "natural" }],
  "perfectionist/sort-decorators": ["error", { type: "natural" }],
  "perfectionist/sort-exports": [
    "error",
    {
      type: "natural",
    },
  ],
  "perfectionist/sort-imports": [
    "error",
    {
      customGroups: {
        type: { "qawolf-type": ["^@qawolf/"] },
        value: { qawolf: ["^@qawolf/"] },
      },
      groups: [
        ["side-effect", "side-effect-style"],
        ["builtin", "builtin-type", "external", "external-type"],
        ["qawolf", "qawolf-type"],
        ["internal", "internal-type"],
        ["parent", "parent-type"],
        ["index", "index-type", "sibling", "sibling-type"],
        "object",
        "unknown",
      ],
      internalPattern: ["^@/", "^app/"],
      sortSideEffects: true,
      type: "natural",
    },
  ],
  "perfectionist/sort-interfaces": ["error", { type: "natural" }],
  "perfectionist/sort-jsx-props": [
    "error",
    {
      ignoreCase: false,
      type: "natural",
    },
  ],
  "perfectionist/sort-maps": ["error", { type: "natural" }],
  "perfectionist/sort-named-exports": [
    "error",
    { groupKind: "types-first", type: "natural" },
  ],
  "perfectionist/sort-named-imports": [
    "error",
    { groupKind: "types-first", ignoreAlias: true, type: "natural" },
  ],
  "perfectionist/sort-objects": [
    "error",
    { partitionByNewLine: true, type: "natural" },
  ],
  "perfectionist/sort-object-types": ["error", { type: "natural" }],
  "perfectionist/sort-sets": ["error", { type: "natural" }],
  "perfectionist/sort-switch-case": ["error", { type: "natural" }],
} satisfies Linter.Config["rules"];
