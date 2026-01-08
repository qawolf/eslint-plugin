# 20.0.0

- Breaking: custom rules are now called local rules. In config and eslint-disable lines, please replace `@qawolf/rulesdir/` with `@qawolf/local/`.
- Local rules now support even more monorepo setups.

# 19.0.0

- Breaking: custom rules must be uniquely named in a repository.
- Custom rules now always load in the IDE across projects in a monorepo.

# 18.0.0

- no-floating-promises is stricter now.
- Will detect if thorough linting is not configured in CI.

# 17.0.0

- Breaking: now requires Node 20.19.
- Breaking: parameter to defineImportsRule has slight changes, check the typings.
- Enable no-await-in-promise.
- Enable no-sequences.
- Import rules now handle files outside of projectDirectory.
- Added module encapsulation (`export const encapsulated = true` in `.imports.cts`).

# 16.0.0

- ~/ imports are now sorted correctly as local.

# 15.0.0

- Enabled many new react-hooks rules.
- Made rulesdir more compatible with complex configurations.

# 14.0.0

- @denis-sokolov/exhaustive-deps-async no longer has additionalHooks predefined. Define them in your configuration if need be.

# 13.0.0

- Switch from `prefer-inline` to `prefer-top-level-if-only-type-imports` for the `import/consistent-type-specifier-style` rule

# 12.1.1

- Relax jest/valid-title to allow variables as names

# 12.1.0

- Can now access the original import node when defining custom import rules

# 12.0.1

- Fix config mistake in 12.0.0

# 12.0.0

Switch from `eslint-plugin-node`, which is abandoned, to `eslint-plugin-n`. Although it's basically a drop-in replacement, there are some breaking changes:

- All config and eslint-disable comments will need to be updated from `node/` to `n/`
- There may be new errors found because `eslint-plugin-n` has been maintained and received fixes while `eslint-plugin-node` has not. Updating to 12.0.0 will require fixing or ignoring these new errors.

# 11.0.0

- Breaking: import rules now catch some dynamic imports.
- Disabled an outdated rule no-inner-declarations.

# 10.0.0

- Breaking: added no-forward-ref rule.

# 9.0.0

- Breaking: added react-server-components/use-client rule.

# 8.0.0

- Breaking: automatic formatting replaces `interface` with `type`.

# 7.1.0

- Can now use .imports.cts or .imports.cjs files (see imports-config rule).

# 7.0.0

- Breaking: @typescript-eslint/no-floating-promises rule has been renamed to @qawolf/no-floating-promises

# 6.0.0

- Breaking: added imports-prefix rule, now will be rewriting some import paths by default, and even more if you configure absoluteImportPrefix.

# 5.0.0

- Breaking: added and enabled no-utils rule.

# 4.0.0

- Breaking: automatic formatting changes impacts imports, class members, decorators.
- Can now use .imports.ts files (see imports-config rule).

# 3.0.0

- @qawolf/max-lines is now an error.
