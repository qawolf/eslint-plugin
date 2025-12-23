import type { Linter } from "eslint";

const enabled = (function () {
  const env = process.env.THOROUGH_LINT;
  if (env === "true" || env === "1") return true;
  if (env === "false" || env === "0" || env === undefined) return false;
  throw Error(`Unexpected value of THOROUGH_LINT: ${env}`);
})();

export const overridesWhenThorough = (function () {
  if (!enabled) return [];

  return [
    {
      files: ["*.*"],
      rules: {
        // This rule must only be enabled in thorough mode, because of false positives
        // on the disable comments in the code that refer to thorough rules.
        "eslint-comments/no-unused-disable": "error",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        projectService: true,
      },
      rules: {
        "@typescript-eslint/await-thenable": "error",
        "@qawolf/no-floating-promises": ["error", { ignoreVoid: false }],
      },
    },
  ] satisfies Linter.Config["overrides"];
})();
