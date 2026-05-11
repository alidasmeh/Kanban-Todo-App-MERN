/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          600: '#4F46E5', // Adding explicitly as it's used in DESIGN.md
        },
        surface: {
          DEFAULT: '#FCF8FF',
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
        border: {
          DEFAULT: '#777587',
        },
        error: {
          DEFAULT: '#BA1A1A',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'body-base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '500' }],
        'headline-lg': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        'base': '8px',
        'xl': '0.75rem',
      },
      spacing: {
        'gutter': '1.5rem',
        'margin-page': '2rem',
        'card-padding': '1rem',
        'stack-gap': '0.75rem',
      },
      boxShadow: {
        'soft-float': '0px 1px 3px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}
