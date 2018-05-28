import React from "react";
import { ResponsiveImage } from "./responsive-image";

const ImageGalleryElement = (props) => {
    const images = props.element['story-elements'].map(image => (
      <figure key={image.id} className="story-element-image-gallery__image-container">
        <ResponsiveImage slug={image["image-s3-key"]}
                        metadata={image["metadata"]}
                        aspect-ratio={[1,1]}
                        defaultWidth= {480}
                        widths={[250,480,640]}
                        imgParams={{auto: ['format','compress']}}
                        className='story-element-image-gallery__image'
                        alt={image.title || props.story.headline} />
      </figure>));

    return (
      <div className="story-element-image-gallery">
        {images}
      </div>
    )
  }

export { ImageGalleryElement };
