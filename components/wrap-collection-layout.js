import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import { LoadMoreCollectionStories } from './load-more-stories-base';
import { LazyLoadImages } from './responsive-image';
import { ClientSideOnly } from './client-side-only';

function addLoadMore(Component, data, load_more, slug) {
  if(load_more) {
    return React.createElement(LoadMoreCollectionStories, {
      template: Component,
      collectionSlug: slug,
      data: data
    });
  }
  return React.createElement(Component, data);
}

function addLazyLoad(component, {lazy_load_images = false}) {
  if(lazy_load_images) {
    return React.createElement(LazyLoadImages, {}, component);
  }
  return component;
}

function addClientSide(component, {client_side_only = false}) {
  if(client_side_only) {
    return React.createElement(ClientSideOnly, {}, component);
  }
  return component;
}

function WrapCollectionComponent(Component) {
  return function(props) {
    const stories = collectionToStories(props.collection)
    const associatedMetadata = props.collection["associated-metadata"] || {};

    if(stories.length == 0) {
      return <div></div>
    }

    const data = Object.assign({}, props, {
      stories: stories,
      associatedMetadata: associatedMetadata,
    });

    const component = addLoadMore(Component, data, associatedMetadata.load_more, props.collection.slug, data);

    return [addClientSide, addLazyLoad].reduce((c, f) => f(c, associatedMetadata), component);
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
