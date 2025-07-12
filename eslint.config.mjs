import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Configuraciones globales y de ignorados
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "dist-jest/**",
      "venv/**",
      "build/**",
      "coverage/**",
      "tailwind.config.ts",
      "jest.config.ts",
      "next.config.mjs",
      "babel.config.cjs",
      "postcss.config.mjs",
      "scripts/**",
      "prisma/seed.ts",
      "**/*.webpack.js",
      "**/types/declarations.d.ts",
    ],
  },

  // 2. Configuración base de JavaScript
  pluginJs.configs.recommended,

  // Configuración para archivos CommonJS
  {
    files: ["**/*.js", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 3. Configuraciones recomendadas de TypeScript
  ...tseslint.configs.recommended,

  // 4. Configuración para React, Next.js y Prettier
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@next/next": nextPlugin,
      prettier: pluginPrettier,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "variableLike", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow" },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
      ],
    },
  },

  // 5. Configuración específica para archivos Jest
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/jest.*.js", "**/__mocks__/**"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  
  // 6. Configuración para desactivar reglas específicas en ciertos archivos
  {
    files: ["src/lib/constants/*.ts"],
    rules: {
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "off",
    },
  },
];