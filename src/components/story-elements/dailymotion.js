import getVideoID from "get-video-id";
import { PropTypes } from "prop-types";
import React from "react";
import { WithLazy } from "../with-lazy";

let DailyMotion = null;
let loaderPromise = null;

function loadLibrary() {
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-dailymotion" */ "react-dailymotion")
      .then(DM => {
        DailyMotion = DM.default;
      })
      .catch(err => {
        console.log("Failed to load react-dailymotion", err);
        return Promise.reject();
      });
  }

  return loaderPromise;
}

function isLibraryLoaded() {
  return DailyMotion !== null;
}

class CustomStoryElementDailyMotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false
    };
    this.opts = {
      playerVars: {
        autoplay: 0
      }
    };
  }

  componentDidMount() {
    if (!this.props.loadIframeOnClick) {
      this.triggerIframe();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onPlayCallback = event => {
    this.props.onPlay === "function" && this.props.onPlay(event);
  };

  onPauseCallback = event => {
    this.props.onPause === "function" && this.props.onPause(event);
  };

  onEndCallback = event => {
    this.props.onEnd === "function" && this.props.onEnd(event);
  };

  triggerIframe = () => {
    this._isMounted = true;
    loadLibrary().then(() => this._isMounted && this.forceUpdate());
  };

  onPlayerReady = event => {
    event.target.setVolume(100);
    event.target.playVideo();
  };

  renderVideo = () => {
    this.triggerIframe();
    this.setState({ showVideo: true });
  };

  render() {
    const { id: videoId } = getVideoID(this.props.element.metadata["dailymotion-url"]);

    const dailymotionIframe = () => {
      return React.createElement(DailyMotion, {
        video: videoId,
        opts: this.opts,
        onPlay: this.onPlayCallback,
        onPause: this.onPauseCallback,
        onEnd: this.onEndCallback,
        autoplay: true
      });
    };

    if (this.props.loadIframeOnClick) {
      return (
        <div className="thumbnail-wrapper">
          {!this.state.showVideo && (
            <>
              <button className="dailymotion-playBtn" onClick={this.renderVideo} aria-label="Play Video" />
              <img
                className="dailymotion-thumbnail"
                onClick={this.renderVideo}
                src={`https://www.dailymotion.com/thumbnail/video/${videoId}`}
                alt="daily-motion-video"
              />
            </>
          )}
          {this.state.showVideo && isLibraryLoaded() && (
            <div className="dailymotion-iframe-wrapper">{dailymotionIframe()}</div>
          )}
        </div>
      );
    } else if (!this.props.loadIframeOnClick && isLibraryLoaded()) {
      return React.createElement(DailyMotion, {
        video: videoId,
        opts: this.opts,
        onPlay: this.onPlayCallback,
        onPause: this.onPauseCallback,
        onEnd: this.onEndCallback
      });
    } else return <div />;
  }
}

CustomStoryElementDailyMotion.propTypes = {
  loadIframeOnClick: PropTypes.bool,
  disableAnalytics: PropTypes.bool,
  story: PropTypes.object,
  card: PropTypes.object,
  element: PropTypes.object,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func
};

const StoryElementDailyMotion = props => {
  return <WithLazy margin="0px">{() => <CustomStoryElementDailyMotion {...props} />}</WithLazy>;
};

export default StoryElementDailyMotion;