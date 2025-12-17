import { defineRule } from "../eslint";
import {
  isImportsConfigFile,
  readImportsConfigFile,
} from "../imports-config-file";
import { dirname } from "path";
import { readdirSync } from "fs";

export default defineRule(function (context) {
  if (!isImportsConfigFile(context.physicalFilename)) return {};
  const directory = dirname(context.physicalFilename);

  return {
    Program() {
      const entries = readdirSync(directory);
      function isValidEntry(entry: string) {
        return entries.some((e) => e === entry || e.startsWith(entry + "."));
      }

      // Ensure re-reading file from disk for persistent eslint runs, e.g. in IDEs
      delete require.cache[require.resolve(context.physicalFilename)];
      let config;
      try {
        config = readImportsConfigFile(context.physicalFilename);
      } catch (e) {
        context.report({
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 2, column: 0 },
          },
          message: `Invalid imports config file: ${(e as Error).message}`,
        });
        return;
      }

      Object.entries(config.whitelist ?? {}).forEach(([key]) => {
        if (!isValidEntry(key)) {
          context.report({
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 2, column: 0 },
            },
            message: `Invalid whitelist key: ${key}, it seems there is no file/folder with that name in this directory`,
          });
        }
      });
    },
  };
});
