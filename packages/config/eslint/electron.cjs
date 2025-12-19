/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("./base.cjs")],
  env: {
    browser: false,
    node: true
  }
};

