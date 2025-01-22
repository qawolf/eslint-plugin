# QA Wolf eslint plugin and configuration

Use this in your project:

1. Install the plugin and ESLint:

   ```sh
   npm install --save-dev @qawolf/eslint-plugin eslint@8
   ```

2. Create an .eslintrc.js file:

   ```js
   module.exports = {
     extends: ["plugin:@qawolf/main"],
     plugins: ["@qawolf"],
   };
   ```

3. Add linting scripts to your package.json:

   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:thorough": "THOROUGH_LINT=true eslint ."
     }
   }
   ```

   You probably want to run the thorough one in CI.

## Configure imports

Create `.imports.js/ts` files anywhere in your codebase to configure how the code in those directories needs to be imported.

If the directory in question contains somewhat independent code modules underneath, export an `absoluteImportPrefix` variable to ensure that the subdirectories are not imported with relative paths:

```ts
// At the top level
// This path is something you already have configured in tsconfig paths,
// this plugin only rewrites the files, it does not touch your build/run configuration.
export const absoluteImportPrefix = "myapp/";

// Anywhere deeper in the app a shorthand is available,
// it will combine the top-level prefix with the path to the directory:
export const absoluteImportPrefix = true;
```

An important tool of maintaining architecture is restricting which parts of your codebase can depend on which other parts of your codebase. Export a `whitelist` variable to define which subdirectories can depend on which other subdirectories:

```ts
export const whitelist = {
  subdir1: ["subdir2"],
  subdir2: [],
};
```

---

[QA Wolf](https://www.qawolf.com/) is a hybrid platform & service that helps software teams ship better software faster by taking QA completely off their plate.

![QA Wolf logo](./docs/qawolf.png)
