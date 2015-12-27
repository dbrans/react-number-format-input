import NumberFormatInput from '../src';
import React, {Component, PropTypes} from 'react';

const simpleFormat = new Intl.NumberFormat('en-US');

function format(allowNull, value) {
  return value === null ? 'null' : simpleFormat.format(value);
}

export default class Example extends Component {
  render() {
    const {description, numberFormat, allowNull, defaultValue = 1234.56} = this.props;
    const {value} = this.state || (this.state = {value: defaultValue});
    const onChange = (nextValue) => this.setState({value: nextValue});
    const placeholder = 'Empty is null';
    return (
        <div className="example">
          <p>{description}</p>
          <NumberFormatInput {...{placeholder, value, numberFormat, onChange}}/>
          value: <span className="value">{format(allowNull, value)}</span>
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
  allowNull: PropTypes.any,
  placeholder: PropTypes.string,
};
