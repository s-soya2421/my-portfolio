module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  ignorePatterns: ['out', '.next', 'dist', 'coverage'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-pascal-case': 'off',
  },
};
