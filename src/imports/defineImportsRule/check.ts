import path from "path";

import { loadConfig, createMatchPath } from "tsconfig-paths";

import { type AST, type RuleContext, getSpecifierName } from "../../eslint";
import { findBoundary } from "../modules";

import {
  getProjectDirectory,
  isPathIndex,
  moduleFromContext,
  moduleFromPath,
} from "../path";
import { type CheckResult, type ImportDetails } from "../types";

type CheckFunction = (details: ImportDetails) => CheckResult;

export function makeCheckingFunction({
  context,
  f,
}: {
  context: RuleContext;
  f: CheckFunction;
}) {
  const importingPath = context.filename;
  const projectDirectory = getProjectDirectory(context);
  const importingModule = moduleFromContext(context);
  const config = loadConfig(path.dirname(importingPath));
  const matchTypescriptPaths =
    config.resultType === "success"
      ? createMatchPath(config.absoluteBaseUrl, config.paths)
      : undefined;
  if (!matchTypescriptPaths && importingPath.match(/\.tsx?/)) {
    console.warn(
      `Could not find tsconfig.json for ${importingPath}, TypeScript paths will not be resolved.`,
    );
  }

  return function ({
    defaultName,
    names,
    node,
    typeNames,
  }: {
    defaultName?: string;
    names: string[];
    node: { source: { value: string } } & (
      | AST.ImportDeclaration
      | AST.ExportNamedDeclaration
      | AST.ExportAllDeclaration
      | AST.ImportExpression
    );
    typeNames: string[];
  }) {
    const imported: ImportDetails["imported"] = (function () {
      const verbatim = node.source.value;
      if (verbatim.startsWith(".")) {
        const resolvedPath = path.resolve(
          path.dirname(importingPath),
          verbatim,
        );
        const importedModule = moduleFromPath({
          path: resolvedPath,
          projectDirectory,
        });
        const boundaryModule = findBoundary(importingModule, importedModule);
        return {
          boundaryModule,
          boundaryPrefix: boundaryModule ? boundaryModule + "/" : "",
          module: importedModule,
          type: "relative",
          verbatim,
          withTypeScriptAlias: false,
        };
      }

      if (matchTypescriptPaths) {
        const matchedPath = matchTypescriptPaths(verbatim);
        if (matchedPath?.startsWith(projectDirectory)) {
          const module = moduleFromPath({
            path: matchedPath,
            projectDirectory,
          });
          const boundaryModule = findBoundary(importingModule, module);
          return {
            boundaryModule,
            boundaryPrefix: boundaryModule ? boundaryModule + "/" : "",
            type: "relative",
            module,
            verbatim,
            withTypeScriptAlias: true,
          };
        }
      }

      return {
        type: "other",
        verbatim,
      };
    })();

    const returned = f({
      names: {
        default: defaultName,
        all: names,
        type: typeNames,
        nonType: names.filter((name) => !typeNames.includes(name)),
      },
      imported,
      importing: {
        module: importingModule,
        path: importingPath,
        isIndex: isPathIndex(importingPath),
      },
      node,
      projectDirectory,
    });
    if (typeof returned !== "object") {
      throw Error(
        `Return a { allowed: boolean; message: string } object from your checkAppImport function.`,
      );
    }
    const {
      allowed,
      fix,
      forbiddenName,
      forbiddenNames,
      message = "Importing this module here is restricted by our custom linting rules",
    } = returned;
    if (allowed) return;
    if (forbiddenName || forbiddenNames) {
      const names = (forbiddenNames ?? []).concat(
        forbiddenName ? [forbiddenName] : [],
      );
      const specifiers =
        node.type === "ImportDeclaration"
          ? node.specifiers.filter(
              (specifier) =>
                "imported" in specifier &&
                names.includes(getSpecifierName(specifier.imported)),
            )
          : node.type === "ExportNamedDeclaration"
            ? node.specifiers.filter((specifier) =>
                names.includes(getSpecifierName(specifier.exported)),
              )
            : "can-not-find-specifiers";
      if (specifiers !== "can-not-find-specifiers") {
        if (specifiers.length === 0) {
          throw Error(
            "You have provided a forbiddenName or forbiddenNames, but I did not pass you any of these as actually imported.",
          );
        }
        specifiers.forEach((specifier) => {
          context.report({
            loc: specifier.loc,
            message,
          });
        });
        return;
      }
    }
    context.report({
      fix: fix
        ? (fixer) =>
            fixer.replaceTextRange(node.source.range, `"${fix.newPath}"`)
        : undefined,
      message,
      node,
    });
  };
}
