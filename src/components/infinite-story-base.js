import React from "react";
import get from "lodash/get";
import { InfiniteScroll } from "./infinite-scroll.js";
import { removeDuplicateStories } from '../utils';

/**
 * This component can be used to implement InfiniteScroll on the story page. You will need to specify the function which renders the story (which will recieve props.index and props.story), and functions for triggering analytics.
 *
 * Example
 * ```javascript
 * import React from 'react';
 *
 * import { BlankStory } from './story-templates';
 * import { InfiniteStoryBase } from '@quintype/components';
 *
 * function StoryPageBase({index, story, otherProp}) {
 *   // Can switch to a different template based story-template, or only show a spoiler if index > 0
 *   return <BlankStory story={story} />
 * }
 *
 * const FIELDS = "id,headline,slug,url,hero-image-s3-key,hero-image-metadata,first-published-at,last-published-at,alternative,published-at,author-name,author-id,sections,story-template,tags,cards";
 * function storyPageLoadItems(pageNumber) {
 *   return global.superagent
 *            .get("/api/v1/stories", {fields: FIELDS, limit:5, offset:5*pageNumber})
 *            .then(response => response.body.stories.map(story => ({story: story, otherProp: "value"})));
 * }
 *
 * export function StoryPage(props) {
 *   return <InfiniteStoryBase {...props}
 *                             render={StoryPageBase}
 *                             loadItems={storyPageLoadItems}
 *                             onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
 *                             onInitialItemFocus={(item) => console.log(`Do Analytics ${item.story.headline}`)} />
 * }
 *
 * ```
 *
 * #### Not changing the URL on every page
 * When the next story is focussed, the url and title of the page will be set to the next story. If this is not required, it can be disabled by setting the prop doNotChangeUrl={true}.
 * This is typically used when showing the original story, followed by previews of subsequent stories.
 *
 * Example:
 * ```javascript
 *   <InfiniteStoryBase {...props}
 *                      render={StoryPageBase}
 *                      loadItems={storyPageLoadItems}
 *                      onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
 *                      doNotChangeUrl={true} />
 * ```
 * @component
 * @category Story Page
 */
export class InfiniteStoryBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreItems: [],
      loading: false,
      pageNumber: 0,
      seenStoryIds: [props.data.story.id]
    }
  }

  allItems() {
    return [this.props.data].concat(this.state.moreItems);
  }

  onFocus(index) {
    const item = this.allItems()[index];

    if(!this.props.doNotChangeUrl) {
      global.app.maybeSetUrl("/" + item.story.slug, get(item, ['story', 'seo', 'meta-title'], item.story.headline));
    }

    this.props.onItemFocus && this.props.onItemFocus(item, index);

    if(!this.state.seenStoryIds.includes(item.story.id)) {
      this.setState({seenStoryIds: this.state.seenStoryIds.concat([item.story.id])}, () => {
        this.props.onInitialItemFocus && this.props.onInitialItemFocus(item, index);
      })
    }
  }

  loadMore() {
    if(this.state.loading)
      return;
    const pageNumber = this.state.pageNumber;
    const story = get(this.props.data, ['story'], {});

    this.setState({loading: true, pageNumber: pageNumber + 1}, () => {
      this.props.loadItems(pageNumber, story, this.props.config).then((items) => {
        this.setState({
          loading: false,
          moreItems: this.state.moreItems.concat(removeDuplicateStories(this.allItems(), items, item => item.story.id))
        })
      })
    })
  }

  render() {
    return <InfiniteScroll render={this.props.render}
                           items={this.allItems()}
                           loadNext={() => this.loadMore()}
                           loadMargin={this.props.loadMargin}
                           focusCallbackAt={this.props.focusCallbackAt || 20}
                           onFocus={(index) => this.onFocus(index)}
                           neverHideItem={this.props.neverHideItem}/>
  }
}
