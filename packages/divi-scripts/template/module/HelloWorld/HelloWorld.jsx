import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'style.scss';


class HelloWorld extends Component {

	constructor( props ) {
		super( props );
	}

	render() {
		const props = this.props.attrs;

		return <div>{props.content}</div>;
	}
}

export default HelloWorld;
