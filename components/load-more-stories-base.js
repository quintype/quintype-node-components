import React from 'react';

import { removeDuplicateStories } from '../utils';
import { getRequest } from './api-client';

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
            noMoreStories: stories.length < this.props.storiesOnClick
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

export class LoadMoreStoriesBase extends React.Component {
  loadMoreStories(pageNumber) {
    return getRequest("/api/v1/stories", Object.assign({}, this.props.params, {
      offset: this.props.storiesOnClick * (pageNumber - 1) + this.props.data.stories.length,
      limit: this.props.storiesOnClick,
      fields: this.props.fields
    })).json(response => response.stories || []);
  }
  
  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.loadMoreStories(pageNumber),
      languageDirection: this.props.languageDirection,
      storiesOnClick: this.props.storiesOnClick || 10,
    }));
  }
}

export class LoadMoreCollectionStories extends React.Component {
  loadMoreStories(pageNumber) {
    return getRequest(`/api/v1/collections/${this.props.collectionSlug}`, Object.assign({}, this.props.params, {
      offset: this.props.storiesOnClick * (pageNumber - 1) + this.props.data.stories.length,
      limit: this.props.storiesOnClick,
    })).json(response => (response.items || []).map(item => item.story));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.loadMoreStories(pageNumber),
      languageDirection: this.props.languageDirection,
      storiesOnClick: this.props.storiesOnClick
    }));
  }
}
