import React from "react";
import { ResponsiveImage } from "./responsive-image";

const ImageGalleryElement = ({className, imageAspectRatio, defaultWidth, element={}, widths, story}) => {
    const images = element['story-elements'].map(image => (
      <figure key={image.id} className="story-element-image-gallery__image-container">
        <ResponsiveImage  slug={image["image-s3-key"]}
                          metadata={image["metadata"]}
                          aspectRatio={imageAspectRatio ? imageAspectRatio : [1,1]}
                          defaultWidth={defaultWidth ? defaultWidth : 480}
                          widths={widths ? widths : [250,480,640]}
                          imgParams={{auto: ['format','compress']}}
                          className={className ? className : 'story-element-image-gallery__image'}
                          alt={image.title || story.headline} />
      </figure>));

    return <div className="story-element-image-gallery">{images}</div>
    
  }

export { ImageGalleryElement };