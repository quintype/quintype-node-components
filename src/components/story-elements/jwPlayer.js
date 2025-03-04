import React from 'react';

class JWPlayerComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { element, loadIframeOnClick } = this.props || {}
    const { metadata } = element || {}
    const { "player-id": playerId, "video-id": videoId, "player-url": playerUrl } = metadata || {}

    return (
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
        <iframe
          src={playerUrl}
          allowFullScreen
          frameBorder="0"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
}

export default JWPlayerComponent;
