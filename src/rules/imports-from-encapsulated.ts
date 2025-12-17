import { dirname } from "path";

import { defineImportsRule } from "../imports";
import { getImportsConfigAt } from "../imports-config-file";

/**
 * Checks whether an import violates encapsulation of a sealed off module
 *
 * Example:
 *  /backend/bar.js
 *  /frontend/foo.js
 *  /frontend/index.js
 *  /frontend/.imports.js (contains export const encapsulated = true)
 *
 * In bar.js, an import from "../frontend/foo" will be blocked, because frontend is encapsulated. The import should be done via frontend instead (or frontend/index or frontend/index.js).
 */
export default defineImportsRule(function (details) {
  const { imported, projectDirectory } = details;
  if (imported.type !== "relative") return { allowed: true };

  const { boundary } = imported;

  let moduleToCheck = imported.module;

  // Even if the module is encapsulated, importing itself is allowed.
  // So start looking from its parent.
  moduleToCheck = dirname(moduleToCheck);

  while (true) {
    if (
      boundary !== "importing-is-outside-project" &&
      moduleToCheck === boundary.module
    )
      break;
    // Reached top without finding boundaryModule
    if (moduleToCheck === "." || moduleToCheck === "") break;

    const config = getImportsConfigAt(projectDirectory + "/" + moduleToCheck);
    if (config?.encapsulated) {
      return {
        allowed: false,
        message: `Don’t import from deeper than ${moduleToCheck}. ${moduleToCheck} is an  encapsulated boundary, import from it instead. You may need to add an export for what you need to ${moduleToCheck}/index file.`,
      };
    }

    moduleToCheck = dirname(moduleToCheck);
  }

  return { allowed: true };
});
