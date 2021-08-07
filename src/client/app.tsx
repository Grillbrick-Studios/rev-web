/** @format */

import React, { Component } from "react";
import { Bible, iVerse } from "rev";

interface State {
	bible?: Bible;
}
export class App extends Component<{}, State> {
	async componentDidMount() {
		const bibleData: iVerse[] = await fetch("/rev/bible").then(res =>
			res.json(),
		);

		const bible = new Bible(bibleData);
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
							{bible.ls().map(v => (
								<p>{v}</p>
							))}
						</p>
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
