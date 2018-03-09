// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class HelloWorld extends Component {

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default HelloWorld;
