import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
// import daisyui from 'daisyui';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  tailwindcss(),
],
  server:{
    port:3000,
    proxy:{
      "/api":{
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    }
  }
})
