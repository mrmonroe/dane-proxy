module.exports = {
  extends: ['eslint-config-airbnb-base', 'eslint-config-airbnb-typescript'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
    },
  ],
  rules: {
    'react/jsx-filename-extension': 0,
  },
};
