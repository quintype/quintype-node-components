# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

### LazyLoadImages

This component will ensure all [ResponsiveImages](#ResponsiveImage) that are in its descendent path will be loaded async. By default, the image is loaded with an empty gif, and the image becomes visible when the image scrolls 250 from the edge of the screen.

You can use `EagerLoadImages` or `eager={true}` to force the image to be eager. If `EagerLoadImages` is passed a predicate, then images that pass a matching value to `eager` will be rendered eagerly.

```javascript
import { LazyLoadImages, EagerLoadImages } from '@quintype/components';

function LazyLoadSecondImage() {
  return <div>
    <ResponsiveImage slug={props["eager-image-1"]} />
    <LazyLoadImages margin={50}>
      <div>
        <UnrelatedContent/>
        <ResponsiveImage slug={props["lazy-image-1"]} />
        <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} eager/>
        <ResponsiveImage slug={props["lazy-image-2"]} />
        <EagerLoadImages>
          <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} />
        </EagerLoadImages>
        <EagerLoadImages predicate={(token) => token % 2 === 0}>
          <ResponsiveImage slug={props["lazy-image"]} eager={1} />
          <ResponsiveImage slug={props["eager-image"]} eager={2} />
        </EagerLoadImages>
      </div>
    </LazyLoadImages>
    <ResponsiveImage slug={props["eager-image-2"]} />
  </div>
}
```

### ResponsiveHeroImage
This component takes is a wrapper over [ResponsiveImages](#ResponsiveImage), which accepts a story and returns the hero image. By default, it picks the alt text from the headline.

```javascript
import { ResponsiveHeroImage } from '@quintype/components';
<figure className="story-grid-item-image qt-image-16x9">
  <ResponsiveHeroImage story={props.story}
    aspectRatio={[16,9]}
    defaultWidth={480} widths={[250,480,640]} sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
    imgParams={{auto:['format', 'compress']}}/>
</figure>
```

### ResponsiveImage
This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.

Also see [Using Responsive Image](doc/using-responsive-image.md)

```javascript
import { ResponsiveImage } from '@quintype/components';

<figure className="story-grid-item-image qt-image-16x9">
  <ResponsiveImage slug={props.story["hero-image-s3-key"]}
    metadata={props.story["hero-image-metadata"]}
    alt={props.story['headline']}
    aspectRatio={[16,9]}
    defaultWidth={480} widths={[250,480,640]}
    sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
    imgParams={{auto:['format', 'compress']}}/>
</figure>
```

### Responsive Source
This component is used in more advanced usages if the aspect ratio is expected to change between screens

```javascript
import { ResponsiveSource } from '@quintype/components';

<figure className="story-grid-item-image">
  <picture>
    // Desktop Version
    <ResponsiveSource media="(min-width: 1024px)"
      slug={props.story["hero-image-s3-key"]}
      metadata={props.story["hero-image-metadata"]}
      aspectRatio={[4,3]}
      widths={[250,480,640]}
      sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
      imgParams={{auto:['format', 'compress']}}/>

    // Mobile Version
    <ResponsiveImage
      slug={props.story["hero-image-s3-key"]}
      metadata={props.story["hero-image-metadata"]}
      alt={props.story['headline']}
      aspectRatio={[16,9]}
      defaultWidth={480} widths={[250,480,640]}
      sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
      imgParams={{auto:['format', 'compress']}}/>
  </picture>
</figure>
```

## Recommended Components that are not included

### Sliders

For a slider, we recomment `react-slick`. It pulls in JQuery, which will add 90kb to your bundle, but is the most malleable slider out there

### Marquee for Breaking News

Our Marquee recommendation is `react-malarquee`. Just remember to mark all items as `display: inline`, and remove any floats. It supports `pauseOnHover`.

### ReactTable for table story elements

The story table element renders a very basic table story element. It can be enhaced by using 'react-table', which supports pagination and other fancy things.

###### Redux notes:

The component dispatches the following actions

* `ACCESS_BEING_LOADED`
* `ACCESS_UPDATED`
* `PAYMENT_OPTIONS_UPDATED`
* `SUBSCRIPTION_GROUP_UPDATED`
* `METER_UPDATED`
