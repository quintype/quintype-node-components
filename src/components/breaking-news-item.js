import { Link } from "./link";
import React from 'react';
import get from "lodash/get";

/**
 * This component can be used to render a BreakingNewsItem.
 *
 * Example
 * ```javascript
 * import {BreakingNewsItem} from '@quintype/components'
 *
 * <BreakingNewsItem item={item} className="breaking-news__headline"/>
 * ```
 * @see {@link BreakingNews}
 * @component
 * @category Header
 */
export function BreakingNewsItem({ item, className }) {
  const linkedStorySlug = get(item, ['metadata', 'linked-story-slug']);
  if (linkedStorySlug) {
    return <Link className={className} href={`/${linkedStorySlug}`}>{item.headline}</Link>
  } else {
    return <span className={className}>{item.headline}</span>
  }
}
