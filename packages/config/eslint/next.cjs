/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("./base.cjs"), "next/core-web-vitals", "next/typescript"],
  env: {
    browser: true,
    node: true
  }
};

