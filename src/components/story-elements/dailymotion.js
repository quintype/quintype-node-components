import getVideoID from "get-video-id";
import { bool, func, object } from "prop-types";
import React from "react";
import { disconnectObserver, initiateNewObserver } from "../../utils";
import { WithLazy } from "../with-lazy";

let DailyMotion = null;
let loaderPromise = null;

function loadLibrary() {
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-dailymotion" */ "react-dailymotion")
      .then((DM) => {
        DailyMotion = DM.default;
      })
      .catch((err) => {
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
      showVideo: false,
    };
    this.opts = {
      playerVars: {
        autoplay: 0,
      },
    };
    this.videoRef = React.createRef();
    this.videoPausedByObserver = React.createRef();
  }

  componentDidMount() {
    if (!this.props.loadIframeOnClick) {
      this.triggerIframe();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    disconnectObserver(this.intersectionObserver);
  }

  startObserver = (targetElement) => {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(targetElement);
    } else {
      this.intersectionObserver = initiateNewObserver(targetElement, this.intersectionCallback);
    }
  };

  onAdPlayCallback = (event) => {
    const targetElement = event.target;
    this.videoRef.current = targetElement;
    this.startObserver(targetElement);
  };

  onPlayCallback = (event) => {
    this.props.onPlay === "function" && this.props.onPlay(event);

    const targetElement = event.target;
    this.videoRef.current = targetElement;
    this.startObserver(targetElement);
  };

  handleVideoPause = () => {
    const videoPausedByObserver = this.videoPausedByObserver.current;
    if (videoPausedByObserver) {
      this.videoPausedByObserver.current = false;
    } else {
      disconnectObserver(this.intersectionObserver);
    }
  };

  intersectionCallback = (entries) => {
    const player = this.videoRef.current;
    const videoInVewPort = entries?.[0].isIntersecting;

    if (videoInVewPort) player.play();
    else {
      this.videoPausedByObserver.current = true;
      player.pause();
    }
  };

  onPauseCallback = (event) => {
    this.props.onPause === "function" && this.props.onPause(event);
    this.handleVideoPause();
  };

  onAdPauseCallback = () => {
    this.handleVideoPause();
  };

  onEndCallback = (event) => {
    this.props.onEnd === "function" && this.props.onEnd(event);
  };

  triggerIframe = () => {
    this._isMounted = true;
    loadLibrary().then(() => this._isMounted && this.forceUpdate());
  };

  renderVideo = () => {
    this.triggerIframe();
    this.setState({ showVideo: true });
  };

  render() {
    const { id: videoId } = getVideoID(this.props.element.metadata["dailymotion-url"]);
    const dailymotionIframe = ({ autoplay } = false) => {
      return React.createElement(DailyMotion, {
        video: videoId,
        opts: this.opts,
        onPlay: this.onPlayCallback,
        onPause: this.onPauseCallback,
        onEnd: this.onEndCallback,
        onAdPlay: this.onAdPlayCallback,
        onAdPause: this.onAdPauseCallback,
        autoplay: autoplay,
        ref: this.videoRef,
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
      return dailymotionIframe();
    } else return <div />;
  }
}

CustomStoryElementDailyMotion.propTypes = {
  loadIframeOnClick: bool,
  disableAnalytics: bool,
  story: object,
  card: object,
  element: object,
  onPlay: func,
  onPause: func,
  onEnd: func,
};

const StoryElementDailyMotion = (props) => {
  return <WithLazy margin="0px">{() => <CustomStoryElementDailyMotion {...props} />}</WithLazy>;
};

export default StoryElementDailyMotion;
