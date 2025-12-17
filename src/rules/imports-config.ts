import { defineImportsRule } from "../imports";
import { getImportsConfigAt } from "../imports-config-file";

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

  const config = getImportsConfigAt(
    cwd + "/" + boundaryPrefix.replace(/\/$/, ""),
  );
  if (!config || !config.whitelist) return { allowed: true };

  const whitelistInFile = config.whitelist[us];
  if (!whitelistInFile && config.whitelist.allowByDefault)
    return { allowed: true };

  const whitelistDeFacto = whitelistInFile ?? [];
  if (whitelistDeFacto.includes(them)) return { allowed: true };

  return {
    allowed: false,
    message: `Importing from ${boundaryPrefix}${them} is not allowed in ${boundaryPrefix}${us}, check ${boundaryPrefix.replace(cwd + "/", "")}.imports file.`,
  };
});
