module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser'
  },
  parser: 'vue-eslint-parser',
  plugins: ['eslint-plugin-storybook', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    },
    {
      files: ['*.ts'],
      rules: {
        indent: 'off'
      }
    }
  ],
  rules: {
    indent: 'off',
    'vue/html-indent': 'off',
    'vue/script-indent': 'off',
    'eol-last': ['error', 'always'],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 0,
    'object-property-newline': 'off',
    'object-curly-spacing': ['error', 'always'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0
      }
    ],
    semi: ['error', 'never'],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 4,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignorePattern: 'd="([\\s\\S]*?)"'
      }
    ],
    'object-curly-newline': 'off',
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': 'error',
    'key-spacing': 'error'
  }
}
