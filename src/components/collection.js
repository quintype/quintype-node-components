import React from 'react';
import { string, object, func } from 'prop-types';
import { StoryNotImplemented, CollectionNotImplemented, renderCollectionItem } from './impl/collection-impl';

/**
 * This component can be used to render a collection. You should typically pass this a collection that represents a page. Also see {@link LazyCollection}.
 *
 * Example
 * ```javascript
 * import {Collection} from '@quintype/components'
 *
 * // collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})
 *
 * function TwoColLayout({collection, associatedMetadata, index}) {
 *   // for item in collection.item
 *   //   if item.type == story
 *   //     showStory
 *   //   else if item.type == colection
 *   //     <Collection />
 *   // speed = associatedMetadata.scroll_speed
 * }
 *
 * function collectionTemplates(layout, index) {
 *   if(layout == 'twoColLayout')
 *     return TwoColLayout;
 * }
 *
 * // optional
 * function storyTemplates(index) {
 *   return StoryTemplate;
 * }
 *
 * // optional
 * function interstitial(index) {
 *   if(index % 2 == 0)
 *     return <AdComponent />
 * }
 *
 * <Collection collection={collection}
 *             collectionTemplates={collectionTemplates}
 *             storyTemplates={storyTemplates}
 *             interstitial={interstitial} />
 * ```
 * @component
 * @category Collection Page
 */
export const Collection = ({ className, collection, collectionTemplates, storyTemplates, interstitial }) => {
  const children = collection.items
                    .map((collectionItem, index) => renderCollectionItem(collectionItem, index, collectionTemplates, storyTemplates))
                    .reduce((arr, v, i) => arr.concat([v, interstitial(i)]), []);

  return React.createElement("div", { className }, children);
}

Collection.propTypes = {
  className: string,
  collection: object,
  collectionTemplates: func,
  storyTemplates: func,
  interstitial: func,
}

Collection.defaultProps = {
  collectionTemplates: () => CollectionNotImplemented,
  storyTemplates: () => StoryNotImplemented,
  interstitial: () => undefined
}
