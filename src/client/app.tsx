/** @format */

import React, { Component } from "react";
import { Bible, iVerse } from "rev";

interface State {
	bible?: Bible;
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

		const bible = new Bible(bibleData.bible);
		this.setState({ bible });
	}

	render() {
		const { bible } = this.state;
		return (
			<div>
				<h1>REV Bible</h1>
				{bible ? (
					<div>
						<h2>{bible.path}</h2>
						<p>
							<button
								onClick={() => {
									bible.up();
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
				) : (
					<div>
						<p>Loading bible...</p>
					</div>
				)}
			</div>
		);
	}
}
