import { main } from "./config";
import { rules } from "./rules";
import { plugin } from "./plugin-object";

export { restrictedSyntaxRules } from "./config";
export * from "./eslint";
export * from "./imports";

// This mutation is needed so that the configs can reference the plugin
// before the plugin is fully defined. That’s the ESLint way, apparently.
// https://eslint.org/docs/v9.x/extend/plugins#configs-in-plugins
plugin.configs = { main };
plugin.rules = rules as any;

export default plugin;
