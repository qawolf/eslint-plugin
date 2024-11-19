export const restrictedSyntaxRules = Object.entries({
  ExportDefaultDeclaration: "Use named exports instead of default exports",
  TSEnumDeclaration: "Use string unions instead of enums",
  ["UnaryExpression[operator='void']"]:
    "Use explicit `return undefined` instead of void. If you have a promise that you want to drop on the floor, use an explicit eslint-disable-next-line comment with an explanation of why dropping it on the floor is alright.",
}).map(([selector, message]) => ({ message, selector }));
