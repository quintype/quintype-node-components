import React from "react";
import {connect} from "react-redux";
import {BREAKING_NEWS_UPDATED} from '../store/actions';
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

/**
 * This component will automatically fetch breaking news every 30 seconds, and render the provided view.
 *
 * Example
 * ```javascript
 * import { renderBreakingNews } from '@quintype/framework/client/start';
 * const BreakingNewsView = ({breakingNews, breakingNewsLoaded}) =>
 *   <ul>{breakingNews.map((item, index) => <li key={index}><BreakingNewsItem item={item} /></li>)}</ul>
 * renderBreakingNews('breaking-news-container', store, BreakingNewsView);
 * ```
 * @see {@link BreakingNewsItem}
 * @component
 * @category Header
 */
export const BreakingNews = connect(mapStateToProps, mapDispatchToProps)(BreakingNewsBase);
