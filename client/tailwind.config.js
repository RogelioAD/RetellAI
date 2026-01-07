/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Horizon UI color palette
        brand: {
          50: '#E9E3FF',
          100: '#C0B8FE',
          200: '#A195FD',
          300: '#8171FC',
          400: '#7551FF',
          500: '#422AFB',
          600: '#3311DB',
          700: '#2111A5',
          800: '#190793',
          900: '#11047A',
        },
        navy: {
          50: '#d0dcfb',
          100: '#aac0fe',
          200: '#a3b9f8',
          300: '#728fea',
          400: '#3652ba',
          500: '#1b3bbb',
          600: '#24388a',
          700: '#1B254B',
          800: '#111c44',
          900: '#0b1437',
        },
        gray: {
          50: '#f4f7fe',
          100: '#E0E5F2',
          200: '#E1E9F8',
          300: '#A3AED0',
          400: '#707EAE',
          500: '#8F9BBA',
          600: '#2D3748',
          700: '#1B2559',
          800: '#111C44',
          900: '#0B1437',
        },
      },
      boxShadow: {
        'card': '0px 18px 40px rgba(112, 144, 176, 0.12)',
        'card-hover': '0px 18px 40px rgba(112, 144, 176, 0.18)',
        'sm': '0px 2px 4px rgba(112, 144, 176, 0.08)',
        'md': '0px 4px 8px rgba(112, 144, 176, 0.12)',
        'lg': '0px 8px 16px rgba(112, 144, 176, 0.16)',
      },
      borderRadius: {
        'card': '20px',
        'button': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

