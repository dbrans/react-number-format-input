import React, {Component, PropTypes} from 'react';
import {getSelection, setSelection} from './domElementSelection';
import abstractNumberInput from './abstract-number-format-input/index';

export default class NumberFormatInput extends Component {
  componentDidUpdate() {
    if (this.queueSelection) setSelection(this.refs.input, this.queueSelection);
    delete this.queueSelection;
  }

  getAbstractNumInput() {
    return abstractNumberInput(this.props.numberFormat);
  }

  handleKeyEvent(handlerName, e) {
    const charCode = e.which || e.charCode || e.keyCode;
    const {value} = this.refs.input;
    const selection = getSelection(this.refs.input);
    const {maxlength} = this.props;
    const next = this.getAbstractNumInput()[handlerName]({charCode, value, selection, maxlength});

    this.notifyChange(next.value);

    if (next.selection) {
      e.preventDefault();
      e.stopPropagation();
      this.queueSelection = next.selection;
    }
  }

  notifyChange(nextValue) {
    const {value, onChange} = this.props;
    if (nextValue !== value) onChange(nextValue);
  }

  eventHandlers() {
    return this._eventHandlers || (this._eventHandlers = {

      onKeyPress: this.handleKeyEvent.bind(this, 'handleKeyPress'),
      onKeyDown: this.handleKeyEvent.bind(this, 'handleKeyDown'),
      onFocus: () => this.setState({hasFocus: true}),
      onBlur: () => this.setState({hasFocus: false}),
      onChange: () => {}, // Changes are detected via key events.
    });
  }

  render() {
    const {value, numberFormat, ...inputProps} = this.props;
    const inputValue = this.getAbstractNumInput().format(value);
    return (
        <input ref="input" type="text" {...inputProps} value={inputValue} {...this.eventHandlers()}/>
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
};

NumberFormatInput.defaultProps = {
  maxlength: undefined,
  numberFormat: new Intl.NumberFormat('en-US', {}),
  onChange: () => {},
};

NumberFormatInput.propTypes = {
  maxlength: PropTypes.number,
  // An instance of Intl.NumberFormat.
  numberFormat: PropTypes.shape({
    format: PropTypes.func.isRequired,
    resolvedOptions: PropTypes.func.isRequired,
  }),
  onChange: PropTypes.func,
  value: PropTypes.number,
};

