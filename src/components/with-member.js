import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getRequest } from './api-client';
import { MEMBER_UPDATED, MEMBER_BEING_LOADED } from '../store/actions';

let loadedMember = false;

class WithMemberBase extends React.Component {
  constructor(props) {
    super(props);
    this.checkForMemberUpdated = this.checkForMemberUpdated.bind(this);
  }

  checkForMemberUpdated() {
    this.props.memberBeingLoaded();
    return getRequest('/api/v1/members/me')
      .forbidden(() => this.props.memberUpdated(null))
      .unauthorized(() => this.props.memberUpdated(null))
      .json(({ member }) => this.props.memberUpdated(member))
  }

  componentDidMount() {
    if (!loadedMember) {
      loadedMember = true;
      this.checkForMemberUpdated();
    }
  }

  render() {
    const { member, logout, children, isLoading } = this.props;
    return children({ member, logout, isLoading, checkForMemberUpdated: this.checkForMemberUpdated});
  }
}

WithMemberBase.propTypes = {
  children: PropTypes.func.isRequired
};

function mapStateToProps({member, memberLoading}) {
  return {
    member: member || null,
    // undefined on server side
    isLoading: memberLoading === true || memberLoading === undefined,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    memberBeingLoaded: () => dispatch({ type: MEMBER_BEING_LOADED }),
    memberUpdated: member => dispatch({ type: MEMBER_UPDATED, member }),
    logout: () => getRequest('/api/logout').res(() => dispatch({ type: MEMBER_UPDATED, member: null }))
  };
}

/**
 * This is a render props component which will call your callback with the current logged in member. It will automatically call `/api/v1/members/me` to figure out if you are logged in, and replace the contents in the store and callback. In future, this may use LocalStorage to cache the member for some time.
 *
 * The render will also be passed a function to call for logging out, and another to force the library to check if the member is now logged in.
 *
 * On initial load, the `isLoading` prop will be set, which will become false when the user is loaded. Use this field to avoid showing a Login Button while fetch is happening.
 *
 * In order to update the current member, call `checkForMemberUpdated`.
 *
 * Example
 * ```javascript
 * import { WithMember } from '@quintype/components';
 *
 * function MyView({ member, logout, checkForMemberUpdated }) {
 *   return member ? <div>{member.name} <a onClick={logout}>Logout</a></div> : <div>Please Login!</div>;
 * }
 *
 * <WithMember>
 *   {({ member, logout, isLoading }) => (
 *     <MyView member={member} logout={logout} isLoading={isLoading} />
 *   )}
 * </WithMember>
 * ```
 * @component
 * @category Login
 */
export const WithMember = connect(mapStateToProps, mapDispatchToProps)(WithMemberBase);
