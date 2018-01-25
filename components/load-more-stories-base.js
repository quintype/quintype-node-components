import React from 'react';

import { removeDuplicateStories } from '../utils';
import {get} from 'lodash';
import { DEFAULT_STORIES_LIMIT } from '../constants';

export class LoadMoreStoriesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      offset: props.offset || props.storiesPerPage || DEFAULT_STORIES_LIMIT,
      pageNumber: 1,
      moreStories: [],
      noMoreStories: props.stories.length < (props.offset || props.storiesPerPage || DEFAULT_STORIES_LIMIT)
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
      this.props.loadStories(this.state.offset)
        .then(stories => {
          this.setState({
            offset: this.state.offset + (this.props.storiesPerPage || DEFAULT_STORIES_LIMIT),
            loading: false,
            moreStories: this.state.moreStories.concat(removeDuplicateStories(this.stories(), stories)),
            noMoreStories: stories.length < (this.props.storiesPerPage || DEFAULT_STORIES_LIMIT)
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
  loadMoreStories(offset) {
    return superagent.get("/api/v1/stories", Object.assign(this.props.params, {
      offset: offset,
      fields: this.props.fields
    })).then(response => get(response.body, ["stories"], []));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      storiesPerPage: this.props.storiesPerPage || DEFAULT_STORIES_LIMIT,
      offset: this.props.offset || 0,
      loadStories: (offset) => this.loadMoreStories(offset)
    }));
  }
}

export class LoadMoreCollectionStories extends React.Component {
  loadMoreStories(offset) {
    return superagent.get(`/api/v1/collections/${this.props.collectionSlug}`, Object.assign(this.props.params, {
      offset: offset
    })).then(function(response){
      var stories = _.map(response.body.items, function(collectionItem){
        return (collectionItem.story);
      });
      return stories;
    });
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (offset) => this.loadMoreStories(offset)
    }));
  }
}
