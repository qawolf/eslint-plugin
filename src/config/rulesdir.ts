import rulesDirPlugin from "@qawolf/eslint-plugin-rulesdir";

export function configureRulesDir(relativePath: string) {
  if (relativePath[0] === "/") throw Error("path must be relative");

  // Merge, not overwrite.
  // Otherwise in some setups the order of file loading is wrong and
  // we overwrite RULES_DIR configured elsewhere.
  const previousRulesDir =
    typeof rulesDirPlugin.RULES_DIR === "string"
      ? [rulesDirPlugin.RULES_DIR]
      : (rulesDirPlugin.RULES_DIR ?? []);

  // RULES_DIR is evaluated relative to the current working directory,
  // and in the IDEs we have no control over it.
  rulesDirPlugin.RULES_DIR = previousRulesDir.concat([
    // Product debt: relativePath is sometimes resolved in an incorrect directory
    relativePath,
  ]);
}
