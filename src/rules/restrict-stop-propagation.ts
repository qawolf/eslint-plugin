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
        message: [
          "stopPropagation is always a hack! stopPropagation lies to the rest of the code to indirectly secretly change the behavior of some code far away from yours.",
          "",
          "If you’re trying to prevent a click handler at a higher level, instead consider to handle it at the higher level in the first place, and use forwardClick to send it back down.",
          "If you’re trying to prevent a hotkey handler at a higher level, use hotkey tooling that allows to solve conflicts between hotkeys in a smarter way.",
          "If you have some other event you do not want to be processed at the higher level, then add a conditional in your code at that higher level. After all, if it’s not supposed to be processed unconditionally, then that event handler should not be unconditional.",
        ].join("\n"),
        node: property,
      });
    },
  };
});
