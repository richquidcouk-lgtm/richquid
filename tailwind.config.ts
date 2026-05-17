import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{mdx,md}',
  ],
  theme: {
    extend: {
      colors: {
        // Editorial palette — see app/globals.css for the runtime CSS variables.
        paper:   '#FAFAF7',
        ink:     '#1A1A1A',
        ink2:    '#3A3A3A',
        ink3:    '#6B6B6B',
        rule:    '#E5E2DA',
        green:   { DEFAULT: '#0F4F3A', soft: '#E8F0EC', dark: '#073424' },
        gold:    { DEFAULT: '#C9A961', soft: '#F4EBD2' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        article: '680px',
        prose: '680px',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':         '#1A1A1A',
            '--tw-prose-headings':     '#1A1A1A',
            '--tw-prose-lead':         '#3A3A3A',
            '--tw-prose-links':        '#0F4F3A',
            '--tw-prose-bold':         '#1A1A1A',
            '--tw-prose-counters':     '#6B6B6B',
            '--tw-prose-bullets':      '#C9A961',
            '--tw-prose-hr':           '#E5E2DA',
            '--tw-prose-quotes':       '#3A3A3A',
            '--tw-prose-quote-borders':'#C9A961',
            '--tw-prose-captions':     '#6B6B6B',
            '--tw-prose-code':         '#1A1A1A',
            '--tw-prose-pre-code':     '#FAFAF7',
            '--tw-prose-pre-bg':       '#1A1A1A',
            '--tw-prose-th-borders':   '#E5E2DA',
            '--tw-prose-td-borders':   '#E5E2DA',
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
            lineHeight: '1.75',
            maxWidth: '680px',
            h1: { fontFamily: 'var(--font-serif)', fontWeight: '500', letterSpacing: '-0.02em' },
            h2: { fontFamily: 'var(--font-serif)', fontWeight: '500', letterSpacing: '-0.015em' },
            h3: { fontFamily: 'var(--font-serif)', fontWeight: '500', letterSpacing: '-0.01em' },
            h4: { fontFamily: 'var(--font-serif)', fontWeight: '600' },
            a:  { textDecoration: 'underline', textDecorationColor: '#C9A961', textUnderlineOffset: '3px' },
            'a:hover': { color: '#0F4F3A' },
            blockquote: { fontStyle: 'italic', fontWeight: '400' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
