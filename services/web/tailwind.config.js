/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#6D2E46',
          dark: '#542335',
          light: '#803652'
        },
        rose: {
          accent: '#A26769'
        },
        cream: {
          DEFAULT: '#ECE2D0',
          dark: '#E2D5BE',
          light: '#F5EFE5'
        },
        plum: {
          DEFAULT: '#2B1C22',
          secondary: '#3A2A30'
        }
      },
      fontFamily: {
        heading: ['Cambria', 'Georgia', 'serif'],
        body: ['Calibri', 'Candara', 'Segoe UI', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '12px',
        pill: '9999px'
      }
    },
  },
  plugins: [],
}
