import React from "react";
import { WithLazy } from "../with-lazy";

class DailyMotion extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.observerRef = React.createRef();
    this.state = {
      showVideo: false,
      scriptLoaded: false,
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

  handleIntersection = (entries) => {
    if (entries?.[0].isIntersecting) this.state.dmPlayer.play();
    else this.state.dmPlayer.pause();
  };

  startObserver() {
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
      threshold: 0.75,
    });
    this.intersectionObserver.observe(this.observerRef.current);
  }

  componentDidUpdate() {
    if (!this.observerRef.current) return;
    if (!this.state.dmPlayer) return;
    if (!this.state.scriptLoaded) return;
    this.state.dmPlayer.on("start", () => this.startObserver());
  }

  componentWillUnmount() {
    if (this.observerRef.current) this.intersectionObserver.disconnect();
  }

  addScript = () => {
    const { "video-id": videoId, "player-id": playerId } = this.props.element.metadata;
    const script = document.createElement("script");
    script.src = `https://geo.dailymotion.com/player/${playerId}.js`;
    script.dataset.video = videoId;
    this.containerRef.current.appendChild(script);

    script.onload = () => {
      this.setState({ scriptLoaded: true });
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
