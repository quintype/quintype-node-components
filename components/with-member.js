import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getRequest } from './api-client';
import { MEMBER_UPDATED } from '../store/actions';

let loadedMember = false;

class WithMemberBase extends React.Component {
  constructor(props) {
    super(props);
    this.checkForMemberUpdated = this.checkForMemberUpdated.bind(this);
  }

  checkForMemberUpdated() {
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
    const { member, logout, children } = this.props;
    return children({ member, logout, checkForMemberUpdated: this.checkForMemberUpdated });
  }
}

WithMemberBase.propTypes = {
  children: PropTypes.func.isRequired
}

export const WithMember = connect(mapStateToProps, mapDispatchToProps)(WithMemberBase);

function mapStateToProps(state) {
  return {
    member: state.member || null
  }
}

function mapDispatchToProps(dispatch) {
  return {
    memberUpdated: member => dispatch({ type: MEMBER_UPDATED, member }),
    logout: () => getRequest('/api/logout').res(() => dispatch({ type: MEMBER_UPDATED, member: null }))
  };
}
