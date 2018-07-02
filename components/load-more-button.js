import React from 'react';

function LoadMoreButton(props) {
    return <button styleName={props.styleName} onClick={props.onLoadMore}>Load more</button>
}

export { LoadMoreButton };