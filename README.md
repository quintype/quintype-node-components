# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

### BreakingNews
This component will automatically fetch breaking news every 30 seconds, and render the provided view.

```javascript
import { renderBreakingNews } from '@quintype/framework/client/start';
const BreakingNewsView = (props) => <ul>{props.breakingNews.map((item, index) => <li key={index}><BreakingNewsItem item={item} /></li>)}</ul>
renderBreakingNews('breaking-news-container', store, BreakingNewsView);
```

### BreakingNewsItem

This component can be used to render a BreakingNewsItem.

```javascript
import {BreakingNewsItem} from '@quintype/components'

<BreakingNewsItem item={item} className="breaking-news__headline"/>
```

### ClientSideOnly
This component will be loaded by client, and bypassed when doing server side rendering.

```javascript
import { ClientSideOnly } from '@quintype/components';
<ClientSideOnly>
  This will be shown only on the client side
</ClientSideOnly>
```

### DfpAds
This is a higher order component which can be used to manage ad units in a single place. A component must be created, and used with the `adtype` parameter

```javascript
import { createDfpAdComponent } from '@quintype/components';

export const CONFIG = {
  "homepage-2": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
  "homepage-3": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
}

export const DfpAd = createDfpAdComponent({
  defaultNetworkID: "123456789",
  config: CONFIG,
  targeting: function(state) {
    const params = {};

    // if(storyIsSponsored) params['sponsor'] = storySponsor

    return params;
  }
});

<DfpAd adtype="homepage-2" />
```

### HamburgerButton
This component can be used to trigger an action openening the Hamburger menu. The state can be accessed via state.hamburgerOpened

```javascript
import { HamburgerButton } from '@quintype/components';
<HamburgerButton>
  <img src="/path/to/hamburger.png"/>
</HamburgerButton>
```

### InfiniteScroll

This component can be used to implement InfiniteScroll. This is an internal component.

### InfiniteStoryBase

This component can be used to implement InfiniteScroll on the story page. You will need to specify the function which renders the story (which will recieve props.index and props.story), and functions for triggering analytics.

```javascript
const React = require("react");

import { BlankStory } = requirfrom '@quintype/components';
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

### Link
This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)

```javascript
import { Link } from '@quintype/components';
<Link href="/section/story-slug" otherLinkAttribute="value">Text here</Link>
```

### LoadMoreBase

This component starts with a set of stories, and then provides a load more button. This calls out to `/api/v1/stories` with the properties passed via the `params` prop. The stories are concatenated with the stories in `props.data.stories`, and the contents of `props.data` are passed to the rendered template.

```javascript
import { LoadMoreStoriesBase } from '@quintype/components';

function SectionPageWithStories({section, stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function SectionPage(props) {
  return <LoadMoreStoriesBase template={SectionPageWithStories}
                              fields={"id,headline"}
                              {...props}
                              params={{"section-id": props.data.section.id}}/>
}
```

### LoadMoreCollectionStories

This component is very similar to the LoadMoreBase component but fetches the stroies from a `collection`. The api call `/api/v1/collections/{collectionSlug}` is made with the passed collection slug value. The component accepts the `params` prop and a requires a Collection Slug from which to fetch the stories and returns a set of stories only.

```javascript
import { LoadMoreCollectionStories } from '@quintype/components';

function MoreCollectionStories({stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function HomePage(props) {
  return <LoadMoreCollectionStories template={MoreCollectionStories}
                                    collectionSlug={props.data.collectionSLug}
                                    {...props}
                                    params={{"collectionSlug": props.data.collectionSlug}}/>
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

### ResponsiveImage
This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.

```javascript
import { ResponsiveImage } from '@quintype/components';
<figure className="story-grid-item-image qt-image-16x9">
  <ResponsiveImage slug={props.story["hero-image-s3-key"]} metadata={props.story["hero-image-metadata"]}
    aspectRatio={[16,9]}
    defaultWidth={480} widths={[250,480,640]} sizes="(max-width: 500px) 98%, (max-width: 768px) 48%, 23%"
    imgParams={{auto:['format', 'compress']}}/>
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

### Search box
This component provides a form with a search text box. On submit, the user is redirected to the search page via AJAX.

A template function can also be passed in, to do custom rendering. The template prop will be called with childen having the child text box. See [madrid](https://github.com/quintype/madrid/blob/master/app/isomorphic/components/basic/search.js) as an example

```javascript
import { SearchBox } from '@quintype/components';

<SearchBox className="foobar" placeholder="search" inputClassName="foobar-box" inputId="stg" inputRef={(x) => this.foo = x} onEscape={() => this.closeDialog()}/>
```

### SocialShare
This component renders social share component to front end app.

```javascript
import { SocialShare } from '@quintype/components';

class CustomComponent extends React.Component {

  getSocialCardsTemplate({fbUrl, twitterUrl, gplusUrl, linkedinUrl}) {
    return <ul className="social-share-icons">
        <li className="social-share-icon">
          <a href={fbUrl} target="_blank">
            <img src={fbIcon} alt="fb icon"/>
          </a>
        </li>
      </ul>
  }

  render() {
    return <div className="story-byline__social-share">
              <SocialShare url={storyShareSlug}
                title='Headline of the story'
                template={this.getSocialCardsTemplate}
                hashtags='news,india,press' />
           </div>
  }
}
```

### StoryElement
This component renders different types of story elements

```javascript
import { StoryElement } from '@quintype/components';
function StoryCard(props){
  return <div>
    {props.card['story-elements'].map((element, index) => <StoryElement element={element} key={index} story={props.story}></StoryElement>)}
  </div>
}
```

### WithError
This function can be used to generate a wrapper component that implements `componentDidCatch()`.

```javascript

import { withError } from '@quintype/components';

function optionalErrorFn(props) {
  return <span />;
}

const MyStoryElement = withError(ClassThatMayCrash, optionalErrorFn)
```

## Recommended Components that are not included

### Sliders

For a slider, we recomment `react-slick`. It pulls in JQuery, which will add 90kb to your bundle, but is the most malleable slider out there

### Marquee for Breaking News

Our Marquee recommendation is `react-malarquee`. Just remember to mark all items as `display: inline`, and remove any floats. It supports `pauseOnHover`.
