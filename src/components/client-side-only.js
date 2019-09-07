import React from "react";
import {connect} from "react-redux";

import {mapStateToProps, mapDispatchToProps} from './impl/client-side-only-impl';

class ClientSideOnlyBase extends React.Component {
  render() {
    if (this.props.clientSideRendered) {
      return <div className="client-side-only client-side-only-client">{this.props.children}</div>;
    } else {
      return React.createElement(
        this.props.serverComponent || "div",
        Object.assign({ className: "client-side-only client-side-only-server" }, this.props)
      );
    }
  }
}

/**
 * This component will be loaded by client, and bypassed when doing server side rendering.
 *
 * Example
 * ```javascript
 * import { ClientSideOnly } from '@quintype/components';
 * <ClientSideOnly>
 *   This will be shown only on the client side
 * </ClientSideOnly>
 * ```
 * @see {@link WithClientSideOnly} for a render props version of this component
 * @component
 * @category Other
 */
export const ClientSideOnly = connect(mapStateToProps, mapDispatchToProps)(ClientSideOnlyBase);
