import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {viteSingleFile} from 'vite-plugin-singlefile'
import {resolve} from 'node:path'
export default defineConfig({plugins:[react(),tailwindcss(),viteSingleFile()],resolve:{alias:{'@':resolve('src'),'next/link':resolve('src/adapters/link.tsx'),'next/image':resolve('src/adapters/image.tsx'),'next/form':resolve('src/adapters/form.tsx'),'next/font/google':resolve('src/adapters/font.ts')}},build:{chunkSizeWarningLimit:16000}})
