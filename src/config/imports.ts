import type { Linter } from "eslint";

export const importVerificationRules = {
  "@qawolf/restrict-react-namespace": "error",

  "import/no-duplicates": "error",

  "node/no-extraneous-import": "error",
  "node/no-extraneous-require": "error",
  "node/no-unpublished-import": [
    "error",
    { tryExtensions: [".mjs", ".js", ".json", ".ts", ".tsx", ".d.ts"] },
  ],
  "node/no-unpublished-require": [
    "error",
    { tryExtensions: [".js", ".json", ".ts", ".tsx", ".d.ts"] },
  ],
} satisfies Linter.Config["rules"];
