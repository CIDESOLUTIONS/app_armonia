import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    tsconfig: "./tsconfig.json",
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"], // Only include frontend tests
    exclude: ["e2e/**", "**/node_modules/**", "armonia-backend/**"], // Exclude e2e, node_modules, and backend tests
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
    deps: {
      inline: ["armonia-backend"], // Forzar a Vitest a procesar módulos de armonia-backend
    },
    transform: {
      '^.+\.(t|j)sx?$': ['@swc/jest', { 
        jsc: {
          transform: {
            decoratorMetadata: true,
          }
        }
       }],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend": path.resolve(__dirname, "./armonia-backend/src"),
    },
  },
});