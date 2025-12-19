module.exports = {
  root: true,
  extends: [require.resolve("@my-app/config/eslint/next.cjs")],
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname + "/tsconfig.json"]
      }
    }
  }
};
