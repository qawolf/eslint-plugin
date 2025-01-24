import { type RuleDefinition } from "../eslint";

import importsConfig from "./imports-config";
import importsConfigValid from "./imports-config-valid";
import importsPrefix from "./imports-prefix";
import maxLines from "./max-lines";
import noUtils from "./no-utils";
import restrictNames from "./restrict-names";
import restrictNewError from "./restrict-new-error";
import restrictReactNamespace from "./restrict-react-namespace";
import restrictStopPropagation from "./restrict-stop-propagation";

export const rules = {
  "imports-config": importsConfig,
  "imports-config-valid": importsConfigValid,
  "imports-prefix": importsPrefix,
  "max-lines": maxLines,
  "no-utils": noUtils,
  "restrict-names": restrictNames,
  "restrict-new-error": restrictNewError,
  "restrict-react-namespace": restrictReactNamespace,
  "restrict-stop-propagation": restrictStopPropagation,
} satisfies Record<string, RuleDefinition>;
