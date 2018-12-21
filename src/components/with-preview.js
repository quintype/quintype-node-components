import React from "react";

export function WithPreview(klazz, updateData) {
  return class WithPreviewWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { story: null };
    }

    componentDidMount() {
      global.addEventListener("message", event => {
        if (event.data && event.data.action == 'reloadStory' && event.data.story) {
          this.setState({ story: event.data.story })
        }
      });
    }

    render() {
      if(!this.state.story) {
        return <div style={{minHeight: 200}} />
      }
      return React.createElement(klazz, Object.assign({}, this.props, {
        data: updateData(this.props.data, this.state.story)
      }))
    }
  }
}
