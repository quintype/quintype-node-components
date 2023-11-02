import get from "lodash/get";
import { bool, object } from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { WithLazy } from "../with-lazy";

const BrightcoveElement = (props) => {
  const { element = {}, loadIframeOnClick, policyKey = "" } = props;
  const { "account-id": accountId, "video-id": videoId, "player-id": playerId } = get(element, ["metadata"], {});
  const [showVideo, setVideoToggle] = useState(false);
  const [posterImage, setPosterImage] = useState("");
  const [myPlayer, setMyPlayer] = useState(null);
  const [observer, setObserver] = useState(null);
  const [thumbnailClicked, setThumbnailClicked] = useState(false);
  const videoRef = useRef();

  const loadLibrary = () => {
    if (!window?.BrightcovePlayerLoader) {
      return import(/* webpackChunkName: "qtc-react-brightcove" */ "@brightcove/react-player-loader")
        .then((module) => {
          window.BrightcovePlayerLoader = module.default;
          setVideoToggle(true);
        })
        .catch((err) => {
          console.log("Failed to load @brightcove/react-player-loader", err);
          return Promise.reject();
        });
    }
    setVideoToggle(true);
  };

  useEffect(() => {
    if (!loadIframeOnClick) {
      loadLibrary();
    }
  }, [loadIframeOnClick]);

  useEffect(() => {
    if (!myPlayer) return;
    myPlayer.on("play", startObserver);
    if (thumbnailClicked) myPlayer.play();

    return () => {
      myPlayer && myPlayer.off("play");
      observer && observer.disconnect();
    };
  }, [myPlayer, thumbnailClicked]);

  function handleIntersection(entries) {
    if (!entries?.[0]) return;
    if (entries[0].isIntersecting) myPlayer.play();
    else myPlayer.pause();
  }

  function startObserver() {
    const intersectionObserver = new IntersectionObserver((entries) => handleIntersection(entries), {
      threshold: 0.75,
    });

    intersectionObserver.observe(videoRef.current);
    setObserver(intersectionObserver);
  }

  const brightcoveIframe = () => {
    const BrightcovePlayerLoader = window?.BrightcovePlayerLoader;
    return (
      <BrightcovePlayerLoader
        accountId={accountId}
        videoId={videoId}
        playerId={playerId}
        attrs={{ className: "brightcove-player" }}
        onSuccess={(success) => setMyPlayer(success.ref)}
        onFailure={() => console.log("brightcove failed to load")}
      />
    );
  };

  const getPoster = async () => {
    if (!posterImage) {
      const { videos } = await (
        await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos?q=id:${videoId}`, {
          headers: { "BCOV-Policy": policyKey },
        })
      ).json();
      setPosterImage(videos[0].poster || "");
    }
  };

  if (loadIframeOnClick) {
    if (!showVideo) {
      getPoster();
    }
    return (
      <div className="brightcove-wrapper" ref={videoRef}>
        {!showVideo && (
          <div
            onClick={async () => {
              await loadLibrary();
              setThumbnailClicked(true);
            }}
          >
            <button className="brightcove-playBtn" aria-label="Play Video" />
            {posterImage ? (
              <img className="brightcove-poster" src={posterImage} alt="video" />
            ) : (
              <div className="brightcove-poster-fallback" />
            )}
          </div>
        )}
        {showVideo && window?.BrightcovePlayerLoader && brightcoveIframe(true)}
      </div>
    );
  } else if (!loadIframeOnClick && window?.BrightcovePlayerLoader) {
    return (
      <div className="brightcove-wrapper" ref={videoRef}>
        {brightcoveIframe()}
      </div>
    );
  } else {
    return null;
  }
};

BrightcoveElement.propTypes = {
  loadIframeOnClick: bool,
  element: object,
};

const StoryElementBrightcove = (props) => {
  return <WithLazy margin="0px">{() => <BrightcoveElement {...props} />}</WithLazy>;
};

export default StoryElementBrightcove;
