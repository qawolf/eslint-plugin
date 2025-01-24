import { defineRule } from "../eslint";
import { dirname } from "path";
import { readdirSync } from "fs";

export default defineRule(function (context) {
  const isConfig =
    context.physicalFilename.endsWith("/.imports.js") ||
    context.physicalFilename.endsWith("/.imports.ts");
  if (!isConfig) return {};
  const directory = dirname(context.physicalFilename);

  return {
    Program() {
      const entries = readdirSync(directory);
      function isValidEntry(entry: string) {
        return entries.some((e) => e === entry || e.startsWith(entry + "."));
      }

      // Ensure re-reading file from disk for persistent eslint runs, e.g. in IDEs
      delete require.cache[require.resolve(context.physicalFilename)];
      const { whitelist } = require(context.physicalFilename);
      if (!whitelist) return;

      Object.entries(whitelist).forEach(([key, value]) => {
        if (!isValidEntry(key)) {
          context.report({
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 2, column: 0 },
            },
            message: `Invalid whitelist key: ${key}, it seems there is no file/folder with that name in this directory`,
          });
        }

        if (Array.isArray(value)) {
          value.forEach((entry) => {
            if (typeof entry !== "string") return;
            if (!isValidEntry(entry)) {
              context.report({
                loc: {
                  start: { line: 1, column: 0 },
                  end: { line: 2, column: 0 },
                },
                message: `Invalid whitelist entry: ${key}: ${entry}, it seems there is no file/folder with that name in this directory`,
              });
            }
          });
        } else {
          context.report({
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 2, column: 0 },
            },
            message: `Value for whitelist entry ${key} must be an array`,
          });
        }
      });
    },
  };
});
