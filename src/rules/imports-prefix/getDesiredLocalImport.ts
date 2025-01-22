import { dirname } from "path";

import { type ImportDetails } from "../../imports";

// If the imported module is a sub-module of the importing module, it should be a relative import.

/**
 * Create a local import for modules that are close to each other.
 *
 * Warning: this does not respect absoluteImportPrefix config option.
 */
export function getDesiredLocalImport({ importing, imported }: ImportDetails) {
  if (imported.type !== "relative") return;

  const currentDirectory = importing.isIndex
    ? importing.module
    : dirname(importing.module);

  if (imported.module === currentDirectory) return ".";

  if (
    imported.module.startsWith(currentDirectory) &&
    imported.module[currentDirectory.length] === "/"
  ) {
    return (
      "./" +
      (currentDirectory
        ? imported.module.substring(currentDirectory.length + 1)
        : imported.module)
    );
  }

  return undefined;
}
