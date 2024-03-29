import get from "lodash/get";
import { bool, object } from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { disconnectObserver, initiateNewObserver } from "../../utils";
import { WithLazy } from "../with-lazy";

const BrightcoveElement = (props) => {
  const { element = {}, loadIframeOnClick, policyKey = "" } = props;
  const { "account-id": accountId, "video-id": videoId, "player-id": playerId } = get(element, ["metadata"], {});
  const [showVideo, setVideoToggle] = useState(false);
  const [posterImage, setPosterImage] = useState("");
  const [myPlayer, setMyPlayer] = useState(null);
  const [thumbnailClicked, setThumbnailClicked] = useState(false);

  const videoRef = useRef();
  const videoPausedByObserver = useRef(); // To check if the video is not click paused by user but paused by intersection observer, Its implemented this way because we cannot capture the click-pause event as videos are playing in iframe
  const observerRef = useRef(); // To Observe video element for intersection

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
    myPlayer.on("pause", handleVideoPause);

    if (thumbnailClicked) myPlayer.play();

    return () => {
      myPlayer && myPlayer.off("play");
      myPlayer && myPlayer.off("pause");
      observerRef.current && disconnectObserver(observerRef.current);
    };
  }, [myPlayer, thumbnailClicked]);

  function intersectionCallback(entries) {
    const videoInViewPort = entries?.[0].isIntersecting;
    if (videoInViewPort) myPlayer.play();
    else {
      videoPausedByObserver.current = true; // before the below line fires the pause event we set the videoPausedByObserver Ref to true, this lets the pause events callback to know that the video is not click-paused by the user but paused by the intersection observer
      myPlayer.pause();
    }
  }

  function startObserver() {
    const targetElement = videoRef.current;
    const observer = observerRef.current;
    if (observer) {
      observer.observe(targetElement);
    } else {
      const intersectionObserver = initiateNewObserver(targetElement, intersectionCallback);
      observerRef.current = intersectionObserver;
    }
  }

  function handleVideoPause() {
    const observer = observerRef.current;
    const isVideoPausedByObserver = videoPausedByObserver.current;
    if (isVideoPausedByObserver) {
      videoPausedByObserver.current = false; // This is a clean up to set videoPausedByObserver back to false
    } else {
      disconnectObserver(observer);
    }
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
