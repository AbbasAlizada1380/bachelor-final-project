/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "farsi": ["persian", "monospace"],
        "ANSI": ["ANSI"]
      }, animation: {
        'ping-center': 'ping-center 1s infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {

        'ping-center': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(3)', opacity: 0 },
        },
        "spin": {
          from: { transform: 'rotate(0deg) scale(3)' },
          to: { transform: 'rotate(90deg) scale(2)' },
        },

        '50%': {
          'background-size': '200% 200%',
          'background-position': 'right center',
        },

        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'top center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'bottom center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right bottom',
          },
        },
      },
    },

    screens: {
      "sm": "340px",
      "md": "620px",
      "lg": "1024px",
      "xl": "1208px"

    },

  },
  plugins: [],
}

