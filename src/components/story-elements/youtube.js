import getYouTubeID from 'get-youtube-id';
import { bool, func, object } from 'prop-types';
import React from 'react';
import { disconnectObserver, getQliticsSchema, initiateNewObserver } from '../../utils';
import { WithLazy } from '../with-lazy';

let YouTube = null;
let loaderPromise = null;

function loadLibrary() {
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-youtube" */ 'react-youtube')
      .then((YT) => {
        YouTube = YT.default;
      })
      .catch((err) => {
        console.log('Failed to load react-youtube', err);
        return Promise.reject();
      });
  }

  return loaderPromise;
}

function isLibraryLoaded() {
  return YouTube !== null;
}

function getYoutubeButton(onClick) {
  return (
    <button onClick={onClick} className="youtube-playBtn" aria-label="Play Video">
      <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M66.52 7.74C65.74 4.81 64.03 2.33 61.1 1.55C55.79 0.13 34 0 34 0C34 0 12.21 0.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74C0.0600001 13.05 0 24 0 24C0 24 0.0600001 34.95 1.48 40.26C2.26 43.19 3.97 45.67 6.9 46.45C12.21 47.87 34 48 34 48C34 48 55.79 47.87 61.1 46.45C64.03 45.67 65.74 43.19 66.52 40.26C67.94 34.95 68 24 68 24C68 24 67.94 13.05 66.52 7.74Z"
          fill="#FF0000"
        />
        <path d="M43 24L25 14V34" fill="white" />
      </svg>
    </button>
  );
}

class CustomStoryElementYoutube extends React.Component {
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
      threshold: 0.75
    });
    this.intersectionObserver.observe(targetElement);
  };

  triggerQlitics = (action) => {
    if (this.props.disableAnalytics === true) return false;

    const { story = {}, card = {}, element = {} } = this.props;
    const qliticsData = {
      ...getQliticsSchema(story, card, element),
      ...{ 'story-element-action': action }
    };
    if (global.qlitics) {
      global.qlitics('track', 'story-element-action', qliticsData);
    } else {
      global.qlitics =
        global.qlitics ||
        function () {
          (qlitics.q = qlitics.q || []).push(arguments);
        };
      qlitics.qlitics.q.push('track', 'story-element-action', qliticsData);
    }
  };

  onPlayCallback = (event) => {
    this.triggerQlitics('play');
    this.props.onPlay === 'function' && this.props.onPlay(event);

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
      this.videoPausedByObserver.current = true; // before the below line fires the pause event we set the videoPausedByObserver Ref to true, this lets the pause events callback to know that the video is not click-paused by the user but paused by the intersection observer
      player.pauseVideo();
    }
  };

  onPauseCallback = (event) => {
    this.triggerQlitics('pause');
    this.props.onPause === 'function' && this.props.onPause(event);

    const videoPausedByObserver = this.videoPausedByObserver.current;
    if (videoPausedByObserver) {
      this.videoPausedByObserver.current = false; // This is a clean up to set videoPausedByObserver back to false
    } else {
      disconnectObserver(this.intersectionObserver);
    }
  };

  onEndCallback = (event) => {
    this.triggerQlitics('end');
    this.props.onEnd === 'function' && this.props.onEnd(event);
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
        ref: this.videoRef
      });
    };

    if (this.props.loadIframeOnClick) {
      return (
        <div className="thumbnail-wrapper">
          {!this.state.showVideo && (
            <>
              {getYoutubeButton(this.renderVideo)}
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
  onEnd: func
};

const StoryElementYoutube = (props) => {
  return <WithLazy margin="0px">{() => <CustomStoryElementYoutube {...props} />}</WithLazy>;
};

export default StoryElementYoutube;
