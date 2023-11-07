import getYouTubeID from "get-youtube-id";
import { bool, func, object } from "prop-types";
import React from "react";
import { disconnectObserver, getQliticsSchema, initiateNewObserver } from "../../utils";
import { WithLazy } from "../with-lazy";

let YouTube = null;
let loaderPromise = null;

function loadLibrary() {
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-youtube" */ "react-youtube")
      .then((YT) => {
        YouTube = YT.default;
      })
      .catch((err) => {
        console.log("Failed to load react-youtube", err);
        return Promise.reject();
      });
  }

  return loaderPromise;
}

function isLibraryLoaded() {
  return YouTube !== null;
}

class CustomStoryElementYoutube extends React.Component {
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
    this.videoPausedByObserver = React.createRef(); // To check if the video is not click paused by user but paused by intersection observer, Its implemented this way because we cannot capture the click-pause event as videos are playing in iframe
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

  initiateObserver = (targetElement) => {
    this.removeObserverIfExists();
    this.intersectionObserver = new IntersectionObserver(this.intersectionCallback, {
      threshold: 0.75,
    });
    this.intersectionObserver.observe(targetElement);
  };

  triggerQlitics = (action) => {
    if (this.props.disableAnalytics === true) return false;

    const { story = {}, card = {}, element = {} } = this.props;
    const qliticsData = {
      ...getQliticsSchema(story, card, element),
      ...{ "story-element-action": action },
    };
    if (global.qlitics) {
      global.qlitics("track", "story-element-action", qliticsData);
    } else {
      global.qlitics =
        global.qlitics ||
        function () {
          (qlitics.q = qlitics.q || []).push(arguments);
        };
      qlitics.qlitics.q.push("track", "story-element-action", qliticsData);
    }
  };

  onPlayCallback = (event) => {
    this.triggerQlitics("play");
    this.props.onPlay === "function" && this.props.onPlay(event);

    this.videoRef.current = event.target;
    const targetElement = this.videoRef.current.getIframe();

    if (this.intersectionObserver) {
      this.intersectionObserver.observe(targetElement);
    } else {
      this.intersectionObserver = initiateNewObserver(targetElement, this.intersectionCallback);
    }
  };

  intersectionCallback = (entries) => {
    const videoInVewPort = entries?.[0].isIntersecting;
    const player = this.videoRef.current;
    if (videoInVewPort) player.playVideo();
    else {
      this.videoPausedByObserver.current = true;
      player.pauseVideo();
    }
  };

  onPauseCallback = (event) => {
    this.triggerQlitics("pause");
    this.props.onPause === "function" && this.props.onPause(event);

    const videoPausedByObserver = this.videoPausedByObserver.current;
    if (videoPausedByObserver) {
      this.videoPausedByObserver.current = false; // This is a clean up to set videoPausedByObserver back to false
    } else {
      disconnectObserver(this.intersectionObserver);
    }
  };

  onEndCallback = (event) => {
    this.triggerQlitics("end");
    this.props.onEnd === "function" && this.props.onEnd(event);
  };

  triggerIframe = () => {
    this._isMounted = true;
    loadLibrary().then(() => this._isMounted && this.forceUpdate());
  };

  onPlayerReady = (event) => {
    event.target.setVolume(100);
    event.target.playVideo();
  };

  renderVideo = () => {
    this.triggerIframe();
    this.setState({ showVideo: true });
  };

  render() {
    const youtubeIframe = () => {
      return React.createElement(YouTube, {
        videoId: getYouTubeID(this.props.element.url),
        opts: this.opts,
        onPlay: this.onPlayCallback,
        onPause: this.onPauseCallback,
        onEnd: this.onEndCallback,
        onReady: this.onPlayerReady,
        ref: this.videoRef,
      });
    };

    if (this.props.loadIframeOnClick) {
      return (
        <div className="thumbnail-wrapper">
          {!this.state.showVideo && (
            <>
              <button className="youtube-playBtn" onClick={this.renderVideo} aria-label="Play Video" />
              <img
                className="youtube-thumbnail"
                onClick={this.renderVideo}
                src={`https://i.ytimg.com/vi/${getYouTubeID(this.props.element.url)}/hqdefault.jpg`}
                alt="video"
              />
            </>
          )}
          {this.state.showVideo && isLibraryLoaded() && <div className="youtube-iframe-wrapper">{youtubeIframe()}</div>}
        </div>
      );
    } else if (!this.props.loadIframeOnClick && isLibraryLoaded()) {
      return <>{youtubeIframe()}</>;
    } else return <div />;
  }
}

CustomStoryElementYoutube.propTypes = {
  loadIframeOnClick: bool,
  disableAnalytics: bool,
  story: object,
  card: object,
  element: object,
  onPlay: func,
  onPause: func,
  onEnd: func,
};

const StoryElementYoutube = (props) => {
  return <WithLazy margin="0px">{() => <CustomStoryElementYoutube {...props} />}</WithLazy>;
};

export default StoryElementYoutube;
