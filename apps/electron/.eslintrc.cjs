module.exports = {
  root: true,
  extends: [require.resolve("@my-app/config/eslint/electron.cjs")],
  parserOptions: {
    project: [__dirname + "/tsconfig.json"]
  }
};
