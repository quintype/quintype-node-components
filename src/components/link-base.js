import React from "react";
import { string, func, bool } from "prop-types";

const preventDefaultImpl = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)
 * LinkBase is not connected to the store or plugged to context, this is used as an alternative for usecases such as partial hydration where context is lost.
 *
 * ```javascript
 * import { LinkBase } from '@quintype/components';
 * <LinkBase href="/section/story-slug" otherLinkAttribute="value">Text here</LinkBase>
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
  navigateTo,
  preventDefault = preventDefaultImpl,
  disableAjaxLinks = global.disableAjaxLinks || global.disableAjaxNavigation,
  ...otherProps
}) => {
  navigateTo = navigateTo || navigateToImpl;
  return React.createElement(
    "a",
    Object.assign(otherProps, {
      href,
      onClick(e) {
        if (disableAjaxLinks || e.ctrlKey || e.metaKey || e.shiftKey) {
          return;
        }

        const relativeLink = href.startsWith(currentHostUrl)
          ? href.replace(currentHostUrl, "")
          : href;

        if (!relativeLink.startsWith("/")) {
          return;
        }

        preventDefault(e);

        if (externalLink) {
          global.open(externalLink, "_blank");
        } else {
          navigateTo(relativeLink);
        }

        typeof callback === "function" && callback(e);
      },
    })
  );
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
};
