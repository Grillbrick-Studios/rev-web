/** @format */

import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../../webpack.config";
import { GetAppendices, GetBible, GetCommentary } from "./revBuffer";

const app = express();

const { PORT = 80 } = process.env;

const devServerEnabled = true;

if (devServerEnabled) {
	//reload=true:Enable auto reloading when changing JS files or content
	//timeout=1000:Time from disconnecting from server to reconnecting
	//config?.entry?.app.unshift(
	//"webpack-hot-middleware/client?reload=true&timeout=1000",
	//);

	//Add HMR plugin
	config?.plugins?.push(new webpack.HotModuleReplacementPlugin());

	const compiler = webpack(config);

	//Enable "webpack-dev-middleware"
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: config.output?.publicPath as string,
		}),
	);

	//Enable "webpack-hot-middleware"
	app.use(webpackHotMiddleware(compiler));
}

app.use(express.static("public"));

app.get("/rev/bible", async (_req, res) => {
	const bible = await GetBible();
	res.send({
		bible: bible.data,
	});
});

app.get("/rev/appendices", async (_req, res) => {
	const appendices = await GetAppendices();
	res.send({
		appendices: appendices.data,
	});
});

app.get("/rev/commentary", async (_req, res) => {
	const commentary = await GetCommentary();
	res.send({
		commentary: commentary.data,
	});
});

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
