import type { Linter } from "eslint";

export const importVerificationRules = {
  "@qawolf/imports-prefix": "error",
  "@qawolf/imports-config": "error",
  "@qawolf/imports-config-valid": "error",
  "@qawolf/restrict-react-namespace": "error",

  "import/no-duplicates": "error",
} satisfies Linter.Config["rules"];
