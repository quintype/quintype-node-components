The {@link ResponsiveImage} component is used in conjunction with the focus point functionality. Given a focus point in the editor, ResponsiveImage will fit the image to the given aspect ratio (ensuing the focused point remains in view), and also prevents the browser with multiple sizes of the image, so that the browser can pick one that is most appropriate.

A prerequisite to using ResponsiveImage is that the aspect ratio must remain the same across all device sizes. If this is not the case, please see [Different Aspect Ratios for Different Devices](#different-aspect-ratios-for-different-devices)

Used without any props, an example of using responsive image looks as follows:
```javascript
import { ResponsiveImage } from "@quintype/components";

<ResponsiveImage slug={"path/to/props"} alt="Alternate Text" />
```

## Resizing Parameters

{@link ResponsiveImage} accepts the `aspectRatio` and `metadata` to zoom into a particular part of the image. The metadata comes from the stories api, and can be found in `story["hero-image-metadata"]` for most stories. An example of resizing a hero image to a 16x9 follows:

```javascript
<ResponsiveImage slug={story["hero-image-s3-key"]}
                 metadata={story["hero-image-metadata]}
                 aspectRatio={[16, 9]}
                 alt="Alternate Text"/>
```

Alternatively, you may just use {@link ResponsiveHeroImage} if you just want to show the hero image of the story.

```javascript
import { ResponsiveHeroImage } from "@quintype/components";

<ResponsiveHeroImage story={story} />
```


## Parameters to specify the sizes available

The `defaultWidth` and `widths` props can be used to tell the browser which sizes are available for any image.

```javascript
<ResponsiveImage ... defaultWidth={480} widths={[250,480,640]}/>
```

In the above snippet, we see that the available widths for this image are 250, 480 and 640. This is set via the `srcset` image field. If the browser does not support `srcset`, then the image with `defaultWidth` set is used.

By default, browsers assume that all images will cover the full width, so they will try to download the image corresponding to your current screen size. Thus, if you specify `widths` of 480px, 1000px, 1500px, and 3000px then view the page from your 1440px laptop, it will always try to download the 1500px image. If your screen is a retina display, it will try to download the 3000px image.

## Parameters to help the browser pick which size to use

The `widths` parameter tells the browser which image sizes are available. However, browsers still need some help choosing which size to download, particularly when the image is not full bleed.

In order to do this, you can use the `sizes` parameter. Let us consider the following application

```javascript
<ResponsiveImage ... sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"/>
```

This tells us that the image will be 98% of the screen width on mobile (upto 500px), 48% of the screen width on tablet, then 23% of the screen on desktop. The browser can calculate and make the call to fetch the appropriate image even before CSS is applied, based on the screen size.

## Performance Tip

Avoid bloating the site with heavy images. Use above `sizes` property to specify the required image dimensions for each resolution.

Example: If the Design requires the container (image) to be of 400w, make sure you're requesting for image slightly more than or equal to 400w, but not something like 200w, which will degrade the quality of image and also not something like 1000w, which will increase the size of your page.

## Other Parameteres

If you wish to send other parameters to the quintype image resizing engine, they can be specified via the `imgParams` prop

```javascript
<ResponsiveImage ... imgParams={{q: 75}}/>
```

## Different Aspect Ratios for Different Devices

If you would like to use different aspect ratios on different devices, please see {@link ResponsiveSource}. The html standard suggests using figure + source for art direction, and img + srcset only for quality.
