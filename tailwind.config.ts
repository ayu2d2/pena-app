import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PenaApp Brand Colors
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#1a8dff',
          500: '#0080ff', // Main Dolphin Blue
          600: '#0066cc',
          700: '#004d99',
          800: '#003366',
          900: '#001a33',
          950: '#000d1a',
          DEFAULT: '#0080ff',
          foreground: '#ffffff',
        },
        accent: {
          50: '#ffeef4',
          100: '#ffd1e1',
          200: '#ffb3cf',
          300: '#ff96bc',
          400: '#ff79aa',
          500: '#ff6b9d', // K-pop Pink
          600: '#e6608d',
          700: '#cc557d',
          800: '#b34a6d',
          900: '#99405c',
          DEFAULT: '#ff6b9d',
          foreground: '#ffffff',
        },
        success: {
          50: '#e8f5e8',
          100: '#c3e6c3',
          200: '#9ed69e',
          300: '#7ac77a',
          400: '#55b755',
          500: '#4caf50', // SDGs Green
          600: '#439e47',
          700: '#3a8c3e',
          800: '#327b35',
          900: '#29692c',
          DEFAULT: '#4caf50',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#0080ff',
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
