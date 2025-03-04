import React from 'react';

class StoryElementJwPlayer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { loadIframeOnClick, element } = this.props || {}
    const { url = '' } = element || {}
    if (!url) return null
    const srcUrl = url.startsWith("//") ? `https:${url}` : url
    return <video controls className='jw-player'>
      <source src={`${srcUrl}`} type="video/mp4" />
    </video>
  }
}

export default StoryElementJwPlayer;
