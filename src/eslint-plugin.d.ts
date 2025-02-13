declare module "eslint/use-at-your-own-risk" {
  const Rule: any;
  type BuiltinRules = {
    get: (name: string) => Rule;
  };
  export const builtinRules: BuiltinRules;
}
