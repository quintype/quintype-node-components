import React from "react";
import { disconnectObserver, initiateNewObserver } from "../../utils";
import { WithLazy } from "../with-lazy";

class DailyMotion extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.observerRef = React.createRef();
    this.videoPausedByObserver = React.createRef(); // To check if the video is not click paused by user but paused by intersection observer, Its implemented this way because we cannot capture the click-pause event as videos are playing in iframe

    this.state = {
      showVideo: false,
      dmPlayer: null,
    };
  }

  componentDidMount() {
    if (!this.props.loadIframeOnClick) {
      this.addScript();
    }
  }

  renderVideo = () => {
    this.setState({ showVideo: true }, () => {
      this.addScript();
    });
  };

  intersectionCallback = (entries) => {
    const videoInVewPort = entries?.[0].isIntersecting;
    const player = this.state.dmPlayer;
    if (videoInVewPort) player.play();
    else {
      this.videoPausedByObserver.current = true;
      player.pause();
    }
  };

  startObserver = () => {
    const targetElement = this.observerRef.current;
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(targetElement);
    } else {
      this.intersectionObserver = initiateNewObserver(targetElement, this.intersectionCallback);
    }
  };

  handleVideoPause = () => {
    const isVideoPausedByObserver = this.videoPausedByObserver.current;
    if (isVideoPausedByObserver) {
      this.videoPausedByObserver.current = false; // This is a clean up to set videoPausedByObserver back to false
    } else {
      disconnectObserver(this.intersectionObserver);
    }
  };

  componentDidUpdate() {
    const player = this.state.dmPlayer;
    if (!player) return;
    if (!this.observerRef.current) return;
    player.on("ad_play", this.startObserver);
    player.on("ad_pause", this.handleVideoPause);
    player.on("play", this.startObserver);
    player.on("pause", this.handleVideoPause);
  }

  componentWillUnmount() {
    disconnectObserver(this.intersectionObserver);
  }

  addScript = () => {
    const { "video-id": videoId, "player-id": playerId } = this.props.element.metadata;
    const script = document.createElement("script");
    script.src = `https://geo.dailymotion.com/player/${playerId}.js`;
    script.dataset.video = videoId;
    this.containerRef.current.appendChild(script);

    script.onload = () => {
      window.dailymotion
        .createPlayer(this.containerRef.current.id, {
          video: videoId,
          player: playerId,
        })
        .then((player) => {
          this.setState({ dmPlayer: player });
        })
        .catch((e) => console.error("dm--error", e));
    };
  };

  render() {
    const videoId = this.props.element.metadata["video-id"];
    if (this.props.loadIframeOnClick) {
      return (
        <>
          {!this.state.showVideo && (
            <div className="thumbnail-wrapper">
              <button className="dailymotion-playBtn" onClick={this.renderVideo} aria-label="Play Video" />
              <img
                className="dailymotion-thumbnail"
                onClick={this.renderVideo}
                src={`https://www.dailymotion.com/thumbnail/video/${videoId}`}
                alt="daily-motion-video"
              />
            </div>
          )}
          {this.state.showVideo && (
            <div ref={this.observerRef}>
              <div
                className="dailymotion-embed-wrapper dm-embed-integration"
                ref={this.containerRef}
                id={`dm-embed-container-id-${videoId}`}
              />
            </div>
          )}
        </>
      );
    } else if (!this.props.loadIframeOnClick) {
      return (
        <div ref={this.observerRef}>
          <div
            className="dailymotion-embed-wrapper dm-embed-integration"
            ref={this.containerRef}
            id={`dm-embed-container-id-${videoId}`}
          />
        </div>
      );
    }
  }
}

export default function DailyMotionEmbedScript(props) {
  return <WithLazy margin="0px">{() => <DailyMotion {...props} />}</WithLazy>;
}
