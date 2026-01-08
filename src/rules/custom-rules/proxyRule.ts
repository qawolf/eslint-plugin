import { existsSync } from "fs";
import { dirname, join } from "path";

import { type RuleDefinition, defineRule } from "../../eslint";
import { extensions } from "./extensions";

function moduleExists(path: string) {
  return extensions.some(
    (ext) => existsSync(path + ext) || existsSync(join(path, `index${ext}`)),
  );
}

let registeredTsNode = false;
function registerTsNode() {
  if (registeredTsNode) return;
  registeredTsNode = true;
  require("ts-node").register({
    compilerOptions: {
      module: "commonjs",
      moduleResolution: "node",
    },
    transpileOnly: true,
  });
}

// We define a rule proxy to postpone the `require` call until rule is used
// Otherwise we get a circular dependency problem: this file loads custom rules on initialization, but those import from this very plugin to get defineRule.
export function makeRuleProxy({
  customRulesDir,
  ruleName,
}: {
  customRulesDir: string;
  ruleName: string;
}): RuleDefinition {
  return defineRule((ctx) => {
    let dir = dirname(ctx.filename);
    while (true) {
      const possibleRuleModule = join(dir, customRulesDir, ruleName);
      if (moduleExists(possibleRuleModule)) {
        registerTsNode();
        const loadedRule: RuleDefinition = require(possibleRuleModule);
        return loadedRule.create(
          // RealContext and RuleContext type mismatch, see eslint.ts
          ctx as never as Parameters<RuleDefinition["create"]>[0],
        );
      }
      const nextDir = dirname(dir);
      if (nextDir === dir)
        throw Error(`Could not find ${ruleName} starting from ${ctx.filename}`);
      dir = nextDir;
    }
  });
}
