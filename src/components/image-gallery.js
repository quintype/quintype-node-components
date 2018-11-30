import React from "react";
import { ResponsiveImage } from "./responsive-image";

const ImageGalleryElement = ({className, imageAspectRatio, defaultWidth, element={}, widths, story, onClickHandler}) => {
    const images = element['story-elements'].map((image, index) => (
      <figure data-test-id = "story-element-image-container" key={image.id}
        className={`story-element-image-gallery__image-container ${onClickHandler ? 'custom-cursor' : ''}`}
        onClick={() => onClickHandler && onClickHandler(index)}>
        <ResponsiveImage  slug={image["image-s3-key"]}
                          metadata={image["metadata"]}
                          aspectRatio={imageAspectRatio ? imageAspectRatio : [1,1]}
                          defaultWidth={defaultWidth ? defaultWidth : 480}
                          widths={widths ? widths : [250,480,640]}
                          imgParams={{auto: ['format','compress']}}
                          className={className ? className : 'story-element-image-gallery__image'}
                          alt={image.title || story.headline} />
      </figure>));

    return <div className="story-element-image-gallery" data-test-id = "story-element-image-gallery">{images}</div>

  }

export { ImageGalleryElement };
