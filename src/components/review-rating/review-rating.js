import { bool, element, number, string } from "prop-types";
import React from "react";
import { StarIcon } from "./star-icon";

/**
 * This component takes in the value for rating and renders star for the value passed in. This comopent is generally used for story review type.
 *
 * Example
 * ```javascript
 * import { ReviewRating } from '@quintype/components';
 *
 * <ReviewRating value="3" />
 * ```
 * The component supports additional props which allows more customization, you can pass in props like size, color, count of stars or even change the render from star to a custom svg component. Refer to component src to know exact details of what is supported.
 * @component
 * @category Story Page
 */
export function ReviewRating({
                        value,
                        canShowEmptyRating = false,
                        size=20,
                        activeColor="gold",
                        inActiveColor="gray",
                        count=5,
                        showHalfStar=true,
                        className="review-rating",
                        activeSymbol=null,
                        inActiveSymbol=null,
                        halfActiveSymbol=null
                      }) {


  if(!canShowEmptyRating && value < 0.1) return null;


  const activeComponent = index => activeSymbol ? React.cloneElement(activeSymbol, {size, activeColor, inActiveColor,className:`${className}-symbol active`, key: `review-${index}`}) : <StarIcon size={size} foregroundColor={activeColor} backgroundColor={activeColor} className={`${className}-symbol active`} key={`review-${index}`} data-test-id = "star-icon"/>;

  const inActiveComponent = index => inActiveSymbol ? React.cloneElement(inActiveSymbol, {size, activeColor, inActiveColor, className:`${className}-symbol inactive`, key: `review-${index}`}) : <StarIcon size={size} foregroundColor={inActiveColor} backgroundColor={inActiveColor} className={`${className}-symbol inactive`} key={`review-${index}`} />;

  const halfActiveComponent = index => halfActiveSymbol ? React.cloneElement(halfActiveSymbol, {size, activeColor, inActiveColor, className:`${className}-symbol half-active`, key: `review-${index}`}) : <StarIcon size={size} foregroundColor={activeColor} backgroundColor={inActiveColor} className={`${className}-symbol half-active`} key={`review-${index}`} />;


  let children = [];
  for(let i = 1; i <= count; i++) {

    if(i <= Math.floor(value)) {
      children.push(activeComponent(i));
    }
    else if(showHalfStar && ((value - Math.floor(value)) > 0) && (i === Math.round(value))) {
      children.push(halfActiveComponent(i));
    }
    else {
      children.push(inActiveComponent(i));
    }
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}

ReviewRating.propTypes = {
  /** Rating value to be displayed */
  value: number.isRequired,
  /** Can show Empty rating */
  canShowEmptyRating: bool,
  /** Size of the icon (star) */
  size: number,
  /** Active color */
  activeColor: string,
  /** Inactive/ disabled stars color */
  inActiveColor: string,
  /** Number of stars to render */
  count: number,
  /** Show half stars */
  showHalfStar: bool,
  /** Classname for the containing div */
  className: string,
  /** Optional React component to render instead of active star */
  activeSymbol: element,
  /** Optional React component to render instead of inactive star */
  inActiveSymbol: element,
  /** Optional React component to render instead of half active star */
  halfActiveSymbol: element
};
