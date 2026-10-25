import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the built site work from any sub-path (GitHub Pages, S3, etc.)
export default defineConfig({ plugins: [react()], base: "./" });
