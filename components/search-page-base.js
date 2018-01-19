import React from 'react';
import {get} from 'lodash';

import { LoadMoreStoriesManager } from './load-more-stories-base'

export class SearchPageBase extends React.Component {
  search(pageNumber) {
    return superagent.get("/api/v1/search", Object.assign(this.props.params, {
      offset: (this.props.storiesPerPage || 20) * pageNumber,
      fields: this.props.fields
    })).then(response => get(response.body, ["results", "stories"], []));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.search(pageNumber)
    }));
  }
}
