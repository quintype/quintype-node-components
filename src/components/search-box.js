import React from 'react';
import PropTypes from "prop-types";
import {NavigationComponentBase} from "./navigation-component-base";

export class SearchBox extends NavigationComponentBase {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.initValue || ""
    };
  }

  componentDidMount() {
    this.focus();
  }

  onSubmit(e) {
    e.preventDefault();
    this.state.query && this.navigateTo(`/search?q=${encodeURIComponent(this.state.query)}`);
    this.props.onSubmitHandler && this.props.onSubmitHandler(this.state.query);
  }

  keyPress(e) {
    if(e.keyCode === 27)
      this.props.onEscape && this.props.onEscape();
  }

  focus() {
    this.textInput && this.textInput.focus();
  }

  defaultTemplate({children}) {
    return children;
  }

  render() {
    const Render = this.props.template || this.defaultTemplate;
    return <form role="search" action="/search" onSubmit={(e) => this.onSubmit(e)} className={this.props.className} ref={this.props.formRef}>
      <Render>
        <input type="search"
               name="q"
               placeholder={this.props.placeholder}
               value={this.state.query}
               onChange={(e) => this.setState({query: e.target.value})}
               className={this.props.inputClassName}
               id={this.props.inputId}
               ref={(input) => this.textInput = input}
               onKeyDown={(e) => this.keyPress(e)}/>
      </Render>
    </form>
  }

}

SearchBox.protoTypes = {
  initValue: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  formRef: PropTypes.any,
  inputClassName: PropTypes.string,
  inputId: PropTypes.string,
  template: PropTypes.element,
  onSubmitHandler: PropTypes.func,
  onEscape: PropTypes.func
}
