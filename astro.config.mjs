import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://beaveroo.tech',
  integrations: [
    starlight({
      title: 'Beaveroo',
      favicon: '/favicon.svg?v=beaver',
      description:
        'AI Agents Course на български със C# примери - неофициална адаптация на Hugging Face Agents Course.',

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

      // Keeps the sidebar and the previous/next links inside the course of the current page.
      routeMiddleware: './src/routeData.ts',

      components: {
        Header: './src/components/Header.astro',
        Hero: './src/components/Hero.astro',
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

      // One list for all courses. A page shows only the groups of its own course (see src/routeData.ts).
      sidebar: [
        // AI Agents
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
        {
          label: 'Unit 2. Frameworks за AI Agents',
          translations: { en: 'Unit 2. Frameworks for AI Agents' },
          collapsed: true,
          items: [
            {
              label: 'Frameworks за AI Agents',
              translations: { en: 'Frameworks for AI Agents' },
              slug: 'ai-agents/unit-2/introduction',
            },
          ],
        },
        {
          label: 'Unit 2.1. Microsoft Agent Framework',
          translations: { en: 'Unit 2.1. Microsoft Agent Framework' },
          collapsed: true,
          items: [
            {
              label: 'Въведение в Microsoft Agent Framework',
              translations: { en: 'Introduction to Microsoft Agent Framework' },
              slug: 'ai-agents/unit-2/agent-framework/introduction',
            },
            {
              label: 'Защо Microsoft Agent Framework?',
              translations: { en: 'Why use Microsoft Agent Framework?' },
              slug: 'ai-agents/unit-2/agent-framework/why-agent-framework',
            },
            {
              label: 'Първият ти Agent с Agent Framework',
              translations: { en: 'Your First Agent with Agent Framework' },
              slug: 'ai-agents/unit-2/agent-framework/first-agent',
            },
            { label: 'Quick Quiz 1', translations: { en: 'Quick Quiz 1' }, slug: 'ai-agents/unit-2/agent-framework/quiz1' },
            { label: 'Tools', translations: { en: 'Tools' }, slug: 'ai-agents/unit-2/agent-framework/tools' },
            {
              label: 'Sessions: паметта на Agent-а',
              translations: { en: "Sessions: the Agent's Memory" },
              slug: 'ai-agents/unit-2/agent-framework/sessions',
            },
            {
              label: 'Middleware: контрол над всяка стъпка',
              translations: { en: 'Middleware: Control over Every Step' },
              slug: 'ai-agents/unit-2/agent-framework/middleware',
            },
            { label: 'Quick Quiz 2', translations: { en: 'Quick Quiz 2' }, slug: 'ai-agents/unit-2/agent-framework/quiz2' },
            {
              label: 'Multi-Agent Systems',
              translations: { en: 'Multi-Agent Systems' },
              slug: 'ai-agents/unit-2/agent-framework/multi-agent-systems',
            },
            { label: 'Workflows', translations: { en: 'Workflows' }, slug: 'ai-agents/unit-2/agent-framework/workflows' },
            {
              label: 'Final Quiz за Unit 2.1',
              translations: { en: 'Unit 2.1 Final Quiz' },
              slug: 'ai-agents/unit-2/agent-framework/final-quiz',
            },
            { label: 'Заключение', translations: { en: 'Conclusion' }, slug: 'ai-agents/unit-2/agent-framework/conclusion' },
          ],
        },
        {
          label: 'Unit 3. Agentic RAG',
          translations: { en: 'Unit 3. Agentic RAG' },
          collapsed: true,
          items: [
            {
              label: 'Въведение в Agentic RAG',
              translations: { en: 'Introduction to Agentic RAG' },
              slug: 'ai-agents/unit-3/introduction',
            },
            { label: 'Какво е RAG?', translations: { en: 'What is RAG?' }, slug: 'ai-agents/unit-3/what-is-rag' },
            {
              label: 'Първият ти retriever',
              translations: { en: 'Your First Retriever' },
              slug: 'ai-agents/unit-3/retrieval',
            },
            {
              label: 'Embeddings: търсене по смисъл',
              translations: { en: 'Embeddings: Searching by Meaning' },
              slug: 'ai-agents/unit-3/embeddings',
            },
            { label: 'Quick Quiz 1', translations: { en: 'Quick Quiz 1' }, slug: 'ai-agents/unit-3/quiz1' },
            {
              label: 'Vector store: дом за embeddings',
              translations: { en: 'Vector Stores: a Home for Embeddings' },
              slug: 'ai-agents/unit-3/vector-store',
            },
            {
              label: 'RAG в Agent Framework',
              translations: { en: 'RAG in Agent Framework' },
              slug: 'ai-agents/unit-3/rag-in-agent-framework',
            },
            {
              label: 'Agentic RAG: търсенето като tool',
              translations: { en: 'Agentic RAG: Retrieval as a Tool' },
              slug: 'ai-agents/unit-3/agentic-rag',
            },
            { label: 'Quick Quiz 2', translations: { en: 'Quick Quiz 2' }, slug: 'ai-agents/unit-3/quiz2' },
            {
              label: 'Още източници: времето, Wikipedia и NuGet',
              translations: { en: 'More Sources: Weather, Wikipedia and NuGet' },
              slug: 'ai-agents/unit-3/tools',
            },
            {
              label: 'Alfred на гала вечерта',
              translations: { en: 'Alfred at the Gala' },
              slug: 'ai-agents/unit-3/gala-agent',
            },
            { label: 'Final Quiz за Unit 3', translations: { en: 'Unit 3 Final Quiz' }, slug: 'ai-agents/unit-3/final-quiz' },
            { label: 'Заключение', translations: { en: 'Conclusion' }, slug: 'ai-agents/unit-3/conclusion' },
          ],
        },

        // Python за .NET програмисти. A unit here is one page, so it is a link, not a group.
        // AI Agents keeps groups with a lesson under each unit.
        {
          label: 'Unit 0. Добре дошли в курса',
          translations: { en: 'Unit 0. Welcome to the course' },
          slug: 'python-for-dotnet/unit-0/introduction',
        },
        {
          label: 'Unit 1. Типове и данни',
          translations: { en: 'Unit 1. Types and data' },
          slug: 'python-for-dotnet/unit-1/types-and-data',
        },
        {
          label: 'Unit 2. Класове и protocols',
          translations: { en: 'Unit 2. Classes and protocols' },
          slug: 'python-for-dotnet/unit-2/classes-and-protocols',
        },
        {
          label: 'Unit 3. От LINQ към comprehensions',
          translations: { en: 'Unit 3. From LINQ to comprehensions' },
          slug: 'python-for-dotnet/unit-3/linq-to-comprehensions',
        },
      ],
    }),
  ],
});
