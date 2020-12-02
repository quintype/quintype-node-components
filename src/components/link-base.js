import React from "react";
import { string, func, bool } from 'prop-types';

const preventDefaultImpl = (e) => {
    e.preventDefault();
    e.stopPropagation();
};


/**
 * This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)
 *
 * ```javascript
 * import { LinkBase } from '@quintype/components';
 * <Link href="/section/story-slug" otherLinkAttribute="value">Text here</Link>
 * ```
 * @category Other
 * @component
 */
export const LinkBase = ({
                      navigateToImpl,
                      externalLink,
                      callback,
                      href,
                      currentHostUrl,
                      navigateTo = navigateToImpl,
                      preventDefault = preventDefaultImpl,
                      disableAjaxLinks = global.disableAjaxLinks || global.disableAjaxNavigation,
                      ...otherProps
                  }) => {
    return React.createElement("a", Object.assign(otherProps, {
        href,
        onClick(e) {
            if (disableAjaxLinks || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }

            const relativeLink = href.startsWith(currentHostUrl) ? href.replace(currentHostUrl, "") : href;

            if (!relativeLink.startsWith("/")) {
                return;
            }

            preventDefault(e);

            if(externalLink) {
                global.open(externalLink, "_blank");
            } else {
                navigateTo(relativeLink);
            }

            typeof callback === 'function' && callback(e);
        }
    }));
};

LinkBase.propTypes = {
    href: string.isRequired,
    externalLink: bool,
    callback: func,
    /** @private */
    navigateTo: func,
    /** @private */
    preventDefault: func,
    /** @private */
    disableAjaxLinks: bool,
}
