import { dirname } from "path";

import { loadConfig } from "tsconfig-paths";

export function moduleFromContext(
  context: { filename: string } & Parameters<typeof getProjectDirectory>[0],
): string {
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
}): string {
  if (!path.startsWith(projectDirectory)) {
    if (path === "<input>") {
      // Hack for our tests to have some value
      if (process.env.NODE_ENV === "test") return "";
      throw Error(
        "The path <input> is unrecognized. If you’re running this plugin’s unit tests, check the workaround above this error.",
      );
    }
    throw Error(
      `The path ${path} does not start with the project directory ${projectDirectory}`,
    );
  }
  const relativePath = path.substring(projectDirectory.length + 1);
  return relativePath.replace(/(\/index)?\.[jt]sx?$/, "");
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
