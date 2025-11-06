import React, { createContext } from "react";
import { func } from 'prop-types';

// React 19 compatible context to replace legacy childContextTypes API
export const EagerLoadImagesContext = createContext({
  lazyLoadEagerPredicate: () => true
});

/**
 * This component can be used along with {@link LazyLoadImages}. Children of `EagerLoadImages` are forced to be eager, if they match the given predicate
 *
 * See {@link LazyLoadImages} for example usage
 * @component
 * @category Images
 */
export class EagerLoadImages extends React.Component {
  render() {
    const contextValue = {
      lazyLoadEagerPredicate: this.props.predicate || (() => true)
    };

    return (
      <EagerLoadImagesContext.Provider value={contextValue}>
        {this.props.children}
      </EagerLoadImagesContext.Provider>
    );
  }
}

EagerLoadImages.propTypes = {
  predicate: func
}
