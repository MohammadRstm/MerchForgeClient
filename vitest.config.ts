import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        globals: true,
        setupFiles: ["src/test/setup.ts"],
        // Tests must not depend on a developer's local, gitignored .env file -
        // this was previously undefined in CI (no .env there), which threw
        // inside resolveImageUrl for any component using it.
        env: {
            VITE_SERVER_URL_DEV: "https://localhost:7021/",
        },
    },
});
