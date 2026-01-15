// electron.vite.config.ts
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload"),
        "@shared": resolve("src/shared")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload"),
        "@shared": resolve("src/shared")
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "~": resolve("src/renderer/src"),
        "@shared": resolve("src/shared")
      }
    },
    plugins: [react(), tailwindcss()]
  }
});
export {
  electron_vite_config_default as default
};
