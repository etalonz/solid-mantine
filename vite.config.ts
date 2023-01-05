import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import paths from "vite-tsconfig-paths";
import devtools from "@solid-devtools/transform";

export default defineConfig({
  plugins: [devtools({ name: true }), solidPlugin(), paths()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [/.[jt]sx?/],
    },
    deps: {
      registerNodeLoader: true,
    },
    threads: true,
    isolate: true,
    setupFiles: ["vitest.setup.ts"],
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
