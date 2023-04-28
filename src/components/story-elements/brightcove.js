import { bool, func, object } from 'prop-types'
import React, { useState } from 'react'
import { WithLazy } from '../with-lazy'

let Brightcove = null
let loaderPromise = null

const loadLibrary = () => {
  if (!loaderPromise) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-brightcove" */ '@brightcove/react-player-loader')
      .then(Bc => {
        Brightcove = Bc.default
      })
      .catch(err => {
        console.log('Failed to load @brightcove/react-player-loader', err)
        return Promise.reject()
      })
  }

  return loaderPromise
}

const isLibraryLoaded = Brightcove !== null

const CustomElementBrightcove = props => {
  const { element = {}, card = {}, story = {}, disableAnalytics, loadIframeOnClick } = props
  const [showVideo, handleVideoDisplay] = useState(false)

  useEffect(() => {
    if (!loadIframeOnClick) {
      loadLibrary()
    }
  }, [loadIframeOnClick])

  // const triggerQlitics = action => {
  //   if (disableAnalytics) return false

  //   const qliticsData = {
  //     ...getQliticsSchema(story, card, element),
  //     ...{ 'story-element-action': action }
  //   }
  //   if (global.qlitics) {
  //     global.qlitics('track', 'story-element-action', qliticsData)
  //   } else {
  //     global.qlitics =
  //       global.qlitics ||
  //       function () {
  //         ;(qlitics.q = qlitics.q || []).push(arguments)
  //       }
  //     qlitics.qlitics.q.push('track', 'story-element-action', qliticsData)
  //   }
  // }

  // onPlayCallback = (event) => {
  //   this.triggerQlitics("play");
  //   this.props.onPlay === "function" && this.props.onPlay(event);
  // };

  // onPauseCallback = (event) => {
  //   this.triggerQlitics("pause");
  //   this.props.onPause === "function" && this.props.onPause(event);
  // };

  // onEndCallback = (event) => {
  //   this.triggerQlitics("end");
  //   this.props.onEnd === "function" && this.props.onEnd(event);
  // };

  // onPlayerReady = (event) => {
  //   event.target.setVolume(100);
  //   event.target.playVideo();
  // };

  const brightcoveIframe = () => {
    const updatedOpts = { aspectRatio: '16:9', autoplay: true, muted: true, responsive: true }
    return (
      <Brightcove
        accountId={get(element, ['metadata', 'account-id'])}
        videoId={get(element, ['metadata', 'video-id'])}
        playerId={get(element, ['metadata', 'player-id'])}
        opts={updatedOpts}
        // onPlay={ this.onPlayCallback}
        // onPause: this.onPauseCallback,
        // onEnd: this.onEndCallback,
        // onReady: this.onPlayerReady,
      />
    )
  }
  const renderVideo = () => {
    loadLibrary()
    handleVideoDisplay(true)
  }
  if (loadIframeOnClick) {
    return (
      <div className='thumbnail-wrapper'>
        {!showVideo && (
          <>
            <button className='youtube-playBtn' onClick={renderVideo} aria-label='Play Video' />
            <img
              className='youtube-thumbnail'
              onClick={renderVideo}
              src={`https://i.ytimg.com/vi/${getYouTubeID(this.props.element.url)}/hqdefault.jpg`}
              alt='video'
            />
          </>
        )}
        {showVideo && isLibraryLoaded && <div className='youtube-iframe-wrapper'>{brightcoveIframe()}</div>}
      </div>
    )
  } else if (!loadIframeOnClick && isLibraryLoaded) {
    return brightcoveIframe()
  } else return <></>
}

CustomElementBrightcove.propTypes = {
  loadIframeOnClick: bool,
  disableAnalytics: bool,
  story: object,
  card: object,
  element: object,
  onPlay: func,
  onPause: func,
  onEnd: func
}

const StoryElementBrightcove = props => {
  return <WithLazy margin='0px'>{() => <CustomElementBrightcove {...props} />}</WithLazy>
}

export default StoryElementBrightcove
