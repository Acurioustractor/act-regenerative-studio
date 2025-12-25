/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'act-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'act-earth': {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#e8dfc9',
          300: '#d6c5a0',
          400: '#c0a676',
          500: '#a88b58',
          600: '#8f7348',
          700: '#755d3c',
          800: '#614d35',
          900: '#52412e',
        }
      },
    },
  },
  plugins: [],
}
