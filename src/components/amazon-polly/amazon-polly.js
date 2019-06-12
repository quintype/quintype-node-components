import React from "react";
import get from "lodash/get";
import { HeadsetIcon } from "./headset-icon";
import { CloseIcon } from "./close-icon";

export class AmazonPolly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onClickHandler = () => {
    this.setState({
      isOpen: true
    })
  }

  closeHandler = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {  
    const { caption, className = "amazon-polly", story, config, audioAttributes = { controls: true }, headsetColor = "#333" } = this.props;
    const cdn = get(config, ["cdn-image"]);
    const audioS3Key = get(story, ["story-audio", "s3-key"]);
    const audioSrc = `//${cdn}/${audioS3Key}`;

    return <div className={`${className}-wrapper`}>
      <div className={`${className}-text-wrapper`} onClick={this.onClickHandler}>
        <div className={`${className}-headset-wrapper`}>
          <HeadsetIcon size={24} color={headsetColor} className={`${className}-headset`} />
        </div>
        <span className={`${className}-text`}>Listen to story</span>
      </div>
      {!this.state.isOpen ? null : <div className={`${className}-bar-wrapper`}>
        <figure className={`${className}-content`}>
          <figcaption className={`${className}-caption`}>{caption}</figcaption>
          <audio className={`${className}-audio`} src={audioSrc} {...audioAttributes}>
            Your browser doesn't support the <code>audio</code> element.
          </audio>
        </figure>
        <div className={`${className}-close-wrapper`} onClick={this.closeHandler}>
          <CloseIcon size={24} className={`${className}-close`} />
        </div>
      </div>}
    </div>;
  }
}