import React from "react";
import {func, string} from 'prop-types';

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

/**
 * This component will ensure all {@link ResponsiveImages} that are in its descendent path will be loaded async. By default, the image is loaded with an empty gif, and the image becomes visible when the image scrolls 250 from the edge of the screen.
 *
 * You can use {@link EagerLoadImages} or `eager={true}` to force the image to be eager. If `EagerLoadImages` is passed a predicate, then images that pass a matching value to `eager` will be rendered eagerly.
 *
 * Example
 * ```javascript
 * import { LazyLoadImages, EagerLoadImages } from '@quintype/components';
 *
 * function LazyLoadSecondImage() {
 *   return <div>
 *     <ResponsiveImage slug={props["eager-image-1"]} />
 *     <LazyLoadImages margin={"450px"}>
 *       <div>
 *         <UnrelatedContent/>
 *         <ResponsiveImage slug={props["lazy-image-1"]} />
 *         <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} eager/>
 *         <ResponsiveImage slug={props["lazy-image-2"]} />
 *         <EagerLoadImages>
 *           <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} />
 *         </EagerLoadImages>
 *         <EagerLoadImages predicate={(token) => token % 2 === 0}>
 *           <ResponsiveImage slug={props["lazy-image"]} eager={1} />
 *           <ResponsiveImage slug={props["eager-image"]} eager={2} />
 *         </EagerLoadImages>
 *       </div>
 *     </LazyLoadImages>
 *     <ResponsiveImage slug={props["eager-image-2"]} />
 *   </div>
 * }
 * ```
 * @component
 * @category Images
 */
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

LazyLoadImages.childContextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
};

LazyLoadImages.propTypes = {
  margin: string
}
