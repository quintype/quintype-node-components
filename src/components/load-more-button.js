import { func, string } from 'prop-types';
import React from 'react';

export function LoadMoreButton(props) {
  return <button className={props.className} onClick={props.onLoadMore} data-test-id = "load-more">{props.text}</button>
}

LoadMoreButton.propTypes = {
  // CSS class to add styles from
  className: string.isRequired,
  // Callback function for click event
  onLoadMore: func.isRequired,
  // Button text to display
  text: string.isRequired,
};

LoadMoreButton.defaultProps = {
    className: 'load-more',
    onLoadMore: () => {},
    text: 'Load more',
}
