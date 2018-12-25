import React from "react";
import {connect} from "react-redux";
import {BREAKING_NEWS_UPDATED} from '../store/actions';
import {Link} from "./link";
import get from 'lodash/get';
import {getRequest} from './api-client';

class BreakingNewsBase extends React.Component {
  render() {
    return React.createElement(this.props.view, this.props);
  }

  updateBreakingNews() {
    getRequest('/api/v1/breaking-news')
      .json(response => this.props.breakingNewsUpdated(response.stories));
  }

  componentDidMount() {
    this.interval = global.setInterval(() => this.updateBreakingNews(), this.props.updateInterval || 60000);
    this.updateBreakingNews();
  }

  componentWillUnmount() {
    global.clearInterval(this.interval);
  }
}

function mapStateToProps(state) {
  return {
    config: state.qt.config || {},
    breakingNews: state.breakingNews || [],
    breakingNewsLoaded: state.breakingNewsLoaded || false,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    breakingNewsUpdated: (stories) => dispatch({type: BREAKING_NEWS_UPDATED, stories: stories})
  };
}

export const BreakingNews = connect(mapStateToProps, mapDispatchToProps)(BreakingNewsBase);

export function BreakingNewsItem({item, className}) {
  const linkedStorySlug = get(item,['metadata', 'linked-story-slug']);
  if(linkedStorySlug) {
    return <Link className={className} href={`/${linkedStorySlug}`}>{item.headline}</Link>
  } else {
    return <span className={className}>{item.headline}</span>
  }
}
