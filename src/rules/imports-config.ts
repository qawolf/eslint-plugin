import { existsSync } from "fs";

import { defineImportsRule } from "../imports";

function getTopDir(path: string) {
  return path.split("/")[0] ?? path;
}

/**
 * Checks whether an import between two directories is allowed by looking at an .imports file that sits above them.
 *
 * Example:
 *  /backend/bar.js
 *  /frontend/foo.js
 *  /shared
 *  /.imports.js
 *
 * Contents of .imports.js that would allow imports from shared, but not across backend and frontend:
 *  export const whitelist = { backend: ["shared"], frontend: ["shared"] };
 */
export default defineImportsRule(function (details) {
  const { imported } = details;
  if (imported.type !== "relative") return { allowed: true };

  const { boundaryPrefix } = imported;
  const cwd = process.cwd();
  const them = getTopDir(imported.module.substring(boundaryPrefix.length));
  const us = getTopDir(
    details.importing.module.substring(boundaryPrefix.length),
  );
  if (them === us) return { allowed: true };

  const paths = [
    cwd + "/" + boundaryPrefix + ".imports.ts",
    cwd + "/" + boundaryPrefix + ".imports.js",
  ];
  for (const path of paths) {
    if (!existsSync(path)) continue;
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- ESLint does not support async rules, we must use a sync require. Under the hood this file runs in CommonJS anyway.
    const config = require(path);
    const whitelistMap = config.whitelist;
    if (!whitelistMap) continue;
    const whitelistInFile = whitelistMap[us];
    if (!whitelistInFile && whitelistMap.allowByDefault) continue;
    const whitelistDeFacto = whitelistInFile ?? [];
    if (!whitelistDeFacto.includes(them)) {
      return {
        allowed: false,
        message: `Importing from ${boundaryPrefix}${them} is not allowed in ${boundaryPrefix}${us}, check ${path.replace(cwd + "/", "")}.`,
      };
    }
  }

  return { allowed: true };
});
