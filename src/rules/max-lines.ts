import { basename } from "path";

import { defineRule } from "../eslint";

const desired = 200;

export default defineRule(function (context) {
  const sourceCode = context.getSourceCode();
  const filename = basename(context.getFilename());

  const message = [
    `File is very long.`,
    `Please split it into smaller files, under ${desired} lines long.`,
    filename.includes(".test.")
      ? "Simplest way to start would be to look for describe() blocks and move them into files of their own."
      : `Simplest way to start would be to move this file into its own subdirectory (${filename.replace(/\.(tsx?)$/, "/index.$1")}) and start extracting bits of code into separate files.`,
  ]
    .filter((s) => s)
    .join(" ");

  return {
    Program() {
      if (sourceCode.lines.length > desired + 5) {
        context.report({
          loc: {
            end: { column: 0, line: desired + 1 },
            start: { column: 0, line: desired + 10 },
          },
          message,
        });
      }
    },
  };
});
