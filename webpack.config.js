const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const distPath = path.resolve(__dirname, './dist');

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'

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
			'__dev': env === 'development',
		}),
		new webpack.ProgressPlugin(),
	],
	'target': 'node',
	'node': {
		'__dirname': true,
	},
	'externals': [
		nodeExternals(),
	],
	'devtool': '#source-map',
	'resolve': {
		'extensions': [
			'.ts',
			'.tsx',
			// '.js',
			// '.json',
		],
	},
	'mode': env,
};
