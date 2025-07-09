import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    strictPort: true,
    proxy: {
      '/animalboard-service': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/user-service': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/festival-service': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  define: {
    global: "window", // crypto-browserify가 필요로 함
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
