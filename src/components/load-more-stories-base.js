import React from 'react';

import get from "lodash/get";
import { getRequest } from './api-client';
import { LoadMoreStoriesManager } from './impl/load-more-stories-manager';
/**
 * This component starts with a set of stories, and then provides a load more button. This calls out to `/api/v1/stories` with the properties passed via the `params` prop. The stories are concatenated with the stories in `props.data.stories`, and the contents of `props.data` are passed to the rendered template.
 *
 * It can accept an alternate `api` as a prop as well as `apiResponseTransformer` which can be used to tranformer the api response before being passed to the `template`.
 *
 * Example
 * ```javascript
 * import { LoadMoreStoriesBase } from '@quintype/components';
 *
 * function SectionPageWithStories({section, stories, loading, onLoadMore, noMoreStories}) {
 *   return <div/>;
 * }
 *
 * export function SectionPage(props) {
 *   return <LoadMoreStoriesBase template={SectionPageWithStories}
 *                               fields={"id,headline"}
 *                               {...props}
 *                               params={{"section-id": props.data.section.id}}
 *                               api="/api/v1/stories"
 *                               apiResponseTransformer={(response) => response.stories} />
 * }
 * ```
 *
 * Also see {@link LoadMoreCollectionStories} for a version that takes a collection
 * @component
 * @category Collection Page
  */
export class LoadMoreStoriesBase extends React.Component {
  loadMoreStories(pageNumber) {
    const stories = get(this.props, ['data', 'stories'], []);
    return getRequest(this.props.api || '/api/v1/stories', Object.assign({}, this.props.params, {
      offset: this.props.numStoriesToLoad * (pageNumber - 1) + stories.length,
      limit: this.props.numStoriesToLoad || 10,
      fields: this.props.fields
    })).json(response => {
      if (this.props.apiResponseTransformer) {
        return this.props.apiResponseTransformer(response)
      }
      return response.stories || get(response, ['results', 'stories'], []);
    });
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.loadMoreStories(pageNumber),
      languageDirection: this.props.languageDirection,
      numStoriesToLoad: this.props.numStoriesToLoad || 10,
    }));
   }
}
