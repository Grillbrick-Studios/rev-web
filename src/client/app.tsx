/** @format */

import React, { Component } from "react";
import {
	Bible,
	iVerse,
	Commentary,
	Appendices,
	iAppendices,
	iCommentary,
} from "rev-bible";

enum Path {
	Bible,
	Commentary,
	Appendices,
}
interface State {
	bible?: Bible;
	commentary?: Commentary;
	appendices?: Appendices;
	path?: Path;
}
export class App extends Component<{}, State> {
	constructor(props: {} | Readonly<{}>) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		const bibleData: { bible: iVerse[] } = await fetch("/rev/bible").then(res =>
			res.json(),
		);

		const appendicesData: { appendices: iAppendices[] } = await fetch(
			"/rev/appendices",
		).then(res => res.json());

		const commentaryData: { commentary: iCommentary[] } = await fetch(
			"/rev/commentary",
		).then(res => res.json());

		const bible = new Bible(bibleData.bible);
		const appendices = new Appendices(appendicesData.appendices);
		const commentary = new Commentary(commentaryData.commentary);
		this.setState({ bible, appendices, commentary });
	}

	render() {
		const { bible, commentary, appendices, path } = this.state;
		const header = () => {
			switch (path) {
				case Path.Bible:
					return <h1>REV Bible</h1>;
				case Path.Commentary:
					return <h1>REV Commentary</h1>;
				case Path.Appendices:
					return <h1>REV Appendices</h1>;
				default:
					return <h1>REV App</h1>;
			}
		};
		const content = () => {
			if (!(bible && commentary && appendices)) return <div>Loading...</div>;
			switch (path) {
				case Path.Bible:
					return (
						<div>
							<h2>{bible.path}</h2>
							<p>
								<button
									onClick={() => {
										bible.up() || this.setState({ path: undefined });
										this.forceUpdate();
									}}
								>
									..
								</button>
							</p>
							{bible.ls().map(v => (
								<p>
									<button
										onClick={() => {
											bible.select(v);
											this.forceUpdate();
										}}
										dangerouslySetInnerHTML={{
											__html: v,
										}}
									/>
								</p>
							))}
						</div>
					);
				case Path.Commentary:
					return (
						<div>
							<h2>{commentary.path}</h2>
							<p>
								<button
									onClick={() => {
										commentary.up() || this.setState({ path: undefined });
										this.forceUpdate();
									}}
								>
									..
								</button>
							</p>
							{commentary.ls().map(v => (
								<p>
									<button
										onClick={() => {
											commentary.select(v);
											this.forceUpdate();
										}}
										dangerouslySetInnerHTML={{
											__html: v,
										}}
									/>
								</p>
							))}
						</div>
					);
				case Path.Appendices:
					return (
						<div>
							<h2>{appendices.path}</h2>
							<p>
								<button
									onClick={() => {
										appendices.up() || this.setState({ path: undefined });
										this.forceUpdate();
									}}
								>
									..
								</button>
							</p>
							{appendices.ls().map(v => (
								<p>
									<button
										onClick={() => {
											appendices.select(v);
											this.forceUpdate();
										}}
										dangerouslySetInnerHTML={{
											__html: v,
										}}
									/>
								</p>
							))}
						</div>
					);
				default:
					return (
						<div>
							<h2>Main Menu</h2>
							<button
								onClick={() => {
									this.setState({ path: Path.Bible });
								}}
							>
								Bible
							</button>
							<br />
							<button
								onClick={() => {
									this.setState({ path: Path.Appendices });
								}}
							>
								Appendices
							</button>
							<br />
							<button
								onClick={() => {
									this.setState({ path: Path.Commentary });
								}}
							>
								Commentary
							</button>
						</div>
					);
			}
		};
		return (
			<div>
				{header()}
				{content()}
			</div>
		);
	}
}
