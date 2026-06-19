import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages는 /레포이름/ 경로로 서빙되므로 base 설정 필요
  base: "/DevSecOps_dockerfile/",
});
