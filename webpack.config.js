const path = require('path');

module.exports = {
    mode: 'production',

    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: './dist/main.js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        // extensions: ['.ts', '.tsx']
        extensions: ['.wasm', '.ts', '.tsx', '.scss', '.mjs', '.cjs', '.js', '.json'],
        alias: {
            css: path.resolve(__dirname, 'src/css/'),
        }
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'source-map-loader'
                },
                {
                    loader: 'eslint-loader'
                }]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                // For bootstrap.css
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                // Font awesome
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                  }
                }]
              },
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};
