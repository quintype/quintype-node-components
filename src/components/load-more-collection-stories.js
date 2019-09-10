import React from 'react';

import get from "lodash/get";
import { getRequest } from './api-client';
import { LoadMoreStoriesManager } from './impl/load-more-stories-manager';

/**
 * This component is very similar to the {@link LoadMoreBase} component but fetches the stories from a `collection`. The api call `/api/v1/collections/{collectionSlug}` is made with the passed collection slug value. The component accepts the `params` prop and a requires a Collection Slug from which to fetch the stories and returns a set of stories only.
 *
 * ```javascript
 * import { LoadMoreCollectionStories } from '@quintype/components';
 *
 * function MoreCollectionStories({collection, stories, loading, onLoadMore, noMoreStories}) {
 *   return <div/>;
 * }
 *
 * export function HomePage(props) {
 *   return <LoadMoreCollectionStories template={MoreCollectionStories}
 *                                     collectionSlug={props.data.collectionSlug}
 *                                     data={{collection: collection, stories: initialStories}}
 *                                     params={{}}/>
 * }
 * ```
 *
 * ### Get Collection of stories written by a particular author
 * We can get the collection of stories written by a specific author by using the authorId prop as below:
 * ```javascript
 * export function HomePage(props) {
 *   return <LoadMoreCollectionStories
 *             template={MoreCollectionStories}
 *             data={{stories: stories}}
 *             authorId={props.author.id}
 *             params={{}}
 *             numStoriesToLoad={10} />
 * }
 * ```
 *
 * Also see {@link LoadMoreStoriesBase} for a version that takes a section id instead of a collection
 * @component
 * @category Collection Page
 */
export class LoadMoreCollectionStories extends React.Component {
  loadMoreStories(pageNumber) {
    const stories = get(this.props, ['data', 'stories'], []);
    const authorId = get(this.props, ["authorId"], null);

    const url = authorId ?
      `/api/v1/authors/${authorId}/collection` :
      `/api/v1/collections/${this.props.collectionSlug}`;

    return getRequest(url, Object.assign({}, this.props.params, {
      offset: this.props.numStoriesToLoad * (pageNumber - 1) + stories.length,
      limit: this.props.numStoriesToLoad || 10,
    })).json(response => (response.items || []).map(item => item.story));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.loadMoreStories(pageNumber),
      languageDirection: this.props.languageDirection,
      numStoriesToLoad: this.props.numStoriesToLoad || 10
    }));
  }
}
