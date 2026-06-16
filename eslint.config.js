import tseslint from 'typescript-eslint';
import lit from 'eslint-plugin-lit';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  tseslint.configs.base,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  {
    files: ['test/**/*.ts', '*.config.*', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  {
    plugins: {
      lit,
    },
    rules: {
      ...lit.configs.recommended.rules,
    },
  },

  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'lit/no-invalid-html': 'error',
      'lit/no-legacy-template-syntax': 'error',
      'no-console': ['warn', { allow: ['error'] }],
    },
  },

  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.config.*',
      '**/vite.config.*',
      '**/web-*.config.*',
      'eslint.config.js',
    ],
  },

  prettier,
];
