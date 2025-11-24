import { raw } from "esbuild-raw-plugin";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  let executeScript = false;
  if (options.format) {
    if (typeof options.format === "string" && options.format === "iife") {
      executeScript = true;
    } else if (
      Array.isArray(options.format) &&
      options.format.includes("iife")
    ) {
      executeScript = true;
    }
  }

  if (executeScript) {
    // first build step, build scripts
    return {
      name: "scripts",
      entry: ["src/theme-script.ts"],
      outDir: undefined,
      esbuildOptions(options) {
        options.outfile = "src/theme-script.iife.js";
      },
      minify: true,
      format: ["iife"],
      clean: false,
    };
  }
  // build library
  return {
    name: "library",
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["cjs", "esm"],
    external: ["react"],
    esbuildPlugins: [raw()],
    dts: true,
    clean: true,
  };
});
