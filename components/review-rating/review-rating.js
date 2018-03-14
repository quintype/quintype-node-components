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

    const activeComponent = activeSymbol ? React.cloneElement(activeSymbol, {size, activeColor, inActiveColor,className:`${className}-symbol active`}) : <StarIcon size={size} foregroundColor={activeColor} backgroundColor={activeColor} className={`${className}-symbol active`} />;

    const inActiveComponent = inActiveSymbol ? React.cloneElement(inActiveSymbol, {size, activeColor, inActiveColor, className:`${className}-symbol inactive`}) : <StarIcon size={size} foregroundColor={inActiveColor} backgroundColor={inActiveColor} className={`${className}-symbol inactive`} />;

    const halfActiveComponent = halfActiveSymbol ? React.cloneElement(halfActiveSymbol, {size, activeColor, inActiveColor, className:`${className}-symbol half-active`}) : <StarIcon size={size} foregroundColor={activeColor} backgroundColor={inActiveColor} className={`${className}-symbol half-active`} />;


     let children = [];
     for(let i = 1; i <= count; i++) {

       if(i <= Math.floor(value)) {
          children.push(activeComponent);
       } 
       else if(showHalfStar && ((value - Math.floor(value)) > 0) && (i === Math.round(value))) {
          children.push(halfActiveComponent); 
          }
       else {
        children.push(inActiveComponent);
       } 
     }

    return (
        <div className={className}>
          {children}
        </div>
    );
}

export { ReviewRating };

ReviewRating.PropTypes = {
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