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
    return <div>
      <video controls width="600">
        <source src={`${srcUrl}`} type="video/mp4" />
      </video>
    </div>
  }
}

export default StoryElementJwPlayer;
