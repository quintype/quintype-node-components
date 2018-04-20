import React from "react";
import {connect} from "react-redux";
import {FocusedImage} from "quintype-js";
import {func} from 'prop-types';
import omit from 'lodash/omit';
import emptyWebGif from 'empty-web-gif';

const USED_PARAMS = ["imageCDN","defaultWidth","widths","imgParams","slug","metadata","aspectRatio"];

// Add the following CSS somewhere: img.qt-image { width: 100%; object-fit: cover; }

function hashString(string) {
  if(!string)
    return 0;

  var hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    hash  = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);

  function generatePath(size) {
    return "//" + props.imageCDN + "/" + image.path(props.aspectRatio, Object.assign({w: size}, props.imgParams));
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ?  props.widths.map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

export class ResponsiveImageBase extends React.Component {
  constructor(props, context) {
    if(process.env.NODE_ENV == 'development' && !props.alt) {
      global.console && global.console.warn(`Image Found without an alt attribute: ${responsiveProps(props).src}`);
    }

    super(props, context);
    this.state = {
      showImage: !context.lazyLoadObserveImage
    }
  }

  render() {
    const imageProps = this.state.showImage ? responsiveProps(this.props) : {src: emptyWebGif};
    return React.createElement("img", Object.assign(imageProps, omit(this.props, USED_PARAMS), {
      ref: dom => this.dom = dom,
      className: this.props.className ? `qt-image ${this.props.className}` : 'qt-image'
    }));
  }

  componentDidMount() {
    this.context.lazyLoadObserveImage && this.context.lazyLoadObserveImage(this.dom, this);
  }

  componentWillUnmount() {
    this.context.lazyLoadUnobserveImage && this.context.lazyLoadUnobserveImage(this.dom, this);
  }

  showImage() {
    this.setState({showImage: true});
  }
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);

// A non lazy intersection observer (just load all the images)
class FakeIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    console && console.warn && console.warn("IntersectionObserver was not found");
  }

  observe(dom) {
    this.callback([{isIntersecting: true, target: dom}])
  }

  unobserve() {
  }

  disconnect() {
  }
}

class IntersectionObserverWrapper {
  constructor(callback) {
    this.observedItems = [];
    this.callback = callback;
  }

  start(margin) {
    this.observer = new global.IntersectionObserver((entries) => this.onObservation(entries), {
      rootMargin: margin,
      threshold: 0,
    })
    this.observedItems.forEach(([dom, component]) => this.observer.observe(dom));
  }

  onObservation(entries) {
    entries
      .filter(entry => entry.isIntersecting)
      .map(entry => entry.target)
      .forEach(dom => {
        const index = this.observedItems.findIndex(x => x[0] == dom);
        if(index > -1) {
          const component = this.observedItems[index][1];
          this.callback(component);
          this.unregister(dom, component);
        }
      });
  }

  register(dom, component) {
    this.observedItems.push([dom, component]);
    this.observer && this.observer.observe(dom);
  }

  unregister(dom, component) {
    const index = this.observedItems.findIndex(x => x[0] == dom);

    if (index > -1) {
      this.observedItems.splice(index, 1);
      this.observer && this.observer.unobserve(dom);
    }
  }

  disconnect() {
    this.observer.disconnect();
  }
}

class StubObserverWrapper {
  constructor(callback) {
    this.callback = callback;
  }

  register(dom, component) {
    this.callback(component);
  }

  start() {}
  unregister() {}
  disconnect() {}
}

export class LazyLoadImages extends React.Component {
  constructor(props) {
    super(props);
    const callback = component => component.showImage()
    this.observerWrapper = global.IntersectionObserver ? new IntersectionObserverWrapper(callback) : new StubObserverWrapper(callback);
  }

  componentDidMount() {
    this.observerWrapper.start(this.props.margin || "500px")
  }

  componentWillUnmount() {
    this.observerWrapper.disconnect();
  }

  getChildContext() {
    return {
      lazyLoadObserveImage: (dom, component) => dom && this.observerWrapper.register(dom, component),
      lazyLoadUnobserveImage: (dom, component) => dom && this.observerWrapper.unregister(dom, component)
    }
  }

  render() {
    return this.props.children;
  }
}

ResponsiveImageBase.contextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
}

LazyLoadImages.childContextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
}
