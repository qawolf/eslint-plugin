import { type AST } from "../eslint";

export type CheckResult =
  | {
      allowed: true;
      fix?: never;
      forbiddenName?: never;
      forbiddenNames?: never;
      message?: never;
    }
  | ({
      allowed: false;
      message: string;
    } & (
      | {
          /**
           * Describe the details of how the violation can be fixed automatically
           */
          fix?: {
            /**
             * The new import path to replace the old path with
             */
            newPath: string;
          };
          forbiddenName?: never;
          forbiddenNames?: never;
        }
      | {
          fix?: never;
          forbiddenName?: string;
          forbiddenNames?: string[];
        }
    ));

export type ImportDetails = {
  imported: { verbatim: string } & (
    | {
        boundary:
          | "importing-is-outside-project"
          | {
              module: string;
              modulePrefix: string;
            };
        type: "relative";
        module: string;
        withTypeScriptAlias: boolean;
      }
    | { type: "other" }
    | { type: "relative-outside-project" }
  );
  importing: {
    isIndex: boolean;
    path: string;
  } & ({ insideProject: true; module: string } | { insideProject: false });
  names: {
    all: string[];
    default?: string;
    nonType: string[];
    type: string[];
  };
  node:
    | AST.ImportDeclaration
    | AST.ImportExpression
    | AST.ExportNamedDeclaration
    | AST.ExportAllDeclaration;
  /**
   * The root directory from where the module paths are calculated
   * E.g. if the app root is /home/user/app and the importing module is /home/user/app/components/Button/index.ts, the projectDirectory is /home/user/app, and the importing.module is components/Button/index
   */
  projectDirectory: string;
};

export type RelativeImportDetails = ImportDetails & {
  imported: { type: "relative" };
};
