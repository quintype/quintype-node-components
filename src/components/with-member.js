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
}

export const WithMember = connect(mapStateToProps, mapDispatchToProps)(WithMemberBase);

function mapStateToProps(state) {
  return {
    member: state.member || null,
    isLoading: state.memberLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    memberBeingLoaded: () => dispatch({ type: MEMBER_BEING_LOADED }),
    memberUpdated: member => dispatch({ type: MEMBER_UPDATED, member }),
    logout: () => getRequest('/api/logout').res(() => dispatch({ type: MEMBER_UPDATED, member: null }))
  };
}
