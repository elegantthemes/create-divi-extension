// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class HelloWorld extends Component {

  render() {
    const Content = this.props.content;

    return (
      <div className="et_pb_text __prefix_hello_world">
        <Content/>
      </div>
    );
  }
}

export default HelloWorld;
