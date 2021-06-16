module.exports = {
  mode: "jit",
  purge: {
    content: ["./templates/**/*.html", "./theme/**/*.html"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--color-bg)",
          "bg-offset": "var(--color-bg-offset)",
          text: "var(--color-text)",
          "text-offset": "var(--color-text-offset)",
          border: "var(--color-border)",
          primary: "var(--color-primary)",
          "primary-offset": "var(--color-primary-offset)",
          secondary: "var(--color-secondary)",
        },
      },
      minHeight: {
        auto: "auto",
      },
      flex: {
        2: "2 2 0%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    container: false,
  },
};
