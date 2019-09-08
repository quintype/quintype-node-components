import React from 'react';

function defaultErrorFn(props) {
  return React.createElement("span", {className: "qt-error"})
}

/**
 * This function can be used to generate a wrapper component that implements `componentDidCatch()`.
 *
 * Example
 * ```javascript
 * import { withError } from '@quintype/components';
 *
 * function errorFunction(props) {
 *   return <span />;
 * }
 *
 * const MyStoryElement = withError(ComponentThatMayCrash, errorFunction)
 *
 * <MyStoryElement/>
 * ```
 * @param {Component} clazz
 * @param {function} errorFn
 * @category Other
 * @returns {Component} A component with errors caught
 */
export function withError(clazz, errorFn = defaultErrorFn) {
  return class WithError extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        errored: false
      }
    }

    componentDidCatch(e) {
      console && e && console.log(`Caught Exception: ${e.message || e}`);
      this.setState({
        errored: true
      })
    }

    errorContent() {
      try {
        return errorFn(this.props);
      } catch(e) {
        return defaultErrorFn(this.props);
      }
    }

    render() {
      if(this.state.errored) {
        return this.errorContent();
      } else {
        return React.createElement(clazz, this.props);
      }
    }
  }
}
