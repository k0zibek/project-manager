module.exports = {
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
    ],
    plugins: ['@typescript-eslint', 'no-relative-import-paths', 'simple-import-sort'],
    ignorePatterns: ['.eslintrc.cjs'],
    env: { browser: true, es2020: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        project: './tsconfig.json',
    },
    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src/'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
    rules: {
        'no-debugger': 'warn',
        'import/order': ['off'],
        'import/no-named-as-default': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-cycle': ['off', { maxDepth: 1 }],
        'react/display-name': ['warn'],
        'react/react-in-jsx-scope': ['off'],
        'react/require-default-props': ['off'],
        '@typescript-eslint/ban-ts-comment': ['warn'],
        'jsx-a11y/label-has-associated-control': [
            'error',
            {
                required: {
                    some: ['nesting', 'id'],
                },
            },
        ],
        'react/button-has-type': 'off',
        'no-alert': 'off',
        'no-magic-numbers': ['error', {
            'ignoreArrayIndexes': true,
            'ignore': [0, 1, -1],
        }],

        'array-bracket-newline': ['error', { multiline: true, minItems: 3 }],
        'array-element-newline': ['error', { multiline: true, minItems: 3 }],
        'brace-style': ['error', '1tbs'],
        curly: ['error', 'all'],
        'max-depth': ['warn', 2],
        'max-len': ['warn', { code: 130 }],
        'max-lines-per-function': [
            'warn',
            {
                max: 280,
                skipBlankLines: true,
                skipComments: true,
                IIFEs: true,
            },
        ],
        'no-async-promise-executor': 'error',
        'no-implicit-coercion': ['error', { allow: ['!!'] }],
        'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
        'no-negated-condition': 'error',
        'no-self-assign': ['error', { props: true }],
        'no-undefined': 'error',
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' },
            {
                blankLine: 'always',
                prev: [
                    'const',
                    'let',
                    'var',
                ],
                next: '*',
            },
            {
                blankLine: 'any',
                prev: [
                    'const',
                    'let',
                    'var',
                ],
                next: [
                    'const',
                    'let',
                    'var',
                ],
            },
            { blankLine: 'always', prev: ['case', 'default'], next: '*' },
            { blankLine: 'always', prev: ['export'], next: '*' },
        ],
        'prefer-object-spread': 'error',
        'wrap-regex': 'error',
        radix: ['error', 'as-needed'],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'prefer-destructuring': [
            'error',
            {
                array: false,
                object: true,
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        '@typescript-eslint/no-use-before-define': 'off',
        'import/exports-last': 'off',
        'import/prefer-default-export': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'react/jsx-filename-extension': 'off',
        'react/no-danger': 'off',
        'react/prop-types': 'off',
        'react/jsx-sort-props': 'error',
        'react/jsx-props-no-spreading': 'off',
        'react/no-direct-mutation-state': 'error',
        'react/no-unsafe': 'error',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: ['function-expression', 'arrow-function'],
            },
        ],
        'max-params': ['error', 3],
        'max-lines': [
            'warn',
            {
                max: 300,
                skipBlankLines: true,
                skipComments: true,
            },
        ],
        'no-relative-import-paths/no-relative-import-paths': ['error', { 'rootDir': 'src' }],
        'simple-import-sort/imports': [
            "warn",
            {
                "groups": [
                    [// libraries
                        "^react", "^(@[a-zA-Z]).[!hooks]*", "yup", "dayjs", "swiper", "axios", "^i18", "rc-slider",
                        // actions
                        "^actions/", "^context/actions",
                        // api
                        "^api/", "^api",
                        // components
                        "^components/", "App", "ApolloWrapper",
                        // constants
                        "^.*(constants).*$", "^constants/", "^components/Registration/steps",
                        // config
                        "^.*(config).*$",
                        // dictionary
                        '^dictionary', '^dictionary/',
                        // helpers
                        '^helpers', '^helpers/',
                        // hooks
                        '^context', '^context/', '^hooks/', '^.*\\/hooks\\/',
                        // static
                        "^assets", "^assets/privateArea", "^assets/registration", "^assets/common",
                        // store
                        "^context/stores",
                        // services
                        "^services/",
                        // styles
                        "^.+.?(css|scss)$",
                        // types
                        '^graphql/', "^.*(types).*$",]
                ],
            },
        ],
    },
};