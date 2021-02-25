import React from 'react';
import { Link } from "./link";

/**
 * @see {@link Menu}
 * @deprecated
 * @component
 * @category Header
 */
export function MenuItem({ item, className, currentUrl }) {
  const url = getRelativeUrl(item.url);
  return <li>{getMenuItemBody(item, `${className}${currentUrl == url ? " active" : ""}`, url)}</li>;
}

function getRelativeUrl(url) {
  const {pathname, search, hash} = new URL(url);
  return `${pathname}${search || ""}${hash || ""}`;
}

function getMenuItemBody(item, className, url, currentUrl) {
  switch(item['item-type']) {
    case 'section': return <Link href={url} className={className}>{item.title}</Link>
    default: return <a href={item.url} className={className}>{item.title}</a>;
  }
}
