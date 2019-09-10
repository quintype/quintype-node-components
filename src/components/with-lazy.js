import React from 'react';
import PropTypes from 'prop-types';

/**
 * This component can be used to load some DOM just before it scrolls into the screen. Currently, it does not support unloading. The `margin` prop is passed to `IntersectionObserver`.
 *
 * Example
 * ```javascript
 * import { WithLazy } from '@quintype/components';
 *
 * <WithLazy margin="50px">{() =>
 *   <SomeHeavyComponent />
 * }</WithLazy>
 * ```
 * @component
 * @hideconstructor
 * @category Other
 */
export class WithLazy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.observerRef = React.createRef();
  }

  render() {
    if (this.state.loaded) {
      return this.props.children();
    } else {
      return <div style={{ height: this.props.height || 50 }} ref={this.observerRef} />;
    }
  }

  componentDidMount() {
    this.observer = new global.IntersectionObserver((entries, observer) => this.observerCallback(entries, observer), {
      rootMargin: this.props.margin || "160px"
    });
    this.observer.observe(this.observerRef.current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  observerCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.isIntersecting === undefined) {
        this.setState({ loaded: true });
        observer.disconnect();
      }
    });
  }
}

WithLazy.propTypes = {
  children: PropTypes.func.isRequired,
  margin: PropTypes.string,
  height: PropTypes.number
};
