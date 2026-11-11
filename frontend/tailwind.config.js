/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cor principal (azul-marinho do logo): header, botões principais, links
        brand: {
          50: '#eef3fb', 100: '#d9e4f5', 200: '#b3c8ea', 300: '#7fa0d6', 400: '#4a73b8',
          500: '#284f93', 600: '#1a3b7a', 700: '#12306a', 800: '#0c2556', 900: '#071a40',
        },
        // Cor de destaque (laranja do logo): botão "Encomendar", preços, promoções
        accent: {
          50: '#fff4ec', 100: '#ffe4d0', 300: '#ffb07a', 400: '#ff8a40',
          500: '#ff6a13', 600: '#e8570a', 700: '#b8430a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.06)',
      },
    },
  },
  plugins: [],
}