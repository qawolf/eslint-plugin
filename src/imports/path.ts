import { dirname } from "path";

import { loadConfig } from "tsconfig-paths";

export function moduleFromContext(
  context: { filename: string } & Parameters<typeof getProjectDirectory>[0],
): { module: string } | "path-outside-project" {
  return moduleFromPath({
    path: context.filename,
    projectDirectory: getProjectDirectory(context),
  });
}

export const moduleFromPath = function ({
  path,
  projectDirectory,
}: {
  path: string;
  projectDirectory: string;
}): { module: string } | "path-outside-project" {
  if (!path.startsWith(projectDirectory)) {
    if (path === "<input>") {
      // Hack for our tests to have some value
      if (process.env.NODE_ENV === "test") return { module: "" };
      throw Error(
        "The path <input> is unrecognized. If you’re running this plugin’s unit tests, check the workaround above this error.",
      );
    }
    return "path-outside-project";
  }
  const relativePath = path.substring(projectDirectory.length + 1);
  return { module: relativePath.replace(/(\/index)?\.[jt]sx?$/, "") };
};

export const isPathIndex = function (path: string): boolean {
  return path.match(/\/index\.[jt]sx?$/) !== null;
};

export const getProjectDirectory = function (context: {
  filename: string;
  settings: Record<string, unknown>;
}): string {
  const tsconfig = loadConfig(dirname(context.filename));
  if (tsconfig.resultType === "success") return tsconfig.absoluteBaseUrl;

  const settings = context.settings.qawolf;
  if (!settings || typeof settings !== "object") {
    throw Error(
      "Add `{ settings: { qawolf: {} } }` to your eslint configuration",
    );
  }
  const { projectDirectory } = settings as Record<string, unknown>;
  if (typeof projectDirectory !== "string") {
    throw Error(
      "Add `{ settings: { qawolf: { projectDirectory: __dirname } } }` to your eslint configuration",
    );
  }
  return projectDirectory;
};
