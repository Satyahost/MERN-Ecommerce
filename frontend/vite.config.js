import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-ecommerce-3-19e6.onrender.com", // your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
