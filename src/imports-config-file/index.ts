import { existsSync } from "fs";

// Ordered by priority
const filenames = [
  ".imports.ts",
  ".imports.js",
  ".imports.cts",
  ".imports.cjs",
];

type Config = {
  absoluteImportPrefix?: string | true;
  encapsulated?: boolean;
  whitelist: Record<string, string[]> & { allowByDefault?: boolean };
};

function validateConfig(
  config: object,
): { valid: true; config: Config } | { valid: false; error: string } {
  if (typeof config !== "object" || config === null) {
    return { valid: false, error: `Invalid imports config.` };
  }
  if (
    "absoluteImportPrefix" in config &&
    typeof config.absoluteImportPrefix !== "string" &&
    config.absoluteImportPrefix !== true
  ) {
    return {
      valid: false,
      error: `absoluteImportPrefix must be a string or true.`,
    };
  }
  if ("encapsulated" in config && typeof config.encapsulated !== "boolean")
    return {
      valid: false,
      error: `encapsulated must be a boolean.`,
    };
  if ("whitelist" in config) {
    if (typeof config.whitelist !== "object" || config.whitelist === null)
      return {
        valid: false,
        error: `whitelist must be an object.`,
      };
    if (
      "allowByDefault" in config.whitelist &&
      typeof config.whitelist.allowByDefault !== "boolean"
    )
      return {
        valid: false,
        error: `whitelist.allowByDefault must be a boolean.`,
      };
    for (const [key, value] of Object.entries(config.whitelist)) {
      if (!Array.isArray(value)) {
        return {
          valid: false,
          error: `whitelist entry ${key} must be an array.`,
        };
      }
      for (const entry of value) {
        if (typeof entry !== "string") {
          return {
            valid: false,
            error: `whitelist entry ${key} must be an array of strings.`,
          };
        }
      }
    }
  }
  return { valid: true, config: config as Config };
}

export function getImportsConfigAt(directory: string): Config | undefined {
  const paths = filenames.map((suffix) => directory + "/" + suffix);
  for (const path of paths) {
    if (!existsSync(path)) continue;
    const readResult = readImportsConfigFile(path);
    if (!readResult.valid)
      throw Error(`Invalid imports config at ${path}: ${readResult.error}`);
    return readResult.config;
  }
  return undefined;
}

export function isImportsConfigFile(path: string): boolean {
  return filenames.some((suffix) => path.endsWith("/" + suffix));
}

export function readImportsConfigFile(path: string) {
  if (!isImportsConfigFile(path))
    throw Error(`Not an imports config file: ${path}`);

  // eslint-disable-next-line @typescript-eslint/no-var-requires -- ESLint does not support async rules, we must use a sync require. Under the hood this file runs in CommonJS anyway.
  const requireResult = require(path);
  return validateConfig(requireResult);
}
