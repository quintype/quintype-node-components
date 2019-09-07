# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

   * [Quintype Components](#quintype-components)
         * [BreakingNews](#breakingnews)
         * [BreakingNewsItem](#breakingnewsitem)
         * [Collection](#collection)
         * [ClientSideOnly](#clientsideonly)
         * [DfpAds](#dfpads)
         * [AdbutlerAds](#adbutlerads)
         * [HamburgerButton](#hamburgerbutton)
         * [ImageGalleryElement](#imagegalleryelement)
         * [InfiniteScroll](#infinitescroll)
         * [InfiniteStoryBase](#infinitestorybase)
         * [LazyCollection](#lazycollection)
         * [LazyLoadImages](#lazyloadimages)
         * [Link](#link)
         * [LoadMoreBase](#loadmorebase)
         * [LoadMoreCollectionStories](#loadmorecollectionstories)
         * [LoadingIndicator](#loadingindicator)
         * [Menu](#menu)
         * [NavigationComponentBase](#navigationcomponentbase)
         * [ResponsiveHeroImage](#responsiveheroimage)
         * [ResponsiveImage](#responsiveimage)
         * [Responsive Source](#responsive-source)
         * [SearchPageBase](#searchpagebase)
         * [Search box](#search-box)
         * [SocialShare](#socialshare)
         * [StoryElement](#storyelement)
         * [WithClientSideOnly](#withclientsideonly)
         * [WithError](#witherror)
         * [WithHostUrl](#withhosturl)
         * [WithLazy](#withlazy)
         * [WithMember](#withmember)
         * [WithPreview](#withpreview)
         * [WithSocialLogin](#withsociallogin)
         * [Review Rating](#review-rating)
      * [Recommended Components that are not included](#recommended-components-that-are-not-included)
         * [Sliders](#sliders)
         * [Marquee for Breaking News](#marquee-for-breaking-news)
         * [ReactTable for table story elements](#reacttable-for-table-story-elements)
         * [UpdateOnInterval](#UpdateOnInterval)
         * [AccessType](#accesstype)

### BreakingNews
This component will automatically fetch breaking news every 30 seconds, and render the provided view.

```javascript
import { renderBreakingNews } from '@quintype/framework/client/start';
const BreakingNewsView = ({breakingNews, breakingNewsLoaded}) =>
  <ul>{breakingNews.map((item, index) => <li key={index}><BreakingNewsItem item={item} /></li>)}</ul>
renderBreakingNews('breaking-news-container', store, BreakingNewsView);
```

### BreakingNewsItem

This component can be used to render a BreakingNewsItem.

```javascript
import {BreakingNewsItem} from '@quintype/components'

<BreakingNewsItem item={item} className="breaking-news__headline"/>
```

### Collection

This component can be used to render a collection. You should typically pass this a collection that represents a page. Also see [LazyCollection](#lazycollection).

```javascript
import {Collection} from '@quintype/components'

// collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})

function TwoColLayout({collection, associatedMetadata, index}) {
  // for item in collection.item
  //   if item.type == story
  //     showStory
  //   else if item.type == colection
  //     <Collection />
  // speed = associatedMetadata.scroll_speed
}

function collectionTemplates(layout, index) {
  if(layout == 'twoColLayout')
    return TwoColLayout;
}

// optional
function storyTemplates(index) {
  return StoryTemplate;
}

// optional
function interstitial(index) {
  if(index % 2 == 0)
    return <AdComponent />
}

<Collection collection={collection}
            collectionTemplates={collectionTemplates}
            storyTemplates={storyTemplates}
            interstitial={interstitial} />
```

### AdbutlerAds
This component can be used to get ads from `Adbutler` ad service provider based on the `adtype` you want to show

```javascript
import { AdbutlerAd } from '@quintype/components';

// Lists publisher id and the respective mapping of the zone ids
const adbutlerConfig = {
  publisherId: "175635",
  "Horizontal-Ad": "353618",
  "Vertical-Ad": "353620"
};

// Lists sizes of respective ads
const sizes = {
  "Horizontal-Ad": {
    mobile: [320, 50],  // [<width>, <height>]
    tablet: [728, 90],
    desktop: [728, 90]
  },
  "Vertical-Ad": {
    mobile: [300, 250],
    tablet: [300, 600],
    desktop: [300, 600]
  }
};

<AdbutlerAd adtype="Story-Middle-Ad" adbutlerConfig={adbutlerConfig} sizes={sizes} />
```

### HamburgerButton
This component can be used to trigger an action openening the Hamburger menu. The state can be accessed via state.hamburgerOpened

```javascript
import { HamburgerButton } from '@quintype/components';
<HamburgerButton>
  <img src="/path/to/hamburger.png"/>
</HamburgerButton>
```

### ImageGalleryElement
This component can be used for adding image gallery on the story page. You can pass in props like ```className, imageAspectRatio, defaultWidth, element``` and ```widths```

``` javascript
import { ImageGalleryElement } from "@quintype/components";

<ImageGalleryElement element={element} key={element.id} imageAspectRatio={[4,3]} />
```

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
### LazyCollection

This component can be used to render a collection, but with the components being lazy. This takes all the same options as Collection, but with a `lazyAfter` prop.
This Component also accepts extra props, which will be passed down to collection templates.

Note: This does not accept `interstitial` items (yet). And home page items are not hidden after being rendered

```javascript
import { LazyCollection } from '@quintype/components'

// collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})

<LazyCollection collection={collection}
                collectionTemplates={collectionTemplates}
                storyTemplates={storyTemplates}
                lazyAfter={3}
                extraProp="some prop" />

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

### Link
This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)

```javascript
import { Link } from '@quintype/components';
<Link href="/section/story-slug" otherLinkAttribute="value">Text here</Link>
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

This component is very similar to the LoadMoreBase component but fetches the stroies from a `collection`. The api call `/api/v1/collections/{collectionSlug}` is made with the passed collection slug value. The component accepts the `params` prop and a requires a Collection Slug from which to fetch the stories and returns a set of stories only.

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

### LoadingIndicator
This component renders it's children when the app is moving between pages. It can be used to show a spinner. It always has the class "loading-indicator", and also "loading-indicator-loading" when loading.

```javascript
import { LoadingIndicator } from '@quintype/components';

<LoadingIndicator>
  <div className="spinner">Please Wait</div>
</LoadingIndicator>
```

### Menu
This component can be used to render a menu from the menuItems in the editor. An extra class called active is applied if the menu item is the current url. By default, links will resolve via AJAX.

Items will automatically be pulled from `config`, please remember to expose the `layout` key.

Children are prepended to the list of items. Slice can be passed to extract a set of menu items.

```javascript
import { Menu } from '@quintype/components';

<Menu className="menu-class" itemClassName="item-class" slice={[0, 10]}>
  <li>
    <a className="item-class" href="/"> होम </a>
  </li>
</Menu>
```

### NavigationComponentBase

This is a base component which *must* be subclassed, providing a navigateTo function.

```javascript
import { NavigationComponentBase }from '@quintype/components';

class SearchComponent extends NavigationComponentBase {
  render() { return <a href="#" onClick={() => this.navigateTo("/some-page-here")}>Link</a>}
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

### SearchPageBase
This component is to handle search functionality and also handles load more.

A template must be passed in to render search results. Fields can be passed to get specific fields in the results. The contents of `props.data` are passed to the rendered template.

```javascript
import { SearchPageBase } from "@quintype/components";

function SearchPageView({query, stories, onLoadMore, loading, noMoreStories}) {
  return <div />;
}

<SearchPageBase template={SearchPageView} fields={"id,headline"} {...props}/>
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
