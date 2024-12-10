import type { Linter } from "eslint";

export const importVerificationRules = {
  "@qawolf/imports-config": "error",
  "@qawolf/restrict-react-namespace": "error",

  "import/no-duplicates": "error",
} satisfies Linter.Config["rules"];
