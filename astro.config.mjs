
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Curious Otter',
      description: 'AI и C# обучение на български',

      locales: {
        root: {
          label: 'Български',
          lang: 'bg',
        },
      },

      customCss: [
        './src/styles/custom.css',
      ],

      sidebar: [
        {
          label: 'Начало',
          link: '/',
        },
        {
          label: 'AI Agents с C#',
          items: [
            {
              slug: 'courses/ai-agents/unit-1/what-is-agent',
            },
          ],
        },
      ],
    }),
  ],
});
