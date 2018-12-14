import React from "react";
import {func} from 'prop-types';

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
    });
    this.observedItems.forEach(([dom, component]) => this.observer.observe(dom));
  }

  onObservation(entries) {
    entries
      .filter(entry => {
        return (entry.isIntersecting === undefined || entry.isIntersecting)
      })
      .map(entry => entry.target)
      .forEach(dom => {
        const index = this.observedItems.findIndex(x => x[0] === dom);
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
    const index = this.observedItems.findIndex(x => x[0] === dom);

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

export class EagerLoadImages extends React.Component {
  getChildContext() {
    return {
      lazyLoadObserveImage: null,
      lazyLoadUnobserveImage: null
    }
  }

  render() {
    return this.props.children;
  }
}

EagerLoadImages.childContextTypes = LazyLoadImages.childContextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
};
