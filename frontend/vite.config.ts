import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    setupFiles: "./setupTests.ts",
    environment: "jsdom", // ✅ Ensures a browser-like environment
    exclude: [...configDefaults.exclude, "e2e/**"], // (Optional) Ignore E2E tests
  },
})
