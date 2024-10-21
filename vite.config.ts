import { extname, relative, resolve } from "node:path"
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from "vite-plugin-dts"
import { libInjectCss } from "vite-plugin-lib-inject-css"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/pkg/main.tsx"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob.sync("src/pkg/**/*.{ts,tsx}", { ignore: ["**/*.stories.tsx", "**/*.test.ts", "**/*.d.ts"] }).map(
          (file) => [
            relative(resolve("src/pkg"), file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js'
      }
    },
    copyPublicDir: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
