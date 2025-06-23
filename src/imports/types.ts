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
        boundaryModule: string;
        boundaryPrefix: string;
        type: "relative";
        module: string;
        withTypeScriptAlias: boolean;
      }
    | { type: "other" }
  );
  importing: {
    isIndex: boolean;
    module: string;
    path: string;
  };
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
};

export type RelativeImportDetails = ImportDetails & {
  imported: { type: "relative" };
};
