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

      customCss: ['./src/styles/fonts.css', './src/styles/theme.css', './src/styles/course.css'],

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
        MarkdownContent: './src/components/MarkdownContent.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        MobileTableOfContents: './src/components/MobileTableOfContents.astro',
        Pagination: './src/components/Pagination.astro',
        Footer: './src/components/Footer.astro',
      },

      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      lastUpdated: false,
      credits: false,

      sidebar: [
        {
          label: 'Unit 0. Добре дошли в курса',
          translations: { en: 'Unit 0. Welcome to the course' },
          items: [
            {
              label: 'Добре дошли в курса 🤗',
              translations: { en: 'Welcome to the course 🤗' },
              slug: 'unit-0/introduction',
            },
          ],
        },
        {
          label: 'Unit 1. Въведение в Agents',
          translations: { en: 'Unit 1. Introduction to Agents' },
          items: [
            { label: 'Въведение', translations: { en: 'Introduction' }, slug: 'unit-1/introduction' },
            { label: 'Какво е Agent?', translations: { en: 'What is an Agent?' }, slug: 'unit-1/what-are-agents' },
            { label: 'Quick Quiz 1', translations: { en: 'Quick Quiz 1' }, slug: 'unit-1/quiz1' },
            { label: 'Какво са LLMs?', translations: { en: 'What are LLMs?' }, slug: 'unit-1/what-are-llms' },
            {
              label: 'Messages и Special Tokens',
              translations: { en: 'Messages and Special Tokens' },
              slug: 'unit-1/messages-and-special-tokens',
            },
            { label: 'Какво са Tools?', translations: { en: 'What are Tools?' }, slug: 'unit-1/tools' },
            { label: 'Quick Quiz 2', translations: { en: 'Quick Quiz 2' }, slug: 'unit-1/quiz2' },
            {
              label: 'Разбиране на AI Agents чрез цикъла Thought-Action-Observation',
              translations: { en: 'Understanding AI Agents through the Thought-Action-Observation Cycle' },
              slug: 'unit-1/agent-steps-and-structure',
            },
            {
              label: 'Thought: вътрешно Reasoning и подходът ReAct',
              translations: { en: 'Thought, Internal Reasoning and the Re-Act Approach' },
              slug: 'unit-1/thoughts',
            },
            {
              label: 'Actions: как Agent взаимодейства със средата си',
              translations: { en: 'Actions, Enabling the Agent to Engage with Its Environment' },
              slug: 'unit-1/actions',
            },
            {
              label: 'Observe: интегриране на Feedback за рефлексия и адаптация',
              translations: { en: 'Observe, Integrating Feedback to Reflect and Adapt' },
              slug: 'unit-1/observations',
            },
            {
              label: 'Dummy Agent Library',
              translations: { en: 'Dummy Agent Library' },
              slug: 'unit-1/dummy-agent-library',
            },
            {
              label: 'Да създадем първия си Agent с .NET',
              translations: { en: "Let's Create Our First Agent Using .NET" },
              slug: 'unit-1/tutorial',
            },
            { label: 'Final Quiz за Unit 1', translations: { en: 'Unit 1 Final Quiz' }, slug: 'unit-1/final-quiz' },
            { label: 'Заключение', translations: { en: 'Conclusion' }, slug: 'unit-1/conclusion' },
          ],
        },
      ],
    }),
  ],
});
