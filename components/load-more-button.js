import React from 'react';
import PropTypes from 'prop-types';

function LoadMoreButton(props) {
  return <button styleName={props.styleName} onClick={props.onLoadMore}>{props.text}</button>
}

LoadMoreButton.propTypes = {
  // CSS class to add styles from  
  styleName: PropTypes.string.isRequired,
  // Callback function for click event
  onLoadMore: PropTypes.func.isRequired,
  // Button text to display
  text: PropTypes.string.isRequired,
};

LoadMoreButton.defaultProps = {
    styleName: 'load-more',
    onLoadMore: () => {},
    text: 'Load more',
}

export { LoadMoreButton };