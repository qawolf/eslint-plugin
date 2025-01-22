import { defineImportsRule, type ImportDetails } from "../../imports";
import { getDesiredAbsoluteImport } from "./getDesiredAbsoluteImport";
import { getDesiredLocalImport } from "./getDesiredLocalImport";

function solution({
  details,
  message,
  path,
}: {
  details: ImportDetails;
  message: string;
  path: string;
}) {
  if (details.imported.verbatim.endsWith(".js") && !path.endsWith(".js")) {
    if (details.imported.verbatim.endsWith("/index.js")) {
      path += "/index.js";
    } else {
      path += ".js";
    }
  }
  if (path === details.imported.verbatim) return { allowed: true } as const;
  return {
    allowed: false,
    fix: { newPath: path },
    message: `${message}: ${path}`,
  } as const;
}

/**
 * Adjusts imports between absolute and relative imports based on the situation
 * (direction of import, .imports config).
 */
export default defineImportsRule(function (details) {
  const desiredAbsoluteImport = getDesiredAbsoluteImport(details);
  if (desiredAbsoluteImport) {
    return solution({
      details,
      message:
        "This imported module is independent of the current file, so prefer an absolute path to import for it",
      path: desiredAbsoluteImport,
    });
  }

  // Order matters, this function does not respect absoluteImportPrefix config option,
  // so we need to run only after the above.
  const desiredLocalImport = getDesiredLocalImport(details);
  if (desiredLocalImport) {
    return solution({
      details,
      message:
        "This imported module is local, so prefer a relative path to import for it",
      path: desiredLocalImport,
    });
  }

  return { allowed: true };
});
