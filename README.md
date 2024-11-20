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

---

[QA Wolf](https://www.qawolf.com/) is a hybrid platform & service that helps software teams ship better software faster by taking QA completely off their plate.

![QA Wolf logo](./docs/qawolf.png)
