import { connect } from "react-redux";

import { mapStateToProps, mapDispatchToProps } from './impl/client-side-only-impl';

/**
 * This component calls the render prop with `clientSideRendered` = true if the client side is completely loaded, and false during SSR and initial bootup.
 *
 * Example
 * ```javascript
 * import { WithClientSideOnly } from '@quintype/components';
 * <WithClientSideOnly>
 *   {({clientSideRendered}) => (
 *     {clientSideRendered && <span>This will be shown only on the client side</span>}
 *   )}
 * </WithClientSideOnly>
 * ```
 * @see {@link ClientSideOnly} for an earlier version of this component
 * @component
 */
export const WithClientSideOnly = connect(mapStateToProps, mapDispatchToProps)(WithClientSideOnlyBase);

function WithClientSideOnlyBase({ clientSideRendered = false, children }) {
  return children({ clientSideRendered })
}
