import { valid, invalid } from "./tester";
import rule from "./no-forward-ref";

valid(rule, "can import Ref", "import { type Ref } from 'react'");
valid(rule, "can use ref prop in jsx", "<Component ref={ref} />");

invalid(
  rule,
  "can not import forwardRef",
  "import { forwardRef } from 'react'",
);
invalid(
  rule,
  "can not import type forwardRef",
  "import { type forwardRef } from 'react'",
);

invalid(
  rule,
  "can not import forwardRef with other imports",
  "import { type Ref, forwardRef, useState } from 'react'",
);

invalid(
  rule,
  "can not import ForwardedRef",
  "import { type ForwardedRef } from 'react'",
);
