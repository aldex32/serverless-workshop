module.exports = {
    singleQuote: true,
    printWidth: 160,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
                printWidth: 100,
            },
        },
        {
            files: ['*.json', '*.json5'],
            options: {
                printWidth: 100,
            },
        },
    ],
};
