import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Curious Otter',
      description:
        'AI Agents Course на български с C# примери — неофициална адаптация на Hugging Face Agents Course.',

      defaultLocale: 'root',
      locales: {
        root: { label: 'Български', lang: 'bg' },
        en: { label: 'English', lang: 'en' },
      },

      customCss: ['./src/styles/fonts.css', './src/styles/theme.css'],

      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: '/fonts/manrope-latin-wght-normal.woff2',
            as: 'font',
            type: 'font/woff2',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: '/fonts/manrope-cyrillic-wght-normal.woff2',
            as: 'font',
            type: 'font/woff2',
            crossorigin: 'anonymous',
          },
        },
      ],

      components: {
        Header: './src/components/Header.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Sidebar: './src/components/Sidebar.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        PageTitle: './src/components/PageTitle.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        MobileTableOfContents: './src/components/MobileTableOfContents.astro',
        Pagination: './src/components/Pagination.astro',
        Footer: './src/components/Footer.astro',
      },

      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      lastUpdated: false,
      credits: false,

      expressiveCode: {
        themes: ['night-owl', 'one-light'],
        styleOverrides: {
          borderRadius: '1rem',
          borderWidth: '1px',
          borderColor: ({ theme }) => (theme.type === 'dark' ? '#1e293b' : '#e2e8f0'),
          codeBackground: ({ theme }) => (theme.type === 'dark' ? '#0e1729' : '#f6f8fb'),
          codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          codeFontSize: '0.875rem',
          codeLineHeight: '1.7',
          codePaddingBlock: '1.1rem',
          codePaddingInline: '1.25rem',
          frames: {
            shadowColor: 'transparent',
            editorActiveTabIndicatorTopColor: '#2dd4bf',
            editorActiveTabIndicatorBottomColor: 'transparent',
            editorTabBarBackground: ({ theme }) => (theme.type === 'dark' ? '#0b1220' : '#eef2f7'),
            editorTabBarBorderBottomColor: ({ theme }) => (theme.type === 'dark' ? '#1e293b' : '#e2e8f0'),
            terminalTitlebarBackground: ({ theme }) => (theme.type === 'dark' ? '#0b1220' : '#eef2f7'),
            terminalTitlebarBorderBottomColor: ({ theme }) => (theme.type === 'dark' ? '#1e293b' : '#e2e8f0'),
            terminalBackground: ({ theme }) => (theme.type === 'dark' ? '#0e1729' : '#f6f8fb'),
          },
        },
      },

      sidebar: [
        {
          label: 'Unit 0. Добре дошли в курса',
          translations: { en: 'Unit 0. Welcome to the course' },
          collapsed: true,
          items: [
            {
              label: 'Добре дошли в курса 🤗',
              translations: { en: 'Welcome to the course 🤗' },
              slug: 'ai-agents/unit-0/introduction',
            },
          ],
        },
        {
          label: 'Unit 1. Въведение в Agents',
          translations: { en: 'Unit 1. Introduction to Agents' },
          collapsed: true,
          items: [
            { label: 'Въведение', translations: { en: 'Introduction' }, slug: 'ai-agents/unit-1/introduction' },
            { label: 'Какво е Agent?', translations: { en: 'What is an Agent?' }, slug: 'ai-agents/unit-1/what-are-agents' },
            { label: 'Quick Quiz 1', translations: { en: 'Quick Quiz 1' }, slug: 'ai-agents/unit-1/quiz1' },
            { label: 'Какво са LLMs?', translations: { en: 'What are LLMs?' }, slug: 'ai-agents/unit-1/what-are-llms' },
            {
              label: 'Messages и Special Tokens',
              translations: { en: 'Messages and Special Tokens' },
              slug: 'ai-agents/unit-1/messages-and-special-tokens',
            },
            { label: 'Какво са Tools?', translations: { en: 'What are Tools?' }, slug: 'ai-agents/unit-1/tools' },
            { label: 'Quick Quiz 2', translations: { en: 'Quick Quiz 2' }, slug: 'ai-agents/unit-1/quiz2' },
            {
              label: 'Разбиране на AI Agents чрез цикъла Thought-Action-Observation',
              translations: { en: 'Understanding AI Agents through the Thought-Action-Observation Cycle' },
              slug: 'ai-agents/unit-1/agent-steps-and-structure',
            },
            {
              label: 'Thought: вътрешно Reasoning и подходът ReAct',
              translations: { en: 'Thought, Internal Reasoning and the Re-Act Approach' },
              slug: 'ai-agents/unit-1/thoughts',
            },
            {
              label: 'Actions: как Agent взаимодейства със средата си',
              translations: { en: 'Actions, Enabling the Agent to Engage with Its Environment' },
              slug: 'ai-agents/unit-1/actions',
            },
            {
              label: 'Observe: интегриране на Feedback за рефлексия и адаптация',
              translations: { en: 'Observe, Integrating Feedback to Reflect and Adapt' },
              slug: 'ai-agents/unit-1/observations',
            },
            {
              label: 'Dummy Agent Library',
              translations: { en: 'Dummy Agent Library' },
              slug: 'ai-agents/unit-1/dummy-agent-library',
            },
            {
              label: 'Да създадем първия си Agent с .NET',
              translations: { en: "Let's Create Our First Agent Using .NET" },
              slug: 'ai-agents/unit-1/tutorial',
            },
            { label: 'Final Quiz за Unit 1', translations: { en: 'Unit 1 Final Quiz' }, slug: 'ai-agents/unit-1/final-quiz' },
            { label: 'Заключение', translations: { en: 'Conclusion' }, slug: 'ai-agents/unit-1/conclusion' },
          ],
        },
      ],
    }),
  ],
});
