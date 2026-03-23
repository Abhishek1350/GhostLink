   import { vercelPreset } from '@vercel/react-router/vite';
   import type { Config } from '@react-router/dev/config';
    
   export default {
     // Shopify scaffold is already SSR-first; keep this true
     ssr: true,
     presets: [vercelPreset()],
   } satisfies Config;