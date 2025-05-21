import { defineImportsRule } from "../imports";
import { invalid } from "./tester";

const rule = defineImportsRule(function (details) {
  const { imported } = details;
  if (imported.verbatim === "evil")
    return { allowed: false, message: "Evil import" };
  return { allowed: true };
});

invalid(rule, "can not import dynamic import", "const vals = import('evil')");
