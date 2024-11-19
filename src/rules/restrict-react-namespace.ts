import { defineRule } from "../eslint";

export default defineRule(function (context) {
  return {
    TSQualifiedName(node) {
      if (node.left.type === "Identifier" && node.left.name === "React") {
        context.report({
          message: `Avoid using the global React namespace. Import required types explicitly instead: import { type ${node.right.name} } from "react";`,
          node,
        });
      }
    },
  };
});
