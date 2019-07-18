const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	entry: "./src/index.js",
	mode: "production",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].[chunkhash].js",
		publicPath: ''		
	},
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
		watchContentBase: true,
		progress: true
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				},
			},
			{
				test: /\.(css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules:{ 
								localIdentName: "[name]__[local]___[hash:base64:5]"}    
						}
					}
					]
				})
				
					
				
			},
			{
				test: /\.(scss)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								modules:{ 
									localIdentName: "[name]__[local]___[hash:base64:5]"}
							},
						},
						"sass-loader"
					]
					
				})
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				use: [ "file-loader"]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({			
			filename: 'style.[hash].css',
			disable: false, allChunks: true
		}),
		new CleanWebpackPlugin(),
		
		new HtmlWebpackPlugin({
			inject: false,
			hash: true,
			template: './src/index.html',
			filename: 'index.html'
		}),
		new WebpackMd5Hash()
	]
}
