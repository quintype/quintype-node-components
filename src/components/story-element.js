import React from "react";
import classNames from "classnames";
import JSEmbed from "./story-elements/jsembed";
import StoryElementYoutube from "./story-elements/youtube";
import { ResponsiveImage } from "./responsive-image";
import Polltype from "./story-elements/polltype";
import { Table } from "./story-elements/table";
import { Link } from "./link";
import get from "lodash/get";
import { getQliticsSchema } from "../utils";

/**
 * This component renders different types of [story elements](https://developers.quintype.com/malibu/terminology#story-elements)

 * Qlitics event is fired on story-elements become visible (this can be disabled by passing a prop called `disableAnalytics={true}`)
 *
 * Example
 * ```javascript
 * import { StoryElement } from '@quintype/components';
 * function StoryCard(props){
 *   return <div>
 *     {props.card['story-elements'].map((element, index) => <StoryElement element={element} key={index} story={props.story}></StoryElement>)}
 *   </div>
 * }
 * ```
 * For different quality images in Image Story Element, pass `imageWidths` and `imageDefaultWidth` as props
 * ```javascript
 * <StoryElement story={story} element={element} imageWidths={[420,1040,1600]} imageDefaultWidth={1040}/>
 * ```
 *
 * FIXME: the templates property will allow you to pass in a custom template to override the story elements type.
 *
 * @component
 * @hideconstructor
 * @category Story Page
 */
export class StoryElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }
  componentDidCatch(error, stack) {
    this.setState({
      crashed: true,
      error: error
    });
    console && console.error(`Caught Exception: ${error && error.message}`);
  }

  render() {
    if (this.state.crashed) {
      return <div className="story-element story-element-crashed" />;
    } else {
      return React.createElement(StoryElementBase, this.props);
    }
  }
}

function StoryElementText({ element = {}, externalLink }) {
  let text = element.text || "";
  if (externalLink) {
    text = element.text.replace(/<a/g, '<a target="_blank"');
  }
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: text }
  });
}

function StoryElementAlsoRead({ element, story, alsoreadText = "Also Read: " }) {
  const linkedStories = get(story, ["linked-stories"]);
  const linkedStoryId = get(element, ["metadata", "linked-story-id"]);
  const linkedStorySlug = get(linkedStories, [linkedStoryId, "slug"]);
  const storyUrl = `/${linkedStorySlug}`;
  const linkProps = {
    className: "story-element-text-also-read__link",
    href: storyUrl
  };

  return React.createElement(
    "h3",
    {},
    React.createElement(
      "span",
      { className: "story-element-text-also-read__label" },
      alsoreadText
    ),
    React.createElement(Link, linkProps, element.text)
  );
}

function StoryElementImage({
  element,
  story = {},
  imageWidths,
  imageDefaultWidth,
  onClick = () => {}
}) {
  return React.createElement(
    "figure",
    {},
    React.createElement(ResponsiveImage, {
      slug: element["image-s3-key"],
      metadata: element["metadata"],
      aspectRatio: null,
      defaultWidth: imageDefaultWidth || 640,
      widths: imageWidths || [360, 640, 1200],
      imgParams: { auto: ["format", "compress"] },
      alt: element.title || story.headline,
      onClick
    }),
    React.createElement(
      "div",
      { className: "story-element-caption-attribution-wrapper" },
      element.title
        ? React.createElement("figcaption", {
            dangerouslySetInnerHTML: { __html: element.title },
            className: "story-element-image-title"
          })
        : undefined,
      element["image-attribution"]
        ? React.createElement("figcaption", {
            dangerouslySetInnerHTML: { __html: element["image-attribution"] },
            className: "story-element-image-attribution"
          })
        : undefined
    )
  );
}

function StoryElementTitle({ element }) {
  return React.createElement("h2", {}, element.text);
}

function StoryElementSoundCloud({ element }) {
  return React.createElement("iframe", {
    src: element["embed-url"],
    width: "100%"
  });
}

function StoryElementJsembed({ element }) {
  return React.createElement(JSEmbed, {
    embedJS: element["embed-js"],
    id: element["id"]
  });
}

function StoryElementPolltype({ element }) {
  return React.createElement(Polltype, { id: element["polltype-id"] });
}

function StoryElementTable({ element }) {
  return React.createElement(Table, {
    id: element.id,
    data: element.data,
    hasHeader: element.metadata["has-header"]
  });
}

function StoryElementFile({ element }) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "story-element-file__title" },
      element["file-name"]
    ),
    React.createElement(
      "a",
      {
        className: "story-element-file__link",
        href: element.url,
        download: true
      },
      "download"
    )
  );
}

// FIXME MISSING: composite
// TODO: Can also support various subtypes (though not needed potentially)

const DEFAULT_TEMPLATES = {
  text: StoryElementText,
  image: StoryElementImage,
  title: StoryElementTitle,
  "youtube-video": StoryElementYoutube,
  "soundcloud-audio": StoryElementSoundCloud,
  jsembed: StoryElementJsembed,
  polltype: StoryElementPolltype,
  table: StoryElementTable,
  "also-read": StoryElementAlsoRead,
  file: StoryElementFile
};

class StoryElementBase extends React.Component {
  constructor(props) {
    super(props);
    this.observer = null;
    this.storyElementRef = null;
  }

  componentDidMount() {
    this.initiateObserver();
  }

  componentWillUnmount() {
    this.destroyObserver();
  }

  initiateObserver = () => {
    if (this.props.disableAnalytics === true) return false;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };
    this.observer = new IntersectionObserver(this.observerCallback, options);
    this.observer.observe(this.storyElementRef);
  };

  destroyObserver = () => {
    this.observer && this.observer.disconnect();
  };

  observerCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.emitElementQlitics();
      }
    });
  };

  template() {
    const storyElement = this.props.element;
    const templates = Object.assign(
      {},
      DEFAULT_TEMPLATES,
      this.props.templates
    );
    return (
      templates[storyElement.subtype] || templates[storyElement.type] || "div"
    );
  }

  emitElementQlitics() {
    const { story = {}, card = {}, element = {} } = this.props;
    if (global.qlitics) {
      global.qlitics(
        "track",
        "story-element-view",
        getQliticsSchema(story, card, element)
      );
    } else {
      global.qlitics =
        global.qlitics ||
        function() {
          (qlitics.q = qlitics.q || []).push(arguments);
        };
      global.qlitics(
        "track",
        "story-element-view",
        getQliticsSchema(story, card, element)
      );
    }
  }

  storyElement() {
    return this.props.element;
  }

  render() {
    const storyElement = this.props.element;
    const typeClassName = `story-element-${storyElement.type}`;
    const subtypeClassName = `story-element-${storyElement.type}-${
      storyElement.subtype
    }`;

    const storyElementTemplate = this.template();

    const { renderTemplates = {}, ...elementProps } = this.props;
    const renderTemplate =
      renderTemplates[storyElement.subtype] ||
      renderTemplates[storyElement.type];

    return React.createElement(
      "div",
      {
        className: classNames({
          "story-element": true,
          [typeClassName]: true,
          [subtypeClassName]: !!storyElement.subtype
        }),
        ref: ref => (this.storyElementRef = ref)
      },
      renderTemplate
        ? React.createElement(
            renderTemplate,
            { ...elementProps },
            React.createElement(
              storyElementTemplate,
              Object.assign({}, elementProps)
            )
          )
        : React.createElement(
            storyElementTemplate,
            Object.assign({}, elementProps)
          )
    );
  }
}

export const STORY_ELEMENT_TEMPLATES = DEFAULT_TEMPLATES;
