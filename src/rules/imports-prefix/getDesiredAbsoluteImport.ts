import { existsSync } from "fs";
import { basename, dirname } from "path";

import { type ImportDetails } from "../../imports";
import { getImportsConfigAt } from "../../imports-config-file";

function getAbsoluteImportPrefixForDir(
  dir: string,
  options: { continueRecursing?: boolean } = {},
): string | undefined {
  function recur() {
    const pref = getAbsoluteImportPrefixForDir(dirname(dir), {
      continueRecursing: true,
    });
    if (pref === undefined) throw Error(`Unexpected undefined pref`);
    return pref + basename(dir) + "/";
  }

  const config = getImportsConfigAt(dir);
  if (config) {
    const absoluteImportPrefix = config.absoluteImportPrefix;
    if (typeof absoluteImportPrefix === "string") return absoluteImportPrefix;
    if (absoluteImportPrefix === true) return recur();
  }
  if (options.continueRecursing) {
    if (existsSync(dir + "/package.json")) {
      throw Error(
        `Ran into true absoluteImportPrefix without a higher level string absoluteImportPrefix`,
      );
    }
    return recur();
  }
  return undefined;
}

/**
 * Rewrites relative imports with absolute imports if the relative import path crosses a boundary that has an .imports config with an absoluteImportPrefix value.
 *
 * If the value is a string, it will be considered to be the start of the import path. If it is “true”, then it is taken as a boundary, but the actual prefix will be looked up higher in the tree.
 *
 * Example:
 *  /a
 *    /aa1
 *      aaa1.js
 *    /aa2
 *      aaa2.js
 *    .imports.js (contains absoluteImportPrefix=true)
 *  /b
 *    /bb1
 *      bbb1.js
 *    /bb2
 *      bbb2.js
 *  /.imports.js (contains absoluteImportPrefix="app/")
 *
 * In bbb1.js, an import from "../../a/aa1/aaa1" will be rewritten to "app/a/aa1/aaa1", as we’re crossing the top level-boundary.
 * In aaa2.js, an import from "../aa1/aaa1" will be rewritten to "app/a/aa1/aaa1", as we’re crossing a boundary. The path is constructed using a reference to the top-level boundary.
 * In bbb2.js, an import from "../bb1/bbb1" will not be rewritten, because there is no boundary defined. We’re presumed to be in one closed module.
 */
export function getDesiredAbsoluteImport({
  imported,
  projectDirectory,
}: ImportDetails) {
  if (imported.type !== "relative") return;

  const { boundary } = imported;
  if (boundary === "importing-is-outside-project") return;

  const desiredAbsolutePrefix = getAbsoluteImportPrefixForDir(
    projectDirectory + (boundary.module ? "/" + boundary.module : ""),
  );
  if (!desiredAbsolutePrefix) return;

  if (boundary.module === imported.module)
    return desiredAbsolutePrefix.replace(/\/$/, "");
  return (
    desiredAbsolutePrefix +
    imported.module.substring(boundary.modulePrefix.length)
  );
}
