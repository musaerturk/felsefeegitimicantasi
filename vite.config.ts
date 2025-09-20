import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Gemini API'si için process.env'yi istemci tarafında kullanılabilir hale getirin.
    // Bu, Netlify'da hem API_KEY hem de VITE_API_KEY ortam değişkenlerini kontrol eder.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.VITE_API_KEY)
  }
})
