import React from 'react';
import { connect } from 'react-redux';

const defaultPolltypeHost = 'https://www.polltype.com';

class PolltypeBase extends React.Component {

  componentDidMount() {
    this.loadPolltypeJS();
  }

  loadPolltypeJS() {
    const source = this.props.polltypeHost.replace(/^https:|^http:/i, '') + '/embed.js';
    if (!global._polltypeAdded) {
      global._polltypeAdded = true;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = source;
      document.body.appendChild(script);
    }
  }

  render() {
    return (
      <div data-polltype-embed-id={this.props.id} />
    );
  }
}

function mapStateToProps(state) {
  return {
    polltypeHost: state.qt.config["polltype-host"] || defaultPolltypeHost
  };
}

const Polltype = connect(mapStateToProps, {})(PolltypeBase);
export default Polltype;
