import { defineRule, getSpecifierName } from "../../eslint";

import { type CheckResult, type ImportDetails } from "../types";

import { makeCheckingFunction } from "./check";

/**
 * Define our custom rules on which modules are allowed
 * to import which other modules.
 *
 * The importing module is the module in which the import statement is located. Importing modules and imported app modules are module paths relative to the app root, e.g. “components/Document/Env” or “pureLib/json”.
 *
 * The imported nodeModule is a verbatim value of the “from” part of the import statement, e.g. “react” or “react-dom/server”.
 */
export function defineImportsRule(f: (details: ImportDetails) => CheckResult) {
  return defineRule(function (context) {
    const check = makeCheckingFunction({ context, f });
    return {
      ExportAllDeclaration(node) {
        check({
          names: [],
          node,
          typeNames: [],
        });
      },
      ExportNamedDeclaration(node) {
        if (!node.source) return;
        const defaultExport = node.specifiers.find(
          // “local” here seems a little confusing, but is correct
          (specifier) => getSpecifierName(specifier.local) === "default",
        );
        const names = node.specifiers
          .map((specifier) => getSpecifierName(specifier.exported))
          .filter(Boolean);
        const typeNames =
          node.exportKind === "type"
            ? names
            : node.specifiers
                .filter((specifier) => specifier.exportKind === "type")
                .map((specifier) => getSpecifierName(specifier.exported));

        check({
          defaultName: defaultExport
            ? getSpecifierName(defaultExport.exported)
            : undefined,
          names,
          node,
          typeNames,
        });
      },
      ImportDeclaration(node) {
        const names = node.specifiers
          .map(
            (specifier) =>
              "imported" in specifier && getSpecifierName(specifier.imported),
          )
          .filter(Boolean);
        const typeNames =
          node.importKind === "type"
            ? names
            : node.specifiers
                .filter(
                  (specifier) =>
                    "importKind" in specifier &&
                    specifier.importKind === "type",
                )
                .map(
                  (specifier) =>
                    "imported" in specifier &&
                    getSpecifierName(specifier.imported),
                )
                .filter(Boolean);
        const defaultImport = node.specifiers.find(
          (specifier) => specifier.type === "ImportDefaultSpecifier",
        );
        check({
          defaultName: defaultImport?.local.name,
          names,
          node,
          typeNames,
        });
      },
      ImportExpression(node) {
        if (node.source.type !== "Literal") return;
        if (typeof node.source.value !== "string") return;

        const names: string[] = (function () {
          const { parent } = node;
          if (parent.type !== "AwaitExpression") return [];
          const grandParent = parent.parent;
          if (grandParent.type !== "VariableDeclarator") return [];
          const declarator = grandParent;
          if (declarator.id.type !== "ObjectPattern") return [];
          const { properties } = declarator.id;
          return properties
            .map((property) => {
              if (property.type !== "Property") return undefined;
              if (property.key.type !== "Identifier") return undefined;
              return property.key.name;
            })
            .filter(Boolean);
        })();
        check({
          names,
          node: {
            ...node,
            source: { ...node.source, value: node.source.value },
          },
          typeNames: [],
        });
      },
    };
  });
}
