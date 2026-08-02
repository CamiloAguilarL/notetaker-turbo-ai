import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/components/auth/account-bar.tsx",
        "src/components/auth/auth-form.tsx",
        "src/components/notes/*.tsx",
        "src/lib/category-theme.ts",
        "src/lib/format-date.ts",
      ],
      exclude: ["**/*.test.tsx"],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 95,
      },
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
