/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        maxHeight: {
          'screen-230': 'calc(100vh - 236px)',  // Default
          'screen-180': 'calc(100vh - 180px)',  // Smaller for smaller viewports
          'screen-130': 'calc(100vh - 130px)',  // Even smaller for mobile devices
        },

      colors: {
        'custom-dark-blue': '#040617',
        'custom-light-blue': '#0D1229',
        'response-text-color':'#D8D8D8',
        'white-color':'#FFFFFF',
        'secondary-text-color':'#515987',
        'placeholder-text-color':'#5B628E',
        'navbar-button-bg':'rgba(55, 68, 87, 0.54)'
      },
      backgroundImage: {
        'custom-image': "url('/src/Assets/bg.png')",
        'godrays':"url('/src/Assets/godrays.png')",
      },
      fontFamily: {
        'sans': ['Manrope', 'sans-serif'],
        'Quantify':['Quantify', 'sans-serif'],
        'Inter-Tight':["Inter Tight", 'sans-serif'],
        'Inter':["Inter", 'sans-serif']
      },
    },
  },
  variants: {
    extend: {
      maxHeight: ['responsive']  // Enable responsive variants for maxHeight
    }
  },
  plugins: [],
}