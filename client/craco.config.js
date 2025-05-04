module.exports = {
  babel: {
    loaderOptions: {
      plugins: [
        "@babel/plugin-transform-nullish-coalescing-operator",
        "@babel/plugin-transform-optional-chaining"
      ],
    },
  },
};
