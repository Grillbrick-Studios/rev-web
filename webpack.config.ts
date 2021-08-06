/** @format */

import path from "path";
import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";

const { NODE_ENV = "production" } = process.env;

type env = "production" | "development" | "none" | undefined;

const config: Configuration = {
	mode: NODE_ENV as env,
	devServer: {
		contentBase: path.join(__dirname, "public"),
		port: 80,
		host: "localhost",
	},
	entry: {
		app: ["./src/client/index.ts"],
	},
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	externals: [nodeExternals()],
	watch: NODE_ENV === "development",
};

export default config;
