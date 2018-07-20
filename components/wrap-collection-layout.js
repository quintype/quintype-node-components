import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import { LoadMoreCollectionStories } from './load-more-stories-base';
import { LazyLoadImages } from './responsive-image';
import { ClientSideOnly } from './client-side-only';

function addLoadMore(Component, data, slug, storiesOnClick) {
  return React.createElement(LoadMoreCollectionStories, {
    template: Component,
    collectionSlug: slug,
    data: data,
    storiesOnClick: storiesOnClick       
  });
}

function maybeWrapLazyLoad(component, {lazy_load_images = false}) {
  return lazy_load_images ?
    React.createElement(LazyLoadImages, {}, component) :
    component;
}

function maybeWrapClientSide(component, {client_side_only = false}) {
  return client_side_only ?
    React.createElement(ClientSideOnly, {}, component) :
    component;
}

function WrapCollectionComponent(Component) {
  return function(props) {
    if (!props.collection) {
      return <div></div>
    }

    const associatedMetadata = props.collection["associated-metadata"] || {};
    let stories = collectionToStories(props.collection);
    stories = associatedMetadata.limit_stories ? stories.slice(0, associatedMetadata.limit_stories) : stories;

    if(stories.length == 0) {
      return <div></div>
    }

    const data = Object.assign({}, props, {
      stories: stories,
      associatedMetadata: associatedMetadata,
    });

    const maybeWrapLoadMore = (component, {enable_load_more_button = false}) => {
      return enable_load_more_button ? 
        addLoadMore(component, data, props.collection.slug, associatedMetadata.load_more_stories_count) : 
        component;
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
