const fs = require('fs');

const path = require('path');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const distPath = path.resolve(__dirname, './dist');

const env = fs.readFileSync(path.resolve(__dirname, './.env')).toString().trim().split(/\r?\n/).map((e) => {
	const [
		_,
		key,
		value,
	] = e.match(/^(.+?)=(.+?)$/);

	return {
		[key.toLowerCase()]: JSON.stringify(value),
	};
}).reduce((a, b) => {
	return {
		...a,
		...b,
	};
});

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'

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
			'__env': env,
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
	'mode': mode,
};
