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
  const { imported, projectDirectory } = details;
  if (imported.type !== "relative") return { allowed: true };

  const { boundary } = imported;
  if (
    boundary === "importing-is-outside-project" ||
    !details.importing.insideProject
  )
    return { allowed: true };

  const them = getTopDir(
    imported.module.substring(boundary.modulePrefix.length),
  );
  const us = getTopDir(
    details.importing.module.substring(boundary.modulePrefix.length),
  );
  if (them === us) return { allowed: true };

  const config = getImportsConfigAt(
    projectDirectory + "/" + boundary.modulePrefix.replace(/\/$/, ""),
  );
  if (!config || !config.whitelist) return { allowed: true };

  const whitelistInFile = config.whitelist[us];
  if (!whitelistInFile && config.whitelist.allowByDefault)
    return { allowed: true };

  const whitelistDeFacto = whitelistInFile ?? [];
  if (whitelistDeFacto.includes(them)) return { allowed: true };

  return {
    allowed: false,
    message: `Importing from ${boundary.modulePrefix}${them} is not allowed in ${boundary.modulePrefix}${us}, check ${boundary.modulePrefix.replace(projectDirectory + "/", "")}.imports file.`,
  };
});
