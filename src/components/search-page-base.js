import React from 'react';
import get from "lodash/get";
import { getRequest } from './api-client';

import { LoadMoreStoriesManager } from './impl/load-more-stories-manager'

/**
 * This component is to handle search functionality and also handles load more.
 *
 * A template must be passed in to render search results. Fields can be passed to get specific fields in the results. The contents of `props.data` are passed to the rendered template.
 *
 * ```javascript
 * import { SearchPageBase } from "@quintype/components";
 *
 * function SearchPageView({query, stories, onLoadMore, loading, noMoreStories}) {
 *   return <div />;
 * }
 *
 * <SearchPageBase template={SearchPageView} fields={"id,headline"} {...props}/>
 * ```
 * @component
 * @hideconstructor
 * @deprecated
 * @category Other
 */
export class SearchPageBase extends React.Component {
  search(pageNumber) {
    return getRequest("/api/v1/search", Object.assign(this.props.params, {
      offset: (this.props.storiesPerPage || 20) * pageNumber,
      fields: this.props.fields
    })).json(response => get(response, ["results", "stories"], []));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.search(pageNumber)
    }));
  }
}
