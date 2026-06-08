import fs from "fs";
import path from "path";

import { defineRule, type Node } from "../eslint";

const message = "Public packages must not import private QA Wolf packages.";
const packageCache = new Map<string, string[]>();

export default defineRule(function (context) {
  const workspaceRoot = findPublicPackageWorkspaceRoot(context.filename);
  if (!workspaceRoot) return {};

  const privatePackageNames = findPrivatePackageNames(workspaceRoot);
  if (!privatePackageNames.length) return {};

  function check(source: string, node: Node) {
    const importsPrivatePackage = privatePackageNames.some(
      (packageName) =>
        source === packageName || source.startsWith(`${packageName}/`),
    );

    if (!importsPrivatePackage) return;

    context.report({ message, node });
  }

  return {
    CallExpression(node) {
      if (node.callee.type !== "Identifier") return;
      if (node.callee.name !== "require") return;

      const [source] = node.arguments;
      if (source?.type !== "Literal") return;
      if (typeof source.value !== "string") return;

      check(source.value, node);
    },
    ExportAllDeclaration(node) {
      check(node.source.value, node);
    },
    ExportNamedDeclaration(node) {
      if (!node.source) return;

      check(node.source.value, node);
    },
    ImportDeclaration(node) {
      check(node.source.value, node);
    },
    ImportExpression(node) {
      if (node.source.type !== "Literal") return;
      if (typeof node.source.value !== "string") return;

      check(node.source.value, node);
    },
  };
});

function findPublicPackageWorkspaceRoot(filename: string): string | undefined {
  const packageRoot = findNearestPackageRoot(filename);
  if (!packageRoot) return undefined;

  const packagesRoot = path.dirname(packageRoot);
  if (path.basename(packagesRoot) !== "packages") return undefined;

  const packageJson = readPackageJson(packageRoot);
  if (packageJson?.private !== false) return undefined;

  return path.dirname(packagesRoot);
}

function findNearestPackageRoot(filename: string): string | undefined {
  let directory = path.dirname(filename);

  while (true) {
    if (fs.existsSync(path.join(directory, "package.json"))) return directory;

    const parent = path.dirname(directory);
    if (parent === directory) return undefined;

    directory = parent;
  }
}

function findPrivatePackageNames(workspaceRoot: string) {
  const cached = packageCache.get(workspaceRoot);
  if (cached) return cached;

  const packagesRoot = path.join(workspaceRoot, "packages");
  const names: string[] = [];

  if (!fs.existsSync(packagesRoot)) {
    packageCache.set(workspaceRoot, names);
    return names;
  }

  for (const entry of fs.readdirSync(packagesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const packageJson = readPackageJson(path.join(packagesRoot, entry.name));
    if (packageJson?.private !== true) continue;
    if (typeof packageJson.name !== "string") continue;

    names.push(packageJson.name);
  }

  packageCache.set(workspaceRoot, names);
  return names;
}

function readPackageJson(packageRoot: string) {
  const packageJsonPath = path.join(packageRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) return undefined;

  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
    name?: unknown;
    private?: unknown;
  };
}

export const testing = { message };
