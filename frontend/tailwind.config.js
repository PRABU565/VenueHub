/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#2563EB',
        lightGray: '#F8F9FA',
        success: '#22C55E',
        darkText: '#1F2937',
        brand: {
          // Fallbacks for any remaining brand classes
          50: '#fff0e5',
          100: '#ffe1cc',
          500: '#FF6B00',
          600: '#e66000',
          900: '#7a3300',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'brand-glow': '0 0 15px rgba(139, 92, 246, 0.40)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
