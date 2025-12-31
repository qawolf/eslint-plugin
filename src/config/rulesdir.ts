import { existsSync, lstatSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { execSync } from "child_process";

import rulesDirPlugin from "@qawolf/eslint-plugin-rulesdir";

function readPkgJson(
  path: string,
): { workspaces?: string[] } | "no-file" | "syntax-issue" {
  if (!existsSync(path)) return "no-file";
  try {
    const pkg = JSON.parse(readFileSync(path, "utf8"));
    if (typeof pkg !== "object" || !pkg)
      throw Error(`Invalid package.json at ${path}`);
    if ("workspaces" in pkg) {
      if (
        !Array.isArray(pkg.workspaces) ||
        pkg.workspaces.some((ws) => typeof ws !== "string")
      )
        throw Error(`Invalid workspaces field in package.json at ${path}`);
      return pkg as { workspaces: string[] };
    }
    return pkg;
  } catch (err) {
    console.warn(
      `Failed to parse JSON in ${path}, this might make custom linting rules not work correctly in the IDE.`,
    );
    console.warn(err);
    return "syntax-issue";
  }
}

function findProjectRoot(): string {
  const cwd = process.cwd();

  // Try to run `git rev-parse --show-superproject-working-tree`:
  try {
    const gitRoot = execSync("git rev-parse --show-superproject-working-tree", {
      encoding: "utf8",
    }).trim();
    if (gitRoot && existsSync(gitRoot)) return gitRoot;
  } catch {
    // Continue with other options below
  }

  // Try to find nearest package.json with workspaces field:
  let currentPath = cwd;
  while (true) {
    const pkgPath = join(currentPath, "package.json");
    const pkg = readPkgJson(pkgPath);
    if (pkg !== "no-file" && pkg !== "syntax-issue" && pkg.workspaces)
      return currentPath;
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) break;
    currentPath = parentPath;
  }

  // Try the closest package.json
  currentPath = cwd;
  while (true) {
    const packageJsonPath = join(currentPath, "package.json");
    if (existsSync(packageJsonPath)) return currentPath;
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) break;
    currentPath = parentPath;
  }

  // If none found, fall back on cwd
  return cwd;
}

function findProjectDirs(): string[] {
  const projectRoot = findProjectRoot();
  const dirs: string[] = [projectRoot];

  // If monorepo with workspaces, add all workspace dirs
  const pkgPath = join(projectRoot, "package.json");
  const pkg = readPkgJson(pkgPath);
  if (pkg !== "no-file" && pkg !== "syntax-issue" && pkg.workspaces) {
    for (const pattern of pkg.workspaces) {
      // Only support simple patterns like "packages/*"
      if (!pattern.endsWith("/*")) {
        console.warn(
          `Unsupported workspace pattern "${pattern}" in ${pkgPath}. Only patterns ending with /* are supported for ESLint custom rules loading.`,
        );
        continue;
      }
      const workspaceDir = join(projectRoot, pattern.slice(0, -2));
      if (!existsSync(workspaceDir)) continue;
      const entries = readdirSync(workspaceDir);
      for (const entry of entries) {
        const absEntryPath = join(workspaceDir, entry);
        if (lstatSync(absEntryPath).isDirectory()) dirs.push(absEntryPath);
      }
    }
  }
  return dirs;
}

export function configureRulesDir(relativePath: string) {
  if (relativePath[0] === "/") throw Error("path must be relative");

  // Merge, not overwrite.
  // Otherwise in some setups the order of file loading is wrong and
  // we overwrite RULES_DIR configured elsewhere.
  const previousRulesDir =
    typeof rulesDirPlugin.RULES_DIR === "string"
      ? [rulesDirPlugin.RULES_DIR]
      : (rulesDirPlugin.RULES_DIR ?? []);

  rulesDirPlugin.RULES_DIR = [
    ...previousRulesDir,
    // Load rules for all projects at once, so that the IDE can find them
    // without needing to reload the IDE for each project separately.
    ...findProjectDirs().map((dir) => join(dir, relativePath)),
  ];

  require("ts-node").register({
    compilerOptions: {
      module: "commonjs",
      moduleResolution: "node",
    },
    transpileOnly: true,
  });
}
