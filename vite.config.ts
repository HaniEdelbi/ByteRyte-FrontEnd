import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Uncomment these lines after running mkcert
    // https: {
    //   key: fs.readFileSync('./localhost+2-key.pem'),
    //   cert: fs.readFileSync('./localhost+2.pem'),
    // },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
