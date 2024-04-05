module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        'no-undef': 'error',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
        {
            "files": [
                "**/*.spec.ts",
            ],
            "env": {
                "jest": true
            }
        }
    ],
    env: {
        node: true,
    }
};