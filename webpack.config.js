module.exports = {
    module: {
        rules: [
            {
                test: /content\.min\.css$/,
                use: 'raw-loader',
            },
        ],
    },
};
