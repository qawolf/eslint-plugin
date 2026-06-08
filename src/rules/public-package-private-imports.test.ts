import { Linter } from "eslint";
import fs from "fs";
import os from "os";
import path from "path";
import test from "ava";

import rule, { testing } from "./public-package-private-imports";

test("blocks public packages from importing private packages", (t) => {
  const workspaceRoot = createWorkspace();

  try {
    const messages = lint({
      code: `
        import { allowed } from "@qawolf/public-package";
        import { external } from "eslint";
        import { blocked } from "@qawolf/private-package";
        export { blockedAgain } from "@qawolf/private-package/subpath";
      `,
      filename: path.join(
        workspaceRoot,
        "packages/public-package/src/index.ts",
      ),
    });

    t.deepEqual(
      messages.map(({ message }) => message),
      [testing.message, testing.message],
    );
  } finally {
    fs.rmSync(workspaceRoot, { force: true, recursive: true });
  }
});

test("blocks require and dynamic imports", (t) => {
  const workspaceRoot = createWorkspace();

  try {
    const messages = lint({
      code: `
        const blocked = require("@qawolf/private-package");
        const blockedAgain = import("@qawolf/private-package/subpath");
      `,
      filename: path.join(
        workspaceRoot,
        "packages/public-package/src/index.ts",
      ),
    });

    t.deepEqual(
      messages.map(({ message }) => message),
      [testing.message, testing.message],
    );
  } finally {
    fs.rmSync(workspaceRoot, { force: true, recursive: true });
  }
});

test("allows private package imports outside public packages", (t) => {
  const workspaceRoot = createWorkspace();

  try {
    t.deepEqual(
      lint({
        code: `import { allowed } from "@qawolf/private-package";`,
        filename: path.join(
          workspaceRoot,
          "packages/internal-package/src/index.ts",
        ),
      }),
      [],
    );
    t.deepEqual(
      lint({
        code: `import { allowed } from "@qawolf/private-package";`,
        filename: path.join(
          workspaceRoot,
          "packages/private-package/src/index.ts",
        ),
      }),
      [],
    );
  } finally {
    fs.rmSync(workspaceRoot, { force: true, recursive: true });
  }
});

function lint({ code, filename }: { code: string; filename: string }) {
  const linter = new Linter();
  linter.defineRule("@qawolf/public-package-private-imports", rule as never);

  return linter.verify(
    code,
    {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "@qawolf/public-package-private-imports": "error",
      },
    },
    { filename },
  );
}

function createWorkspace() {
  const workspaceRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "qawolf-eslint-plugin-"),
  );

  writePackageJson(workspaceRoot, "public-package", {
    name: "@qawolf/public-package",
    private: false,
  });
  writePackageJson(workspaceRoot, "private-package", {
    name: "@qawolf/private-package",
    private: true,
  });
  writePackageJson(workspaceRoot, "internal-package", {
    name: "@qawolf/internal-package",
  });

  return workspaceRoot;
}

function writePackageJson(
  workspaceRoot: string,
  packageName: string,
  packageJson: Record<string, unknown>,
) {
  const packageRoot = path.join(workspaceRoot, "packages", packageName);

  fs.mkdirSync(path.join(packageRoot, "src"), { recursive: true });
  fs.writeFileSync(
    path.join(packageRoot, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
}
