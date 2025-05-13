import { defineImportsRule } from "../imports";

export default defineImportsRule(function (details) {
  const { names, imported } = details;
  if (imported.type !== "other") return { allowed: true };
  if (!names.all.includes("forwardRef") && !names.all.includes("ForwardedRef"))
    return { allowed: true };

  return {
    allowed: false,
    forbiddenNames: ["forwardRef", "ForwardedRef"],
    message: `Use the ref prop on your component instead. https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop`,
  };
});
