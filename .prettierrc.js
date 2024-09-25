module.exports = {
    singleQuote: true,
    trailingComma: 'es5',
    plugins: [],
    overrides: [
        {
            files: '*.{js,ts,gjs,gts}',
            options: {
                singleQuote: true,
                templateSingleQuote: false
            }
        },
        {
            files: '*.hbs',
            options: {
                singleQuote: false
            }
        }
    ]
};