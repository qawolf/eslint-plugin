import { defineRule } from "../eslint";

const methodNames = ["stopPropagation", "stopImmediatePropagation"];

export default defineRule(function (context) {
  return {
    MemberExpression(node) {
      const { property } = node;

      const fieldName =
        property.type === "Identifier"
          ? property.name
          : property.type === "Literal" && typeof property.value === "string"
            ? property.value
            : undefined;

      if (!fieldName) return;
      if (!methodNames.includes(fieldName)) return;

      context.report({
        message:
          "Avoid stopPropagation. Instead, handle this at the higher level where something reacts to an event that it shouldn’t react to. Perhaps it needs a conditional? Another common path forward is to replace the generic handler at the higher level with a forwardClick() to a smaller nested element.",
        node: property,
      });
    },
  };
});
