import React from 'react';
import PropTypes from 'prop-types';

/**
 * This render props component willupdate it's children via props while executing data loaders sent as props to the component.
 *
 * Note: Dataloaders are made to be at an app level to keep the component generic, the return of Dataloaders are sent as props to its children.
 *
 * Example
 *  ```javascript
 *  import {UpdateOnInterval} from '@quintype/components';
 *
 *  const story = {
 *     'example' : 'data'
 *  };
 *
 *  function getData() {
 *      return fetch('/url/something')//...
 *  }
 *
 * <UpdateOnInterval dataLoader={getData} interval={3000} initData={story}>
 *   {
 *     ({data}) => <Component data={data}></Component>
 *   }
 * </UpdateOnInterval>
 *  ```
 * @component
 * @hideconstructor
 * @category Other
 */
export class UpdateOnInterval extends React.Component {
    constructor(props){
        super(props);
        this.fetchIntervalIndex = -1;
        this.state = {
            data: this.props.initData,
        };
    }

    componentDidMount() {
        this.registerInterval();
    }

    componentWillMount() {
        this.unregisterInterval();
    }

    registerInterval() {
        this.fetchIntervalIndex = setInterval(() => this.setData(), this.props.interval);
    }

    unregisterInterval() {
        clearInterval(this.fetchIntervalIndex);
    }

    async setData() {
        const data = typeof this.props.dataLoader === 'function' ? await this.props.dataLoader() : {};
        this.setState({data});
    }

    render() {
        const {children} = this.props;
        const {data} = this.state;
        return children({data});
    }
}

UpdateOnInterval.defaultProps = {
    interval : 30000,
    initData: {}
};

UpdateOnInterval.propTypes = {
    /** Sets the time (ms) */
    interval : PropTypes.number,
    /** Async Function to load data */
    dataLoader : PropTypes.func.isRequired,
    /** The initial data for server side rendering */
    initData : PropTypes.any.isRequired
};
