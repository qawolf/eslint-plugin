import { existsSync, lstatSync } from "fs";
import { dirname, join } from "path";

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

  // Synchronously walk up from cwd to root, adding rules dirs along the way.
  // On every level, we look for the specified relative path.
  let currentPath = process.cwd();
  const newRulesDir = previousRulesDir.slice();
  while (true) {
    const fullPath = join(currentPath, relativePath);
    if (existsSync(fullPath) && lstatSync(fullPath).isDirectory())
      newRulesDir.push(fullPath);
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) break;
    currentPath = parentPath;
  }

  rulesDirPlugin.RULES_DIR = newRulesDir;
}
