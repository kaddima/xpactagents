/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './resources/views/**/*.blade.php',
  './resources/js/component/**/*.{js,jsx}',
  './resources/js/app/**/*.{js,jsx}',
  './resources/js/app/**/*.css',
  './resources/css/**/*.css',
  ],
  darkMode:'class',
  theme: {
  extend: {
    backgroundImage: {
    'total-img': "url(data:image/png;base64,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)",
    },
    colors: {
    'theme-color':'#d92228',
    'theme-blue':'##65c0cf'

    },
    fontSize: {
    14: '14px',
    12:'12px  '
    },
    zIndex:{
    '11':'11'
    },
    backgroundColor: {
    'main-bg': '#E7E7E7',
    'theme-color':'#d92228',
    'theme-blue':'#65c0cf',
    'main-dark-bg': '#080B10',
    'secondary-dark-bg': '#1A1D24',
    'light-gray': '#F7F7F7',
    'half-transparent': 'rgba(0, 0, 0, 0.5)',
    },
    borderWidth: {
    1: '1px',
    },
    borderColor: {
    color: 'rgba(0, 0, 0, 0.1)',
    },
    width: {
    278:'278px',
    400: '400px',
    760: '760px',
    780: '780px',
    800: '800px',
    1000: '1000px',
    1200: '1200px',
    1400: '1400px',
    },
    height: {
    80: '80px',
    "full-64": 'calc(100% - 124px)',
  
    },
    minHeight: {
    590: '590px',
    },
  
    }
  },
  plugins: [
  require('@tailwindcss/forms')
  ],
}
