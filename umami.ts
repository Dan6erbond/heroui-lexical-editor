import type { Plugin } from 'vite';

export function umamiAnalyticsPlugin(): Plugin {
  return {
    name: 'umami-analytics',

    transformIndexHtml(_html, ctx) {
      // Vite dev server → skip (equivalent to NODE_ENV === 'development')
      if (ctx.server) {
        return;
      }

      return [
        {
          tag: 'script',
          attrs: {
            src: 'https://cloud.umami.is/script.js',
            defer: true,
            'data-website-id': 'a8815709-2029-4757-8ed5-73d504673629',
          },
          injectTo: 'head',
        },
      ];
    },
  };
}
