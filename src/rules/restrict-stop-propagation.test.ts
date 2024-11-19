import { valid, invalid } from "./tester";
import rule from "./restrict-stop-propagation";

invalid(rule, "can not use stopPropagation", "e.stopPropagation()");
invalid(
  rule,
  "can not use stopImmediatePropagation",
  "e.stopImmediatePropagation()",
);
invalid(rule, "can not reference stopPropagation", "e.stopPropagation");
invalid(rule, "can not reference stopPropagation []", "e['stopPropagation']");

valid(rule, "can use strings", "e = 'stopPropagation'");
valid(rule, "can use variable names", "const stopPropagation = () => {}");
valid(rule, "can use preventDefault", "e.preventDefault()");
