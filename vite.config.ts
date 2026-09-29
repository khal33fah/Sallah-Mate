import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'Sallah Mate - Prayer & Dunya Reminder',
          short_name: 'SallahMate',
          description: 'Daily prayer times tracker with camera prayer-mate verification, lock screen Ayah reminders of purpose and Iman, and Islamic library.',
          theme_color: '#0c0a09',
          background_color: '#0c0a09',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: false,
        },
      }),
      {
        name: 'safe-ws-plugin',
        transform(code: string, id: string) {
          if (id.includes('client.mjs') || id.includes('bundledDevClient.mjs') || id.includes('@vite/client')) {
            return code.replace(/ws\.send\(JSON\.stringify\(data\)\);/g, 'if (ws && ws.readyState === ws.OPEN) { ws.send(JSON.stringify(data)); }');
          }
        },
        configureServer(server: any) {
          const dummyWs = {
            send: () => {},
            close: () => {},
            on: () => {},
            off: () => {},
            clients: new Set(),
            listen: () => {},
          };
          if (!server.ws) {
            server.ws = dummyWs;
          } else if (!server.ws.send) {
            server.ws.send = () => {};
          }
          if (!server.hot) {
            server.hot = dummyWs;
          } else if (!server.hot.send) {
            server.hot.send = () => {};
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: false,
      forwardConsole: false,
    } as any,
  };
});
