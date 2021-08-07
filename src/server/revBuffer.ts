/** @format */
import { promises as fs } from "fs";
import { Appendices, Bible, Commentary, iData, Verse } from "rev";

async function LoadIfExists<T>(
	path: string,
	fallback: () => Promise<iData<T>>,
): Promise<T[]> {
	interface iFileData {
		date: string | Date;
		data: T[];
	}

	try {
		await fs.stat("data");
	} catch (error) {
		if (error.code === "ENOENT") {
			await fs.mkdir("data");
		}
	}

	try {
		await fs.stat(path);
	} catch (error) {
		if (error.code === "ENOENT") {
			const dataObject = await fallback();
			const { data } = dataObject;
			const output: iFileData = {
				date: new Date(),
				data,
			};
			fs.writeFile(path, JSON.stringify(output), {
				encoding: "utf8",
			});
			return dataObject.data;
		} else {
			throw error;
		}
	}

	const dataString = await fs.readFile(path, {
		encoding: "utf8",
	});
	const dataJson: iFileData = JSON.parse(dataString);

	return dataJson.data;
}

export async function GetBible(): Promise<Bible> {
	const bibleData: Verse[] = await LoadIfExists(
		"public/data/bible.json",
		Bible.onReady,
	);
	return new Bible(bibleData);
}

export async function GetAppendices(): Promise<Appendices> {
	const appendixData = await LoadIfExists(
		"public/data/appendices.json",
		Appendices.onReady,
	);
	return new Appendices(appendixData);
}

export async function GetCommentary() {
	const commentaryData = await LoadIfExists(
		"public/data/commentary.json",
		Commentary.onReady,
	);
	return new Commentary(commentaryData);
}
