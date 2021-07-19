const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./templates/**/*.html', './theme/**/*.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          'bg-offset': 'var(--color-bg-offset)',
          headline: 'var(--color-headline)',
          text: 'var(--color-text)',
          'text-offset': 'var(--color-text-offset)',
          border: 'var(--rolor-border)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
        },
      },
      minHeight: {
        auto: 'auto',
      },
      flex: {
        2: '2 2 0%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.border-b-primary': {
          borderBottomWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'transparent',
          '&:hover': {
            borderColor: 'var(--color-primary)'
          }
        },
        '.shadow-b-primary': {
          'transition': 'box-shadow 400ms ease 0s',
          'box-shadow': '0px 0px 0px var(--color-primary)',
          '&:hover': {
            'transition': 'box-shadow 100ms ease 0s',
            'box-shadow': '0px 2px 0px var(--color-primary)',
          }
        }
      });
    }),
  ],
  corePlugins: {
    container: false,
  },
};
