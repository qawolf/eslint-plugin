import { defineRule } from "../eslint";

export default defineRule(function (context) {
  const sourceCode = context.getSourceCode();
  return {
    NewExpression(node) {
      if ("name" in node.callee && node.callee.name === "Error")
        context.report({
          fix: (fixer) => {
            const text = sourceCode.getText(node);

            // Should not happen, but in case we’ve missed some
            // corner case, fail gracefully by leaving code intact
            if (!text.startsWith("new ")) return null;

            const textWithoutNew = text.substring(4);
            return fixer.replaceTextRange(node.range, textWithoutNew);
          },
          message: "Use Error() without new",
          node,
        });
    },
  };
});
