import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
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
});
