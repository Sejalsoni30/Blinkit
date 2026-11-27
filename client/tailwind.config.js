/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blinkit: {
          yellow: '#F8CB46',
          yellowLight: '#FEF4D6',
          green: '#0C831F',
          greenLight: '#E8F5E9',
          greenDark: '#085B15',
          black: '#1D252C',
          gray: '#666666',
          lightBg: '#F4F6F8',
          border: '#E2E8F0',
          red: '#E53935',
          orange: '#FB8C00',
        },
      },
    },
  },
  plugins: [],
};
