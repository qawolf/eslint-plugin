import tsPlugin from "@typescript-eslint/eslint-plugin";

const baseRule = tsPlugin.rules["no-floating-promises"];

if (!baseRule) throw Error("no-floating-promises is not available");

export default {
  ...baseRule,
  meta: {
    ...baseRule.meta,
    messages: {
      ...baseRule.meta.messages,
      floatingVoid:
        baseRule.meta.messages.floatingVoid +
        " If you're using `useEffect`, try some helper function like `useAsyncEffectAndCatch`.",
    },
  },
};
