import { type RuleDefinition } from "../eslint";

import importsConfig from "./imports-config";
import importsConfigValid from "./imports-config-valid";
import importsFromEncapsulated from "./imports-from-encapsulated";
import importsPrefix from "./imports-prefix";
import maxLines from "./max-lines";
import noFloatingPromises from "./no-floating-promises";
import noForwardRef from "./no-forward-ref";
import noUtils from "./no-utils";
import restrictNames from "./restrict-names";
import restrictNewError from "./restrict-new-error";
import restrictReactNamespace from "./restrict-react-namespace";
import restrictStopPropagation from "./restrict-stop-propagation";
import { findLocalRules } from "./local-rules";

const ourRules = {
  "imports-config": importsConfig,
  "imports-config-valid": importsConfigValid,
  "imports-from-encapsulated": importsFromEncapsulated,
  "imports-prefix": importsPrefix,
  "max-lines": maxLines,
  "no-utils": noUtils,
  "restrict-names": restrictNames,
  "restrict-new-error": restrictNewError,
  "restrict-react-namespace": restrictReactNamespace,
  "restrict-stop-propagation": restrictStopPropagation,
  "no-floating-promises": noFloatingPromises,
  "no-forward-ref": noForwardRef,
} satisfies Record<string, RuleDefinition>;

const localRules = findLocalRules(".eslint/local-rules");

export const rules = {
  ...ourRules,
  ...localRules,
} as Record<string, RuleDefinition>;
