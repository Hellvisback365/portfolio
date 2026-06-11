/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        'primary-dark': '#E2E8F0',
        'neural-blue': '#050505',
        'neural-indigo': '#080808',
        'neural-cyan': '#FFFFFF',
        'neural-magenta': '#FFFFFF',
        'neural-void': '#030303',
      },
      backgroundImage: {
        'neural-grid': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0, transparent 45%), linear-gradient(120deg, rgba(255,255,255,0.02), rgba(3,3,3,0.9))',
        'neural-card': 'linear-gradient(135deg, rgba(10,10,10,0.8), rgba(25,25,25,0.6))',
        'neural-accent': 'linear-gradient(120deg, #FFFFFF, #E2E8F0)',
      },
      boxShadow: {
        'neural-glow': '0 10px 40px rgba(255, 255, 255, 0.05)',
        'neural-card': '0 20px 60px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
