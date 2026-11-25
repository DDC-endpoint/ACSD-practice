import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["drills/**/test/**/*.test.{ts,tsx,js}", "exam/**/*.test.ts"],
    css: false,
  },
});
