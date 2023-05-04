import get from "lodash/get";
import { bool, object } from "prop-types";
import React, { useEffect, useState } from "react";
import { WithLazy } from "../with-lazy";

let BrightcovePlayerLoader = null;
let loaderPromise;

const CustomElementBrightcove = (props) => {
  const { element = {}, loadIframeOnClick } = props;
  const { "account-id": accountId, "video-id": videoId, "player-id": playerId } = get(element, ["metadata"], {});
  const [showVideo, handleVideoDisplay] = useState(false);
  const [isLibraryLoaded, handleLibrary] = useState(false);
  const [posterImage, handlePosterImage] = useState("");

  const loadLibrary = () => {
    if (!window?.BrightcovePlayerLoader) {
      if (!loaderPromise && !isLibraryLoaded) {
        return (loaderPromise = import(/* webpackChunkName: "qtc-react-brightcove" */ "@brightcove/react-player-loader")
          .then((module) => {
            BrightcovePlayerLoader = module.default;
            window.BrightcovePlayerLoader = BrightcovePlayerLoader;
            handleLibrary(true);
          })
          .catch((err) => {
            console.log("Failed to load @brightcove/react-player-loader", err);
            return Promise.reject();
          }));
      }
    }
    if (window.BrightcovePlayerLoader) {
      handleLibrary(true);
    }
    return loaderPromise;
  };

  useEffect(() => {
    if (!loadIframeOnClick) {
      loadLibrary();
    }
  }, [loadIframeOnClick]);

  const brightcoveIframe = () => {
    return (
      <BrightcovePlayerLoader
        accountId={accountId}
        videoId={videoId}
        playerId={playerId}
        attrs={{ className: "brightcove-player" }}
        onSuccess={(success) => {
          var myPlayer = success.ref;
          myPlayer.ready(function () {
            myPlayer.muted(true);
            myPlayer.play();
          });
        }}
        onFailure={() => console.log("brightcove failed to load")}
      />
    );
  };
  const renderVideo = () => {
    loadLibrary();
    handleVideoDisplay(true);
  };

  const getThumbnail = async () => {
    // need to update header policykey once the referenced ticket hits prod
    if (!posterImage) {
      const { videos } = await (
        await fetch(`https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos?q=id:${videoId}`, {
          headers: {
            "BCOV-Policy":
              "BCpkADawqM3CNfUEBYGvWS8QqHHg-g5kzNt63RmoOyVlrIL4zT67_KKSzlaI5TGMXIZZ4Yrtz28v7EcHTsTWAiOolxok8ZNqFrkNGru9OOumeQ8wX5csvYqx7zl468WgbhqDnpePPhQVpQfr",
          },
        })
      ).json();
      handlePosterImage(videos[0].poster || "");
    }
  };

  if (loadIframeOnClick) {
    if (!showVideo) {
      getThumbnail();
    }
    return (
      <div className="brightcove-wrapper">
        {!showVideo && (
          <>
            <button className="brightcove-playBtn" onClick={renderVideo} aria-label="Play Video" />
            <img className="brightcove-poster" onClick={renderVideo} src={posterImage} alt="video" />
          </>
        )}
        {showVideo && isLibraryLoaded && brightcoveIframe()}
      </div>
    );
  } else if (!loadIframeOnClick && isLibraryLoaded) {
    return <div className="brightcove-wrapper">{brightcoveIframe()}</div>;
  } else {
    return <></>;
  }
};

CustomElementBrightcove.propTypes = {
  loadIframeOnClick: bool,
  element: object,
};

const StoryElementBrightcove = (props) => {
  return <WithLazy margin="0px">{() => <CustomElementBrightcove {...props} />}</WithLazy>;
};

export default StoryElementBrightcove;
