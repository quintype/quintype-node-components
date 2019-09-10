import React from 'react';

import { removeDuplicateStories } from '../../utils';

export class LoadMoreStoriesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageNumber: 1,
      moreStories: [],
      noMoreStories: false
    };
  }

  stories() {
    return this.props.stories.concat(this.state.moreStories);
  }

  loadMore(e) {
    e.preventDefault();
    if(this.state.loading)
      return;
    const pageNumber = this.state.pageNumber;
    this.setState({loading: true, pageNumber: pageNumber + 1}, () => {
      this.props.loadStories(pageNumber)
        .then(stories => {
          this.setState({
            loading: false,
            moreStories: this.state.moreStories.concat(removeDuplicateStories(this.stories(), stories)),
            noMoreStories: stories.length < this.props.numStoriesToLoad
          })
      })
    })
  }

  render() {
    return this.props.template(Object.assign({}, this.props, {
      stories: this.stories(),
      onLoadMore: (e) => this.loadMore(e),
      loading: this.state.loading,
      noMoreStories: this.state.noMoreStories
    }));
  }
}
