import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
    {
        ignores: ['dist', 'node_modules', 'eslint.config.js']
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended
        ],
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                project: ['tsconfig.json'],
            },
        },
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': ['error', { allow: ['error', 'warn'] }],
            'prefer-const': 'warn'
        },
    }
);
