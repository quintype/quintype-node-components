import React from "react";

/**
 * This higher order function can be used for the home or story page preview. It takes a component, and a function to map the story into props suitable for the component
 * 
 * Preview in the Quintype CMS works by sending a postMessage to an iframe every time the story changes. This file abstracts this for you, and will just render the given component
 *
 * Example
 * ```javascript
 * import { WithPreview, replaceAllStoriesInCollection } from '@quintype/components';
 * import { StoryPage } from '../pages/story';
 * import { HomePage } from '../pages/home';
 *
 * function storyPageData(data, story) {
 *   return {...data, story, relatedStories: Array(5).fill(story)};
 * }
 *
 * // Remember to update load-data.js for the initial data
 * function homePageData(data, story) {
 *   return {...data, collection: replaceAllStoriesInCollection(data.collection, story)};
 * }
 *
 * export const StoryPreview = WithPreview(StoryPage, storyPageData);
 * export const HomePreview = WithPreview(HomePage, homePageData)
 * ```
 * @param {Component} klazz
 * @param {function} updateData
 * @category Other
 * @returns {Component} Component which can be used for preview
 */
export function WithPreview(klazz, updateData) {
  return class WithPreviewWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { story: null };
    }

    componentDidMount() {
      global.addEventListener("message", event => {
        if (event.data && event.data.action == 'reloadStory' && event.data.story) {
          this.setState({ story: event.data.story })
        }
      });
    }

    render() {
      if(!this.state.story) {
        return <div style={{minHeight: 200}} />
      }
      return React.createElement(klazz, Object.assign({}, this.props, {
        data: updateData(this.props.data, this.state.story)
      }))
    }
  }
}
