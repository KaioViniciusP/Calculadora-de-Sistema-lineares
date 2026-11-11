import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

/**
 * Build em arquivo único: JS, CSS e fontes são embutidos no index.html,
 * permitindo abrir o resultado com duplo clique, sem servidor.
 */
export default defineConfig({
  plugins: [viteSingleFile()],
  esbuild: { jsx: "automatic" },
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
  },
})
