import { type Node, defineRule } from "../eslint";

function detectError(name: string) {
  if (name.match(/^(find|get)(.*)Or(Create|Update|Upsert)/))
    return "We have conflicting mental models what a function with such a name is supposed to do. E.g. does it modify the storage if it finds a row? Prefer “ensure” instead and modify the storage in either case.";
  return undefined;
}

export default defineRule(function (context) {
  function onNameFound(node: Node, name: string) {
    if (!name) {
      console.error(node);
      throw Error("No name found on a node");
    }
    const error = detectError(name);
    if (error) context.report({ message: error, node });
  }

  return {
    FunctionDeclaration(node) {
      if (node.id?.name) onNameFound(node.id, node.id.name);
    },
    Property(node) {
      if (node.key.type === "Identifier") onNameFound(node.key, node.key.name);
      if (node.key.type === "Literal")
        onNameFound(node.key, String(node.key.value));
    },
    VariableDeclarator(node) {
      if (node.id.type === "Identifier") onNameFound(node.id, node.id.name);
    },
  };
});
