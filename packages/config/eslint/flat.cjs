const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const unusedImports = require("eslint-plugin-unused-imports");

function scopeFiles(entry, scopeDir) {
  const next = { ...entry };

  if (next.files) {
    next.files = next.files.map((p) => `${scopeDir}/${p}`);
  }

  if (next.ignores) {
    next.ignores = next.ignores.map((p) => `${scopeDir}/${p}`);
  }

  return next;
}

const nextFlatConfig = require("eslint-config-next").map((entry) => scopeFiles(entry, "apps/web"));

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  ...nextFlatConfig,
  {
    name: "leaptools/web-overrides",
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports"
        }
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-unresolved": "off"
    }
  },
  {
    name: "leaptools/base",
    files: ["apps/electron/**/*.{js,cjs,mjs,ts,tsx}", "packages/**/*.{js,cjs,mjs,ts,tsx}"],
    ignores: ["**/dist/**", "**/dist-release/**", "**/.next/**", "**/out/**", "**/build/**", "**/node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports"
        }
      ],

      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-unresolved": "off"
    }
  }
];
