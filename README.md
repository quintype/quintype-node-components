# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

### InfiniteScroll

This component can be used to implement InfiniteScroll. This is an internal component.

### InfiniteStoryBase

This component can be used to implement InfiniteScroll on the story page. You will need to specify the function which renders the story (which will recieve props.index and props.story), and functions for triggering analytics.

```javascript
import React from 'react';

import { BlankStory } from './story-templates';
import { InfiniteStoryBase } from '@quintype/components';

function StoryPageBase({index, story, otherProp}) {
  // Can switch to a different template based story-template, or only show a spoiler if index > 0
  return <BlankStory story={story} />
}

const FIELDS = "id,headline,slug,url,hero-image-s3-key,hero-image-metadata,first-published-at,last-published-at,alternative,published-at,author-name,author-id,sections,story-template,tags,cards";
function storyPageLoadItems(pageNumber) {
  return global.superagent
           .get("/api/v1/stories", {fields: FIELDS, limit:5, offset:5*pageNumber})
           .then(response => response.body.stories.map(story => ({story: story, otherProp: "value"})));
}

function StoryPage(props) {
  return <InfiniteStoryBase {...props}
                            render={StoryPageBase}
                            loadItems={storyPageLoadItems}
                            onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
                            onInitialItemFocus={(item) => console.log(`Do Analytics ${item.story.headline}`)} />
}

exports.StoryPage = StoryPage;
```
#### doNotChangeUrl
When the next story is focussed on, the url and title of the page will be set to the next story loaded by the Infinite Story Base. If this is not required, it can be disabled by setting the prop doNotChangeUrl={true}.
A valid use case for this: If the after the story, we are showing the snapshots of the next few stories, not the actual stories we dont want to change the url to the current story shown in the snapshot.
While disabling the url updating, please make sure that GA is not being fired for the next stories.
An Example:
```javascript
  <InfiniteStoryBase {...props}
                            render={StoryPageBase}
                            loadItems={storyPageLoadItems}
                            onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
                            doNotChangeUrl={true} />
```


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

### LoadMoreBase

This component starts with a set of stories, and then provides a load more button. This calls out to `/api/v1/stories` with the properties passed via the `params` prop. The stories are concatenated with the stories in `props.data.stories`, and the contents of `props.data` are passed to the rendered template.

It can accept an alternate `api` as a prop as well as `apiResponseTransformer` which can be used to tranformer the api response before being passed to the `template`.

```javascript
import { LoadMoreStoriesBase } from '@quintype/components';

function SectionPageWithStories({section, stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function SectionPage(props) {
  return <LoadMoreStoriesBase template={SectionPageWithStories}
                              fields={"id,headline"}
                              {...props}
                              params={{"section-id": props.data.section.id}}
                              api="/api/v1/stories"
                              apiResponseTransformer={(response) => response.stories} />
}
```

### LoadMoreCollectionStories

This component is very similar to the LoadMoreBase component but fetches the stories from a `collection`. The api call `/api/v1/collections/{collectionSlug}` is made with the passed collection slug value. The component accepts the `params` prop and a requires a Collection Slug from which to fetch the stories and returns a set of stories only.

```javascript
import { LoadMoreCollectionStories } from '@quintype/components';

function MoreCollectionStories({collection, stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function HomePage(props) {
  return <LoadMoreCollectionStories template={MoreCollectionStories}
                                    collectionSlug={props.data.collectionSlug}
                                    data={{collection: collection, stories: initialStories}}
                                    params={{}}/>
}
```

### Get Collection of stories written by a particular author
We can get the collection of stories written by a specific author by using the authorId prop as below:
```javascript
export function HomePage(props) {
  return <LoadMoreCollectionStories
            template={MoreCollectionStories}
            data={{stories: stories}}
            authorId={props.author.id}
            params={{}}
            numStoriesToLoad={10} />
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
