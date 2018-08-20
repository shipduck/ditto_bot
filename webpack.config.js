const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const distPath = path.resolve(__dirname, './dist');
const mode = process.env.NODE_ENV === 'dev' ? 'development' : 'production';

console.log(mode);

module.exports = {
	'entry': path.resolve(__dirname, './src', 'main.ts'),
	'output': {
		'path': distPath,
		'filename': 'main.js',
	},
	'module': {
		'rules': [
			// {
			// 	'test': /\.js?$/,
			// 	'use': {
			// 		'loader': 'babel-loader',
			// 	},
			// },
			{
				'test': /\.tsx?$/,
				'use': [
					'ts-loader',
				],
			},
		],
	},
	'plugins': [
		new webpack.DefinePlugin({
			'__dev': mode === 'development',
			'__sentry_dsn': process.env.dsn ? process.env.dsn : null,
		}),
		new webpack.ProgressPlugin(),
		new Dotenv(),
		new webpack.SourceMapDevToolPlugin({}),
	],
	'target': 'node',
	'node': {
		'__dirname': true,
	},
	'externals': [
		nodeExternals(),
	],
	'devtool': false,
	'resolve': {
		'extensions': [
			'.ts',
			'.tsx',
			// '.js',
			// '.json',
		],
	},
	'mode': mode,
	'optimization': {
		'minimizer': [
			new UglifyJsPlugin(),
		],
	},
};
