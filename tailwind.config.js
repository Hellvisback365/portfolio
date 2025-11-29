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
        primary: '#3B82F6', // blue-500
        'primary-dark': '#60A5FA', // blue-400
        'neural-blue': '#0F172A',
        'neural-indigo': '#4338CA',
        'neural-cyan': '#5DE0E6',
        'neural-magenta': '#C084FC',
        'neural-void': '#050812',
      },
      backgroundImage: {
        'neural-grid': 'radial-gradient(circle at center, rgba(93, 224, 230, 0.15) 0, transparent 45%), linear-gradient(120deg, rgba(67,56,202,0.45), rgba(5,8,18,0.9))',
        'neural-card': 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(67,56,202,0.65))',
        'neural-accent': 'linear-gradient(120deg, #5DE0E6, #C084FC)',
      },
      boxShadow: {
        'neural-glow': '0 10px 40px rgba(93, 224, 230, 0.25)',
        'neural-card': '0 20px 60px rgba(5, 8, 18, 0.55)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
