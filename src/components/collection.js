import React from 'react';

import {getAssociatedTemplate} from "../utils";
import { InfiniteScroll } from './infinite-scroll';

function StoryNotImplemented() {
  return <div data-comment="Story Template Not Implemented" />;
}

function CollectionNotImplemented() {
  return <div data-comment="Collection Template Not Implemented" />;
}

function renderCollectionItem(collectionItem, index, collectionTemplates, storyTemplates, otherProps={}) {
  switch (collectionItem.type) {
    case "collection":
      return React.createElement(collectionTemplates(getAssociatedTemplate(collectionItem), index), {
        key: `${index}-${collectionItem.id}`,
        index: index,
        collection: collectionItem,
        metadata: collectionItem["associated-metadata"] || {},
        ...otherProps
      });

    case "story":
      return React.createElement(storyTemplates(index), {
        key: `${index}-${collectionItem.id}`,
        index: index,
        story: collectionItem.story,
        metadata: collectionItem["associated-metadata"] || {},
        ...otherProps
      });

    default: return <div data-comment={`${collectionItem.type} not implemented`} />
  }
}

// Pass this the HomePage Collection
export function Collection({ className, collection, collectionTemplates, storyTemplates, interstitial = () => undefined }) {
  const children = collection.items
                    .map((collectionItem, index) => renderCollectionItem(collectionItem, index, collectionTemplates, storyTemplates))
                    .reduce((arr, v, i) => arr.concat([v, interstitial(i)]), []);

  return React.createElement("div", { className }, children);
}

Collection.defaultProps = {
  collectionTemplates: () => CollectionNotImplemented,
  storyTemplates: () => StoryNotImplemented
}

export function LazyCollection({className, collection, collectionTemplates, storyTemplates, lazyAfter, ...otherProps}) {
  return <div className={className}>
    <InfiniteScroll render={({index}) => renderCollectionItem(collection.items[index], index, collectionTemplates, storyTemplates, otherProps)}
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

LazyCollection.defaultProps = {
  collectionTemplates: () => CollectionNotImplemented,
  storyTemplates: () => StoryNotImplemented
}
