/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  safelist: [
    'dark',
    'light',
    'radius-premium',
    'radius-classic'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg: '#05020c',      
          card: '#0d071d',    
          border: '#1f1438',  
          cyan: '#00f2fe',    
          pink: '#ff007f',    
          purple: '#9d4edd',  
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.45), 0 0 4px rgba(0, 242, 254, 0.2)',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.45), 0 0 4px rgba(255, 0, 127, 0.2)',
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.35)',
      }
    },
  },
  plugins: [],
}