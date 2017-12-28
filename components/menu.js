import React from "react";
import URL from "url";
import { Link } from "./link";
import {connect} from "react-redux";

function MenuBase({children, className, itemClassName, items, currentUrl, slice}) {
  items = items.slice.apply(items, slice);
  return (
    <ul className={className}>
      {children}
      {items.map((item, ix) => <MenuItem key={ix}
                                         item={item}
                                         className={itemClassName}
                                         currentUrl={currentUrl}/>)}
    </ul>
  );
}

function mapStateToProps(state) {
  return {
    items: state.qt.config.layout.menu,
    currentUrl: state.qt.currentPath,
  }
}

export const Menu = connect(mapStateToProps, () => ({}))(MenuBase);

function getRelativeUrl(url) {
  const {pathname, search, hash} = new URL.parse(url);
  return `${pathname}${search || ""}${hash || ""}`;
}

function getMenuItemBody(item, className, url, currentUrl) {
  switch(item['item-type']) {
    case 'section': return <Link href={url} className={className}>{item.title}</Link>
    default: return <a href={item.url} className={className}>{item.title}</a>;
  }
}

export function MenuItem({item, className, currentUrl}) {
  const url = getRelativeUrl(item.url);
  return <li>{getMenuItemBody(item, `${className}${currentUrl == url ? " active": ""}`, url)}</li>;
}
