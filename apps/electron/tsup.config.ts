import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    main: "src/main.ts",
    preload: "src/preload.ts"
  },
  outDir: "dist",
  sourcemap: true,
  clean: true,
  format: ["cjs"],
  platform: "node",
  target: "node20",
  external: ["electron"]
});

