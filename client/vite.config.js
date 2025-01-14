import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/viewWishlist": {
        target: "http://localhost:3005", // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/viewWishlist/, "/viewWishlist"),
      },
    },
  },
});
