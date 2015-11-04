import NumberFormatInput from '../src';
import React, {Component, PropTypes} from 'react';

const simpleFormat = new Intl.NumberFormat('en-US');

export default class Example extends Component {
  render() {
    const {description, numberFormat, defaultValue = 1234.56} = this.props;
    const {value} = this.state || (this.state = {value: defaultValue});
    const onChange = (nextValue) => this.setState({value: nextValue});
    return (
        <div className="example">
          <p>{description}</p>
          <NumberFormatInput ref="input" {...{value, numberFormat, onChange}}/>
          value: <span className="value">{simpleFormat.format(value)}</span>
        </div>
    );
  }
}

Example.propTypes = {
  description: PropTypes.string.isRequired,
  numberFormat: PropTypes.shape({
    format: PropTypes.func.isRequired,
    resolvedOptions: PropTypes.func.isRequired,
  }).isRequired,
  defaultValue: PropTypes.number,
};
