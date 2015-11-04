import React, {Component, PropTypes} from 'react';
import handleKeyDown from './handleKeyDown';
import handleKeyPress from './handleKeyPress';
import {getSelection, setSelection} from './domElementSelection';
import formattedNumber from './util/formattedNumber';

export default class NumberFormatInput extends Component {
  componentDidUpdate() {
    if (this.queueSelection) setSelection(this.refs.input, this.queueSelection);
    delete this.queueSelection;
  }

  handleKeyEvent(handler, e) {
    const charCode = e.which || e.charCode || e.keyCode;
    const value = this.refs.input.value;
    const selection = getSelection(this.refs.input);
    const {maxlength, numberFormat: numberFormat} = this.props;

    const next = handler({charCode, value, selection, maxlength, numberFormat});

    this.notifyChange(next.value);

    if (next.selection) {
      e.preventDefault();
      e.stopPropagation();
      this.queueSelection = next.selection;
    }
  }

  notifyChange(numberStr) {
    const {value, onChange, numberFormat} = this.props;
    const nextValue = formattedNumber(numberFormat).parse(numberStr);
    if (nextValue !== value) onChange(nextValue);
  }

  eventHandlers() {
    return this._eventHandlers || (this._eventHandlers = {

      onKeyPress: this.handleKeyEvent.bind(this, handleKeyPress),
      onKeyDown: this.handleKeyEvent.bind(this, handleKeyDown),
      onFocus: () => this.setState({hasFocus: true}),
      onBlur: () => this.setState({hasFocus: false}),
      onChange: () => {}, // Changes are detected via key events.
    });
  }

  render() {
    const {value, numberFormat} = this.props;
    const inputValue = formattedNumber(numberFormat).format(value);
    return (
        <input ref="input" type="text" {...this.props} value={inputValue} {...this.eventHandlers()}/>
    );
  }
}

NumberFormatInput.PropTypes = {
  value: PropTypes.number,
  numberFormat: PropTypes.shape({
    format: PropTypes.func.isRequired,
    resolvedOptions: PropTypes.func.isRequired,
  }),
  onChange: PropTypes.func,
  maxlength: PropTypes.number,
  allowNull: PropTypes.bool,
};

NumberFormatInput.defaultProps = {
  allowNullValue: false,
  maxlength: undefined,
  numberFormat: new Intl.NumberFormat('en-US', {}),
  onChange: () => {},
  value: 0,
};

NumberFormatInput.propTypes = {
  allowNullValue: PropTypes.bool,
  maxlength: PropTypes.number,
  numberFormat: PropTypes.shape({
    format: PropTypes.func.isRequired,
    resolvedOptions: PropTypes.func.isRequired,
  }),
  onChange: PropTypes.func,
  value: PropTypes.number,
};

