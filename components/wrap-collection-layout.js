import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import { LoadMoreCollectionStories } from './load-more-stories-base';
import { LazyLoadImages } from './responsive-image';
import { ClientSideOnly } from './client-side-only';

function addLoadMore(Component, data, slug, numStoriesToLoad) {
  return React.createElement(LoadMoreCollectionStories, {
    template: Component,
    collectionSlug: slug,
    params: { 'item-type': 'story' },
    data: data,
    numStoriesToLoad,       
  });
}

function maybeWrapLazyLoad(component, {lazy_load_images = false}) {
  return !lazy_load_images ?
    component :
    React.createElement(LazyLoadImages, {}, component);
}

function maybeWrapClientSide(component, {client_side_only = false}) {
  return !client_side_only ?
    component :
    React.createElement(ClientSideOnly, {}, component);
}

function WrapCollectionComponent(Component) {
  return function(props) {
    if (!props.collection) {
      return <div></div>
    }

    const associatedMetadata = props.collection["associated-metadata"] || {};
    let stories = collectionToStories(props.collection);
    stories = associatedMetadata.initial_stories_load_count ? stories.slice(0, associatedMetadata.initial_stories_load_count) : stories;

    if(stories.length == 0) {
      return <div></div>
    }

    const data = Object.assign({}, props, {
      stories: stories,
      associatedMetadata: associatedMetadata,
    });

    const maybeWrapLoadMore = (component, {enable_load_more_button = false}) => {
      return !enable_load_more_button ?
        component :
        addLoadMore(component, data, props.collection.slug, associatedMetadata.subsequent_stories_load_count);
    }
    
    return [maybeWrapLoadMore, maybeWrapClientSide, maybeWrapLazyLoad].reduce((c, f) => f(c, associatedMetadata), Component);
  }
}

export function wrapCollectionLayout(component) {
  return connect((state) => ({config: state.qt.config}))(WrapCollectionComponent(component))
}

export function collectionToStories(collection) {
  return collection.items
                   .filter(item => item.type == 'story')
                   .map(item => replaceWithAlternates(item.story));
}

function replaceWithAlternates(story) {
  const alternates = get(story, ["alternative", "home", "default"]);

  if(!alternates)
    return story;

  return Object.assign({}, story, {
    headline                 : alternates.headline || story.headline,
    "hero-image-s3-key"      : alternates["hero-image"] ? alternates["hero-image"]["hero-image-s3-key"] : story["hero-image-s3-key"],
    "hero-image-metadata"    : alternates["hero-image"] ? alternates["hero-image"]["hero-image-metadata"] : story["hero-image-metadata"],
    "hero-image-caption"     : alternates["hero-image"] ? alternates["hero-image"]["hero-image-caption"] : story["hero-image-caption"],
    "hero-image-attribution" : alternates["hero-image"] ? alternates["hero-image"]["hero-image-attribution"] : story["hero-image-attribution"],
  })
}
