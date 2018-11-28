import React from "react";
import { StarIcon } from "./star-icon";
import PropTypes from "prop-types";

const ReviewRating = ({
                        value,
                        size=20,
                        activeColor="gold",
                        inActiveColor="gray",
                        count=5,
                        showHalfStar=true,
                        className="review-rating",
                        activeSymbol=null,
                        inActiveSymbol=null,
                        halfActiveSymbol=null
                      }) => {

  if(value < 0.1) return null;

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
};

export { ReviewRating };

ReviewRating.propTypes = {
  // Rating value to be displayed
  value: PropTypes.number.isRequired,
  // Size of the icon (star)
  size: PropTypes.number,
  // Active color
  activeColor: PropTypes.string,
  // Inactive/ disabled stars color
  inActiveColor: PropTypes.string,
  // Number of stars to render
  count: PropTypes.number,
  // Show half stars
  showHalfStar: PropTypes.bool,
  // Classname for the containing div
  className: PropTypes.string,
  // Optional React component to render instead of active star
  activeSymbol: PropTypes.element,
  // Optional React component to render instead of inactive star
  inActiveSymbol: PropTypes.element,
  // Optional React component to render instead of half active star
  halfActiveSymbol: PropTypes.elemenet
};
