import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import nodePlugin from 'eslint-plugin-n';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      n: nodePlugin,
      s: stylisticJs,
    },
    rules: {
      'no-console': 'off',
      'prefer-const': 'error',
      's/comma-dangle': ['error', 'only-multiline'],
      's/comma-spacing': 'error',
      's/indent': ['error', 2],
      's/quotes': ['error', 'single', { avoidEscape: true }],
      's/semi': 'error',
      'strict': ['error', 'global']
    }
  }
]
