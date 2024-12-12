import { defineRule } from "../eslint";

const pattern = /\butils?|helpers?|misc|tools\b/;

export default defineRule(function (context) {
  return {
    Program() {
      const relativePath = context.filename.replace(context.cwd, "");
      if (!relativePath.match(pattern)) return;
      context.report({
        loc: {
          end: { column: 999, line: 5 },
          start: {
            column: 0,
            // If we start at the very beginning, eslint-disable will not work
            line: 3,
          },
        },
        message: `The name of the current file includes ${pattern}. Avoid catch-all modules, try to organize code in more specifically-named modules. It is better to have 4 tiny well-named ones than 1 catch-all one. If you don’t know how to organize code, use the name “other”, that will give us clarity that the module has no place yet.`,
      });
    },
  };
});
