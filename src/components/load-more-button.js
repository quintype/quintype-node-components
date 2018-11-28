import React from 'react';
import PropTypes from 'prop-types';

function LoadMoreButton(props) {
  return <button className={props.className} onClick={props.onLoadMore} data-test-id = "load-more">{props.text}</button>
}

LoadMoreButton.propTypes = {
  // CSS class to add styles from
  className: PropTypes.string.isRequired,
  // Callback function for click event
  onLoadMore: PropTypes.func.isRequired,
  // Button text to display
  text: PropTypes.string.isRequired,
};

LoadMoreButton.defaultProps = {
    className: 'load-more',
    onLoadMore: () => {},
    text: 'Load more',
}

export { LoadMoreButton };
