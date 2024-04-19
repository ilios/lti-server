import mochaPlugin from 'eslint-plugin-mocha';

export default [
    mochaPlugin.configs.flat.recommended,
    {
        rules: {
            'mocha/no-exclusive-tests': 'error',
        },
    },
];