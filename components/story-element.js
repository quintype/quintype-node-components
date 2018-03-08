import React from "react";
import classNames from "classnames";
import getYouTubeID from 'get-youtube-id';
import YouTube from 'react-youtube';
import JSEmbed from './story-elements/jsembed';
import { ResponsiveImage } from "./responsive-image";
import Polltype from './story-elements/polltype';
import {Table} from './story-elements/table';
import { Link } from './link';

function storyElementText(storyElement) {
  return React.createElement("div", {dangerouslySetInnerHTML: {__html: storyElement.text}});
}

function storyElementAlsoRead(storyElement, props) {
  const storyUrl = props.story['linked-stories'] && '/' + props.story['linked-stories'][storyElement.metadata['linked-story-id']]['slug'];
  const linkProps = { className: "story-element-text-also-read__link",
                      href: storyUrl
                    };
  return React.createElement("h3", {},
    React.createElement("span", { className: "story-element-text-also-read__label" }, "Also read: "),
    React.createElement(Link, linkProps, storyElement.text)
  );
}

function storyElementImage(storyElement) {
  return React.createElement("figure", {},
    React.createElement(ResponsiveImage, {
      slug: storyElement["image-s3-key"],
      metadata: storyElement["metadata"],
      aspectRatio: null,
      defaultWidth: 480,
      widths: [250,480,640],
      imgParams: {auto:['format', 'compress']}
    }),
    storyElement.title ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: storyElement.title}, className: "story-element-image-title"}) : undefined,
    storyElement['image-attribution'] ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: storyElement['image-attribution']}, className: "story-element-image-attribution"}) : undefined
  );
}

function storyElementTitle(storyElement) {
  return React.createElement("h2", {}, storyElement.text);
}

function storyElementSoundCloud(storyElement) {
  return React.createElement("iframe", { 'src': storyElement['embed-url'], 'width': '100%'} );
}

function storyElementJsembed(storyElement) {
  return React.createElement(JSEmbed, {embedJS: storyElement['embed-js'], id: storyElement['id']});
}

function storyElementYoutube(storyElement) {
  const opts = {
    playerVars: {
      autoplay: 0
    }
  };
  return React.createElement(YouTube, {videoId: getYouTubeID(storyElement.url), opts:opts });
}

function storyElementPolltype(storyElement) {
  return React.createElement(
    Polltype,
    {id: storyElement['polltype-id']}
  );
}

function storyElementTable(storyElement) {
  return React.createElement(Table, { id: storyElement.id, data: storyElement.data, hasHeader: storyElement.metadata['has-header']});
}

// FIXME MISSING: composite
// TODO: Can also support various subtypes (though not needed potentially)
const DEFAULT_TEMPLATES = {
  "text": {render: storyElementText},
  "image": {render: storyElementImage},
  "title": {render: storyElementTitle},
  "youtube-video": {render: storyElementYoutube},
  "soundcloud-audio": {render: storyElementSoundCloud},
  "jsembed": {render: storyElementJsembed},
  "polltype": {render: storyElementPolltype},
  "table": {render: storyElementTable},
  "also-read": {render: storyElementAlsoRead}
};

class StoryElementBase extends React.Component {
  template() {
    const storyElement = this.props.element;
    const templates = Object.assign({}, DEFAULT_TEMPLATES, this.props.templates);
    return Object.assign(
      {render: () => [], componentDidMount: () => true, componentWillUnmount: () => true},
      templates[storyElement.type],
      templates[storyElement.subtype]
    );
  }

  componentDidMount() {
    const componentDidMount = this.template().componentDidMount;
    if(componentDidMount)
      componentDidMount.call(this);
  }

  componentWillUnmount() {
    const componentWillUnmount = this.template().componentWillUnmount;
    if(componentWillUnmount)
      componentWillUnmount.call(this);
  }

  storyElement() {
    return this.props.element;
  }

  render() {
    const storyElement = this.props.element;
    const typeClassName = `story-element-${storyElement.type}`;
    const subtypeClassName = `story-element-${storyElement.type}-${storyElement.subtype}`;

    return React.createElement("div", {
      className: classNames({
        "story-element": true,
        [typeClassName]: true,
        [subtypeClassName]: !!storyElement.subtype
      })
    }, this.template().render.call(this, this.props.element, this.props))
  }
}

export class StoryElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {crashed: false};
  }

  componentDidCatch(error, stack) {
    this.setState({
      crashed: true,
      error: error
    });
    console && console.error(`Caught Exception: ${error && error.message}`)
  }

  render() {
    if(this.state.crashed) {
      return <div className="story-element story-element-crashed" />;
    } else {
      return React.createElement(StoryElementBase, this.props);
    }
  }
}

export const STORY_ELEMENT_TEMPLATES = DEFAULT_TEMPLATES;
