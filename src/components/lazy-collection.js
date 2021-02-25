import React from 'react';
import { InfiniteScroll } from './infinite-scroll';
import { string, object, func } from 'prop-types';
import { StoryNotImplemented, CollectionNotImplemented, renderCollectionItem } from './impl/collection-impl';

/**
 * This component can be used to render a collection, but with the components being lazy. This takes all the same options as Collection, but with a `lazyAfter` prop.
 * This Component also accepts extra props, which will be passed down to collection templates.
 *
 * This Component is similar to {@link Collection}. Please see that for a more detailed example.
 *
 * Note: This does not accept `interstitial` items (yet). And home page items are not hidden after being rendered
 *
 * ```javascript
 * import { LazyCollection } from '@quintype/components'
 *
 * // collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})
 *
 * <LazyCollection collection={collection}
 *                 collectionTemplates={collectionTemplates}
 *                 storyTemplates={storyTemplates}
 *                 lazyAfter={3}
 *                 extraProp="some prop" />
 *
 * ```
 * @category Collection Page
 * @component
 */
export function LazyCollection({ className, collection, collectionTemplates, storyTemplates, lazyAfter, ...otherProps }) {
  return <div className={className}>
    <InfiniteScroll render={({ index }) => renderCollectionItem(collection.items[index], index, collectionTemplates, storyTemplates, otherProps)}
      items={collection.items}
      loadNext={() => []}
      initiallyShow={lazyAfter}
      neverHideItem={true}
      showAllOnLegacyBrowser={true}
      // No Op
      focusCallbackAt={20}
      onFocus={() => { }} />
  </div>;
}

LazyCollection.propTypes = {
  className: string,
  collection: object,
  collectionTemplates: func,
  storyTemplates: func,
}

LazyCollection.defaultProps = {
  collectionTemplates: () => CollectionNotImplemented,
  storyTemplates: () => StoryNotImplemented
}
