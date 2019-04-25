import React from "react";
import getYouTubeID from 'get-youtube-id';
import {getQliticsSchema} from "../../utils";

let YouTube = null;
let loaderPromise = null;

function loadLibrary(){
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-youtube" */ "react-youtube").then(YT => {
      YouTube = YT.default;
    }).catch(err => {
      console.log('Failed to load react-youtube', err);
      return Promise.reject();
    });
  }

  return loaderPromise;
}

function isLibraryLoaded(){
  return YouTube !== null;
}

export default class StoryElementYoutube extends React.Component {
  constructor(props) {
    super(props);
    this.opts = {
      playerVars: {
        autoplay: 0
      }
    };
  }

  componentDidMount(){
    this._isMounted = true;
    loadLibrary().then(() => this._isMounted && this.forceUpdate());
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  triggerQlitics = action => {
    if(this.props.disableAnalytics === true) return false;
    
    const {story = {}, card = {}, element = {}} = this.props;
    const qliticsData = {...getQliticsSchema(story,card,element), ...{'story-element-action': action}};
    if(global.qlitics){
      global.qlitics('track', 'story-element-action', qliticsData);
    }else{
      global.qlitics=global.qlitics||function(){(qlitics.q=qlitics.q||[]).push(arguments);};
      qlitics.qlitics.q.push('track', 'story-element-action', qliticsData);
    }
  };

  onPlayCallback = event => {
    this.triggerQlitics('play');
    this.props.onPlay === "function" && this.props.onPlay(event);
  };

  onPauseCallback = event => {
    this.triggerQlitics('pause');
    this.props.onPause === "function" && this.props.onPause(event);
  };

  onEndCallback = event => {
    this.triggerQlitics('end');
    this.props.onEnd === "function" && this.props.onEnd(event);
  };

  render() {
    if (isLibraryLoaded()) {
      return React.createElement(YouTube, {
        videoId: getYouTubeID(this.props.element.url),
        opts:this.opts,
        onPlay: this.onPlayCallback,
        onPause: this.onPauseCallback,
        onEnd: this.onEndCallback
      });
    }

    return <div></div>;
  }
}