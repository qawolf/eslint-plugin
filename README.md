# QA Wolf eslint plugin and configuration

1. To add it to a project, create a .eslintrc.js file:

   ```js
   module.exports = {
     extends: ["plugin:@qawolf/main"],
     plugins: ["@qawolf"],
   };
   ```

2. Add a linting script to your package.json:

   ```json
   {
     "scripts": {
       "lint": "eslint ."
     }
   }
   ```
