import React from 'react';
import {connect} from 'react-redux';

import {HAMBURGER_CLICKED} from "../store/actions";

function HamburgerButtonBase({onClick, children}) {
  return <a href="/" onClick={onClick}>{children}</a>;
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (e) => {
      e.stopPropagation();
      e.preventDefault();
      dispatch({type: HAMBURGER_CLICKED});
    }
  };
}

/**
 * This component can be used to trigger an action openening the Hamburger menu. The state can be accessed via state.hamburgerOpened
 *
 * Example
 * ```javascript
 * import { HamburgerButton } from '@quintype/components';
 * <HamburgerButton>
 *   <img src="/path/to/hamburger.png"/>
 * </HamburgerButton>
 * ```
 * @component
 * @category Header
 */
export const HamburgerButton = connect(state => ({}), mapDispatchToProps)(HamburgerButtonBase);
