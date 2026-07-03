import denisSokolov from "@denis-sokolov/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";

import { plugin } from "../plugin-object";

import { disabledRulesFromPresets } from "./disabled";
import { importVerificationRules } from "./imports";
import { formattingRules } from "./formatting";
import { overrides } from "./overrides";
import { otherRules } from "./other";

import { findLocalRules } from "./local-rules";

export { restrictedSyntaxRules } from "./restricted-syntax";

export const main = defineConfig([
  {
    extends: [
      js.configs.recommended,
      require("typescript-eslint").configs.recommended,
      require("typescript-eslint").configs.eslintRecommended,
      require("@eslint-community/eslint-plugin-eslint-comments/configs")
        .recommended,
      require("eslint-plugin-jest").configs["flat/recommended"],
      require("eslint-plugin-import").flatConfigs.recommended,
      require("eslint-plugin-import").flatConfigs.typescript,
      "n/recommended",
      require("eslint-plugin-no-await-in-promise").configs.recommended,
      require("eslint-plugin-promise").configs["flat/recommended"],
      require("eslint-plugin-react").configs.flat.recommended,
      require("eslint-plugin-react-hooks").configs.flat.recommended,
    ],
    files: ["**/*.{cjs,cts,js,jsx,mjs,ts,tsx}"],
    linterOptions: {
      // Some rules are disabled in non-thorough mode, so avoid the noise
      // See the thorough where we enable this
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      "@denis-sokolov": denisSokolov,
      "@qawolf": plugin,
      "@qawolf/local": {
        rules: findLocalRules(".eslint/local-rules") as any,
      },
      github: fixupPluginRules(require("eslint-plugin-github")),
      n: require("eslint-plugin-n"),
      perfectionist: require("eslint-plugin-perfectionist"),
      redos: require("eslint-plugin-redos"),
    },
    rules: {
      ...disabledRulesFromPresets,
      ...formattingRules,
      ...importVerificationRules,
      ...otherRules,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: true,
        typescript: true,
      },
      react: {
        version: (function () {
          try {
            return require("react/package.json").version;
          } catch (e) {
            // If no React, silence the warning about missing version
            return "16";
          }
        })(),
      },
      jest: {
        version: (function () {
          try {
            return require("jest/package.json").version;
          } catch (e) {
            // If no Jest, silence the warning about missing version
            return 27;
          }
        })(),
      },
    },
  },
  ...overrides,
  globalIgnores(["package-lock.json"]),
]);
