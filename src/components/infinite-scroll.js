import React from "react";

// An item in the infinite scroll
class ScrollItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minHeight: props.minHeight
    }
  }

  render() {
    return <div ref={node => this.node = node}
                data-infinite-scroll={this.props.index}
                style={{minHeight: this.state.minHeight}}>
      {this.props.show && this.props.render(Object.assign({index: this.props.index}, this.props.data))}
    </div>;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.show && !this.props.show) {
      this.setState({minHeight: this.props.minHeight});
    } else if(!nextProps.show && this.props.show) {
      this.setState({minHeight: this.node.clientHeight});
    }
  }

  componentDidMount() {
    this.props.observers.forEach(observer => observer && observer.observe(this.node));
  }

  componentWillUnmount() {
    this.props.observers.forEach(observer => observer && observer.unobserve(this.node));
  }
}

// When this becomes visible, we call loadMore()
class ScrollLoadMore extends React.Component {
  render() {
    return <div ref={node => this.node = node} data-infinite-scroll="load-more"/>;
  }

  componentDidMount() {
    this.props.observers.forEach(observer => observer && observer.observe(this.node));
  }

  componentWillUnmount() {
    this.props.observers.forEach(observer => observer && observer.unobserve(this.node));
  }
}

// Basic Infinite Scroll, toggles showing items
class InfiniteScrollBase extends React.Component {
  constructor(props) {
    super(props);
    const initiallyShow = props.initiallyShow || 1;
    this.state = {
      visibleComponents: [...Array(initiallyShow).keys()].reduce((arr, i) => { arr[i] = true; return arr }, {})
    }
    if(global.IntersectionObserver) {
      this.loadObserver = new IntersectionObserver((x) => this.intersectionCallback(x), {
        rootMargin: props.loadMargin || "200px 0px 500px"
      });
    }
  }

  componentWillUnmount() {
    this.loadObserver && this.loadObserver.disconnect();
  }

  intersectionCallback(entries) {
    var visibleComponents = this.state.visibleComponents;
    entries.forEach(entry => {

      // Stupid browsers like UC and Mi don't correctly support the spec
      if(entry.isIntersecting === undefined) {
        if(this.props.showAllOnLegacyBrowser) {
          entry.isIntersecting = true;
        } else {
          return;
        }
      }

      const item = entry.target.getAttribute("data-infinite-scroll");
      if(item == 'load-more' && entry.isIntersecting) {
        this.props.loadNext();
      } else {
        const showItem = this.props.neverHideItem ? visibleComponents[item] || entry.isIntersecting : entry.isIntersecting;
        visibleComponents = Object.assign({}, visibleComponents, {[item]: showItem});
      }
    })
    this.setState({visibleComponents: visibleComponents});
  }

  render() {
    return <div>
      {this.props.items.map((data, index) =>
        <ScrollItem observers={this.props.observers.concat([this.loadObserver])}
                    key={index}
                    index={index}
                    show={this.state.visibleComponents[index]}
                    render={this.props.render}
                    data={data}
                    minHeight={this.props.minHeight || 50}/>)}
      <ScrollLoadMore observers={[this.loadObserver]} />
    </div>;
  }
}

// Calls a callback when an item covers bottom 20% of the screen (to change URL)
function withFocusObserver(Component) {
  return class WithFocusObserver extends React.Component {
    constructor(props) {
      super(props);
      if(global.IntersectionObserver) {
        this.focusObserver = new IntersectionObserver((x) => this.focusCallback(x), {
          rootMargin: `-${100 - props.focusCallbackAt}% 0px -${props.focusCallbackAt}%`
        })
      }
    }

    componentWillUnmount() {
      this.focusObserver && this.focusObserver.disconnect();
    }

    focusCallback(entries) {
      entries.forEach(entry => {
        const item = entry.target.getAttribute("data-infinite-scroll");
        if(entry.isIntersecting) {
          this.props.onFocus(item)
        }
      });
    }

    render() {
      return React.createElement(Component, Object.assign({}, this.props, {
        observers: (this.props.observers || []).concat([this.focusObserver])
      }))
    }
  }
}

/**
 * This component can be used to implement InfiniteScroll. This is an internal component.
 * @private
 * @category Other
 * @component
 */
export const InfiniteScroll = withFocusObserver(InfiniteScrollBase);
