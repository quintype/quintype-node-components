import React from "react";
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

/**
 * This component can be used to render a menu from the menuItems in the editor. An extra class called active is applied if the menu item is the current url. By default, links will resolve via AJAX.
 *
 * Items will automatically be pulled from `config`, please remember to expose the `layout` key.
 *
 * Children are prepended to the list of items. Slice can be passed to extract a set of menu items.
 *
 * ```javascript
 * import { Menu } from '@quintype/components';
 *
 * <Menu className="menu-class" itemClassName="item-class" slice={[0, 10]}>
 *   <li>
 *     <a className="item-class" href="/"> होम </a>
 *   </li>
 * </Menu>
 * ```
 * @deprecated
 * @see {@link MenuItem}
 * @component
 * @category Header
 */
export const Menu = connect(mapStateToProps, () => ({}))(MenuBase);
