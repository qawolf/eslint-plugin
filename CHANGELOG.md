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
