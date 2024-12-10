import {
  type ESLintUtils,
  type TSESLint,
  type TSESTree as AST,
} from "@typescript-eslint/utils";
import { type Rule } from "eslint";

export { AST };
export type Node = AST.Node;

type RealContext = Parameters<
  ESLintUtils.RuleCreateAndOptions<never[], "">["create"]
>[0];

export type RuleContext = Omit<RealContext, "report"> & {
  // eslint typings require passing localized messageIds,
  // but the library actually allows passing simple messages
  report: (
    arg: { fix?: Rule.ReportFixer; message: string } & (
      | { node: Node }
      | { loc: AST.SourceLocation }
    ),
  ) => void;
};

export type RuleDefinition = TSESLint.RuleModule<string, unknown[]>;
export type RuleEvaluatingFunction = TSESLint.RuleListener;

export function defineRule(
  f: (context: RuleContext) => RuleEvaluatingFunction,
): RuleDefinition {
  return {
    create: (context: RealContext) => f(context as never as RuleContext),
    defaultOptions: [],
    meta: {
      // Required if we want to make any automatic fixes
      // There seems to be no downside to mark a rule that does not fix ever as fixable
      fixable: "code",
      messages: {},
      type: "problem",
      schema: [],
    },
  };
}

// Generalize for string literals in import/export statements of ES2022
export function getSpecifierName(node: AST.StringLiteral | AST.Identifier) {
  return "name" in node ? node.name : node.value;
}
