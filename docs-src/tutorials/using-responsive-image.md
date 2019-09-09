# Using Responsive Image

The `ResponsiveImage` component takes sets three parameters.

### Art Direction Parameters

The first set of parameters are how the image should look and behave. These parameters include `slug`, `metadata`, `alt` and `aspectRatio`. The `imgParams` field is passed directly to thumbor.

If the `aspectRatio` field is set to an array, like `[16, 9]`, then the image applies the focus point algorithm to zoom correctly.

### Parameters to specify the sizes available

The next field is used to tell the browser which sizes are available for any image.

```javascript
<ResponsiveImage ... defaultWidth={480} widths={[250,480,640]}/>
```

In the above snippet, we see that the available widths for this image are 250, 480 and 640. This is set via the `srcset` image field. If the browser does not support `srcset`, then the image with `defaultWidth` set is used.

By default, browsers assume that all images will cover the full width, so they will try to download the image corresponding to your current screen size. Thus, if you specify `widths` of 480, 1000, 1500, and 3000 then view the page from your 1440px laptop, it will always try to download the 1500 image. If your screen is a retina display, it will try to download the 3000 image.

### Parameters to help the browser pick which size to use

The `widths` parameter tells the browser which image sizes are available. However, browsers still need some help choosing which size to download, particularly when the image is not full bleed.

In order to do this, you can use the `sizes` parameter. Let us consider the following application

```javascript
<ResponsiveImage ... sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"/>
```

This tells us that the image will be 98% of the screen width on mobile (upto 500px), 48% of the screen width on tablet, then 23% of the screen on desktop. The browser can calculate and make the call to fetch the appropriate image even before CSS is applied, based on the screen size.

### Performance Tip

Avoid bloating the site with heavy images. Use above `sizes` property to specify the required image dimensions for each resolution.

Example: If the Design requires the container (image) to be of 400w, make sure you're requesting for image slightly more than or equal to 400w, but not something like 200w, which will degrade the quality of image and also not something like 1000w, which will increase the size of your page.
