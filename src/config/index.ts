import type { Linter } from "eslint";
import rulesDirPlugin from "@qawolf/eslint-plugin-rulesdir";

import { disabledRulesFromPresets } from "./disabled";
import { importVerificationRules } from "./imports";
import { formattingRules } from "./formatting";
import { overrides } from "./overrides";
import { otherRules } from "./other";

rulesDirPlugin.RULES_DIR = [
  // Relative to the individual project’s root
  ".eslint/custom-rules",
];

export const main = {
  env: {
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:node/recommended",
    "plugin:promise/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    // @typescript-eslint/typescript-estree complains very loudly newer TypeScript versions,
    // and always works just fine.
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: [
    "@denis-sokolov",
    "@qawolf/eslint-plugin-rulesdir",
    "@typescript-eslint",
    "github",
    "jest",
    "import",
    "node",
    "perfectionist",
    "promise",
    "react-compiler",
    "redos",
  ],
  rules: {
    ...disabledRulesFromPresets,
    ...formattingRules,
    ...importVerificationRules,
    ...otherRules,
  },
  overrides,
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: true,
      typescript: true,
    },
    react: {
      version: "detect",
    },
  },
} satisfies Linter.Config;
