// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        'light': {
          primary: '#867969',
          secondary: '#E9E8E6',
          text: '#1f2937',
          'text-secondary': '#4b5563',
        },
        // Dark mode
        'dark': {
          primary: '#29292B',
          secondary: '#C9C7BA',
          text: '#f9fafb',
          'text-secondary': '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
}
