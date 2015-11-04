import React, {Component} from 'react';
import examples from './examples.js';
import Example from './Example';

export default class App extends Component {
  render() {
    return (
        <div>
          <h1>react-number-format-input demo</h1>
          {examples.map((props, idx) => <Example key={idx} {...props}/>)}
        </div>
    );
  }
}
