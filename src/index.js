import React, {Component, PropTypes} from 'react';
import {getSelection, setSelection} from './domElementSelection';
import abstractNumberInput from './abstract-number-format-input/index';

export default class NumberFormatInput extends Component {
  componentDidUpdate() {
    if (this.nextSelection) setSelection(this.refs.input, this.nextSelection);
    delete this.nextSelection;
  }

  getAbstractNumInput() {
    return abstractNumberInput(this.props.numberFormat);
  }

  handleKeyEvent(handlerName, e) {
    const charCode = e.which || e.charCode || e.keyCode;
    const pasteText = e.clipboardData && e.clipboardData.getData('text') || '';
    const {value: inputValue} = this.refs.input;
    const selection = getSelection(this.refs.input);
    const {maxlength, value, onChange} = this.props;

    const next = this.getAbstractNumInput()[handlerName]({charCode, value: inputValue, selection, maxlength, pasteText});

    if (next.value !== value) onChange(next.value);
    this.nextSelection = next.selection;
    if (next.preventDefault) e.preventDefault();
    if (next.stopPropagation) e.stopPropagation();
    if (next.clipboardText) e.clipboardData.setData('text', next.clipboardText);
  }

  eventHandlers() {
    if (!this._eventHandlers) {
      this._eventHandlers = {
        onKeyPress: this.handleKeyEvent.bind(this, 'handleKeyPress'),
        onKeyDown: this.handleKeyEvent.bind(this, 'handleKeyDown'),
        onCut: this.handleKeyEvent.bind(this, 'handleCut'),
        onPaste: this.handleKeyEvent.bind(this, 'handlePaste'),
        onChange: () => {}, // Changes are detected via key events.
      };

      Object.keys(this._eventHandlers).forEach(key => {
        const handler = this._eventHandlers[key];
        this._eventHandlers[key] = (...args) => {
          handler(...args);
          if (this.props[key]) this.props[key](...args);
        };
      });
    }
    return this._eventHandlers;
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
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

