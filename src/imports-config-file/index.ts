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
  whitelist: Record<string, string[]> & { allowByDefault?: boolean };
};

function validateConfig(config: object): asserts config is Config {
  if (typeof config !== "object" || config === null) {
    throw Error(`Invalid imports config.`);
  }
  if (
    "absoluteImportPrefix" in config &&
    typeof config.absoluteImportPrefix !== "string" &&
    config.absoluteImportPrefix !== true
  ) {
    throw Error(
      `Invalid imports config: absoluteImportPrefix must be a string or true.`,
    );
  }
  if ("whitelist" in config) {
    if (typeof config.whitelist !== "object" || config.whitelist === null)
      throw Error(`Invalid imports config: whitelist must be an object.`);
    if (
      "allowByDefault" in config.whitelist &&
      typeof config.whitelist.allowByDefault !== "boolean"
    )
      throw Error(
        `Invalid imports config: whitelist.allowByDefault must be a boolean.`,
      );
    for (const [key, value] of Object.entries(config.whitelist)) {
      if (!Array.isArray(value)) {
        throw Error(
          `Invalid imports config: whitelist entry ${key} must be an array.`,
        );
      }
      for (const entry of value) {
        if (typeof entry !== "string") {
          throw Error(
            `Invalid imports config: whitelist entry ${key} must be an array of strings.`,
          );
        }
      }
    }
  }
}

export function getImportsConfigAt(directory: string): Config | undefined {
  const paths = filenames.map((suffix) => directory + "/" + suffix);
  for (const path of paths) {
    if (!existsSync(path)) continue;
    return readImportsConfigFile(path);
  }
  return undefined;
}

export function isImportsConfigFile(path: string): boolean {
  return filenames.some((suffix) => path.endsWith("/" + suffix));
}

export function readImportsConfigFile(path: string): Config {
  if (!isImportsConfigFile(path))
    throw Error(`Not an imports config file: ${path}`);

  // eslint-disable-next-line @typescript-eslint/no-var-requires -- ESLint does not support async rules, we must use a sync require. Under the hood this file runs in CommonJS anyway.
  const config = require(path);
  try {
    validateConfig(config);
  } catch (e) {
    throw Error(`Invalid imports config at ${path}`, { cause: e });
  }
  return config;
}
