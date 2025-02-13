import { reword } from "@denis-sokolov/eslint-plugin";
import { builtinRules } from "eslint/use-at-your-own-risk";

const baseRule = builtinRules.get("no-floating-promises");
const rule = reword(
  baseRule,
  [
    "Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator.",
    "If you’re using `useEffect`, try some helper function like `useAsyncEffectAndCatch`.",
  ].join(" "),
);

export default rule;
