import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

class SearchBoxBase extends React.Component {
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
    this.state.query && this.props.navigateTo(`/search?q=${encodeURIComponent(this.state.query)}`);
    this.props.onSubmitHandler && this.props.onSubmitHandler(this.state.query);
  }

  keyPress(e) {
    if (e.keyCode === 27)
      this.props.onEscape && this.props.onEscape();
  }

  focus() {
    this.textInput && this.textInput.focus();
  }

  static defaultTemplate({ children }) {
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
          onChange={(e) => this.setState({ query: e.target.value })}
          className={this.props.inputClassName}
          id={this.props.inputId}
          ref={(input) => this.textInput = input}
          onKeyDown={(e) => this.keyPress(e)} />
      </Render>
    </form>
  }

}

SearchBoxBase.propTypes = {
  initValue: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  formRef: PropTypes.any,
  inputClassName: PropTypes.string,
  inputId: PropTypes.string,
  template: PropTypes.element,
  onSubmitHandler: PropTypes.func,
  onEscape: PropTypes.func,
  navigateTo: PropTypes.func
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  navigateTo: function (url) {
    global.app.navigateToPage(dispatch, url);
  }
});


/**
 * This component provides a form with a search text box. On submit, the user is redirected to the search page via AJAX.
 *
 * A template function can also be passed in, to do custom rendering. The template prop will be called with childen having the child text box.
 *
 * Example
 * ```javascript
 * import { SearchBox } from '@quintype/components';
 *
 * <SearchBox className="foobar" placeholder="search" inputClassName="foobar-box" inputId="stg" inputRef={(x) => this.foo = x} onEscape={() => this.closeDialog()}/>
 * ```
 * @component
 * @category Header
 */
export const SearchBox = connect(mapStateToProps, mapDispatchToProps)(SearchBoxBase);
