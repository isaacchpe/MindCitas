/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4A7C59',
          emotional: '#7C6DAF',
          habits: '#E6934A',
        },
        text: {
          primary: '#2C3E50',
          secondary: '#6B7B8C',
        },
        surface: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E1E5EA',
        },
        feedback: {
          error: '#D9534F',
          success: '#4A7C59',
        },
        mood: {
          1: '#D9534F',
          2: '#E6934A',
          3: '#F0C808',
          4: '#7CB342',
          5: '#4A7C59',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '1.25', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(44, 62, 80, 0.08), 0 1px 2px rgba(44, 62, 80, 0.04)',
        elevated: '0 4px 12px rgba(44, 62, 80, 0.10)',
      },
    },
  },
  plugins: [],
};
