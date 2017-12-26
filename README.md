# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

### BreakingNews
This component will automatically fetch breaking news every 30 seconds, and render the provided view.

```javascript
import { renderBreakingNews } from '@quintype/framework/client/start';
const BreakingNewsView = (props) => <ul>{props.breakingNews.map((news) => <li key={news.id}>{news.headline}</li>)}</ul>
renderBreakingNews('breaking-news-container', store, BreakingNewsView);
```

### ClientSideOnly
This component will be loaded by client, and bypassed when doing server side rendering.

```javascript
const { ClientSideOnly } = require("@quintype/components");
<ClientSideOnly>
  This will be shown only on the client side
</ClientSideOnly>
```

### HamburgerButton
This component can be used to trigger an action openening the Hamburger menu. The state can be accessed via state.hamburgerOpened

```javascript
const { HamburgerButton } = require("@quintype/components");
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

const { BlankStory } = require("../story-templates/blank.jsx");
const { InfiniteStoryBase } = require("@quintype/components");

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
const { Link } = require("@quintype/components");
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

### LoadingIndicator
This component renders it's children when the app is moving between pages. It can be used to show a spinner. It always has the class "loading-indicator", and also "loading-indicator-loading" when loading.

```javascript
const { LoadingIndicator } = require("@quintype/components");

<LoadingIndicator>
  <div className="spinner">Please Wait</div>
</LoadingIndicator>
```

### Menu
This component can be used to render a menu from the menuItems in the editor. An extra class called active is applied if the menu item is the current url. By default, links will resolve via AJAX.

Items will automatically be pulled from `config`, please remember to expose the `layout` key.

Children are prepended to the list of items. Slice can be passed to extract a set of menu items.

```javascript
const { Menu } = require("@quintype/components");

<Menu className="menu-class" itemClassName="item-class" slice={[0, 10]}>
  <li>
    <a className="item-class" href="/"> होम </a>
  </li>
</Menu>
```

### NavigationComponentBase

This is a base component which *must* be subclassed, providing a navigateTo function.

```javascript
const { NavigationComponentBase } = require("quintype/components");

class SearchComponent extends NavigationComponentBase {
  render() { return <a href="#" onClick={() => this.navigateTo("/some-page-here")}>Link</a>}
}
```

### ResponsiveImage
This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.

```javascript
const { ResponsiveImage } = require("@quintype/components");
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
const { SearchBox } = require("@quintype/components");

<SearchBox className="foobar" placeholder="search" inputClassName="foobar-box" inputId="stg" inputRef={(x) => this.foo = x} onEscape={() => this.closeDialog()}/>
```

### SocialShare
This component renders social share component to front end app.

```javascript
const { SocialShare } = require("@quintype/components");

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
const { StoryElement } = require("@quintype/components");
function StoryCard(props){
  return <div>
    {props.card['story-elements'].map((element, index) => <StoryElement element={element} key={index} story={props.story}></StoryElement>)}
  </div>
}
```
