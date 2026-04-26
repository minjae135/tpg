import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // GitHub Pages 배포를 위해 상대 경로 사용
  build: {
    assetsInlineLimit: 0, // 에셋이 인라인되는 것을 방지
  }
})
