import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    tsconfig: "./tsconfig.json",
    include: ["**/*.test.ts", "**/*.spec.ts"],
    exclude: ["e2e/**", "**/node_modules/**"], // Exclude e2e tests and node_modules
    mock: {
      imports: {
        "@backend/lib/logging/server-logger": {
          ServerLogger: {
            info: () => {},
            warn: () => {},
            error: () => {},
          },
        },
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": "./src",
      "@backend": "./armonia-backend/src",
    },
  },
});
