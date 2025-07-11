import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  
  // Configuración específica para archivos Jest
  {
    files: ["**/*.config.js", "**/jest.*.js", "**/__mocks__/**/*.js", "jest.mocks.js", "jest.setup.js", "**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        jest: "readonly",
        global: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly"
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", 
      "@typescript-eslint/no-unused-vars": "off" 
    }
  },
  { 
    ignores: [
      // Archivos de configuración
      "tailwind.config.ts",
      "jest.config.ts",
      "next.config.mjs",
      "babel.config.cjs",
      "postcss.config.mjs",
      
      // Scripts de utilidad
      "scripts/**",
      "prisma/seed.ts",
      "seedUsers.js",
      "analyze-project.js",
      "createTestUsers.js",
      "recreateUsers.js",
      
      // Archivos de configuración Jest
      "jest.mocks.js",
      "jest.setup.js",
      
      // Archivos generados
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      
      // Archivos de prueba
      "**/__mocks__/**",
      "**/mocks/**",
      "**/__tests__/fileMock.js",
      "jest/**",
      
      // Archivos webpack generados
      "**/*.webpack.js",
      "**/*webpack*.js",
      
      // Archivos de declaración de tipos con any
      "**/types/declarations.d.ts"
    ] 
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, 
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      js: pluginJs,
      "@typescript-eslint": tseslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      // Reglas de ESLint base
      ...pluginJs.configs.recommended.rules,
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],

      // Reglas de TypeScript ESLint
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variableLike",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
      ],

      // Reglas de React
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "error", // Habilitado

      // Reglas de React Hooks
      ...pluginReactHooks.configs.recommended.rules,

      // Reglas de Next.js
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Reglas de Prettier
      "prettier/prettier": "error",
    },
  },
  pluginPrettier.configs.recommended,,
  },
  {
    files: ["src/lib/constants/*.ts"],
    rules: {
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "off",
    },
  },
];