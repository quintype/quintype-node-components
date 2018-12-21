import React from "react";
import get from 'lodash/get';
import { InfiniteScroll } from "./infinite-scroll.js";
import { removeDuplicateStories } from '../utils';

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
    global.app.maybeSetUrl("/" + item.story.slug, get(item, ['story', 'seo', 'meta-title'], item.story.headline));

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
                           onFocus={(index) => this.onFocus(index)}/>
  }
}
