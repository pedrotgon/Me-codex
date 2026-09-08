import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('pdfjs-dist')) return 'vendor-pdf';
              if (id.includes('recharts')) return 'vendor-recharts';
              if (id.includes('d3')) return 'vendor-d3';
              if (id.includes('@google/genai')) return 'vendor-genai';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('motion')) return 'vendor-motion';
              if (id.includes('react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
              if (id.includes('@hello-pangea/dnd')) return 'vendor-dnd';
              if (id.includes('tesseract.js')) return 'vendor-ocr';
              if (id.includes('jszip')) return 'vendor-jszip';
            }
          },
        },
      },
    },
  };
});
