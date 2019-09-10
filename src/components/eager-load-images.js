import React from "react";
import { func } from 'prop-types';

/**
 * This component can be used along with {@link LazyLoadImages}. Children of `EagerLoadImages` are forced to be eager, if they match the given predicate
 *
 * See {@link LazyLoadImages} for example usage
 * @component
 * @category Images
 */
export class EagerLoadImages extends React.Component {
  getChildContext() {
    return {
      lazyLoadEagerPredicate: this.props.predicate || (() => true)
    }
  }

  render() {
    return this.props.children;
  }
}

EagerLoadImages.childContextTypes = {
  lazyLoadEagerPredicate: func
};

EagerLoadImages.propTypes = {
  predicate: func
}
