import type { Linter } from "eslint";

export const disabledRulesFromPresets = {
  // The only rule that requires type information, which makes linting 2.5 times slower,
  // and the rule is in big part made redundant by TypeScript (returned types + noImplicitReturns).
  "@typescript-eslint/switch-exhaustiveness-check": "off",

  "import/default": "off",
  // Disable import/order in favor of perfectionist/sort-imports
  "import/order": "off",
  // Turn off some slow rules. Could try re-enabling these in the future.
  // Use `TIMING=1 eslint .` to see how slow different rules are
  "import/namespace": "off",
  "import/no-named-as-default-member": "off",
  "import/no-named-as-default": "off",

  // There actually are situations where we need to import "jest" now
  "jest/no-jest-import": "off",

  // no-missing-import requires a lot of manual configuration,
  // and we already have TypeScript to catch missing imports
  "node/no-missing-import": "off",

  "promise/always-return": "off",
  "promise/no-callback-in-promise": "off",

  // Modern browsers all disable the opener by default, and have a strict default for Referrer-Policy
  // https://mathiasbynens.github.io/rel-noopener/
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  "react/jsx-no-target-blank": "off",
  // React is available in scope since React 17, we don't need this
  "react/jsx-uses-react": "off",
  // Prop types is deprecated
  "react/prop-types": "off",
  // React is available in scope since React 17, we don't need this
  "react/react-in-jsx-scope": "off",

  // Disabled in favor of @denis-sokolov/exhaustive-deps-async
  "react-hooks/exhaustive-deps": "off",
} satisfies Linter.Config["rules"];
