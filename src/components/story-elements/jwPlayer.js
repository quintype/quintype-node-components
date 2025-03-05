import React from 'react';

class JWPlayerComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { element } = this.props || {}
    const { metadata } = element || {}
    const { "player-url": playerUrl } = metadata || {}

    return (
      <div className='jw-player-container'>
        <iframe
          className='jw-player'
          src={playerUrl}
          allowFullScreen
        />
      </div>
    );
  }
}

export default JWPlayerComponent;
