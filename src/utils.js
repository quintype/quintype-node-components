// FIXME: TEST THIS
import get from "lodash/get";

export function removeDuplicateStories(existingStories, newStories, keyFn = story => story.id) {
  const existingStoryIds = existingStories.map(keyFn);
  return newStories.filter(story => !existingStoryIds.includes(keyFn(story)));
}

export function getAssociatedTemplate({"associated-metadata": associatedMetadata}) {
  return associatedMetadata ? associatedMetadata.layout : 'default';
}

// FIXME: TEST THIS
export function replaceAllStoriesInCollection(collection, story) {
  const items = (collection.items || []).map(item => {
    if (item.type === "story") {
      return {id: story.id, type: "story", story};
    } else if (item.type === "collection") {
      return replaceAllStoriesInCollection(item, story);
    }
    return item;
  });

  return Object.assign({}, collection, {items});
}

//Helps handle errors with async await pattern

export const awaitHelper = promise => (
    promise
        .then(data => ({ data, error: null }))
        .catch(error => ({ error, data: null }))
);


export const getQliticsSchema = function(story = {}, card = {}, element = {}) {
  Array.from(arguments).forEach(ele => {
    (Object.keys(ele).length < 1) && console.warn(`Required attribute missing for qlitics --> ${ele}`);
  }); //Display warning to make debugging easier

  return ({
    'story-content-id': story['story-content-id'],
    'story-version-id': story['story-version-id'],
    'card-content-id': card['content-id'],
    'card-version-id': card['content-version-id'],
    'story-element-id': element.id,
    'story-element-type': element.subtype || element.type
  });
};


export const computeAccess = (previousState, currentState) => {
  const currentAccess = get(currentState, ["access"], {});
  const currentStoryId = get(Object.keys(currentAccess), [0], "");
  if(currentStoryId in previousState){
    const storyAccess = previousState[currentStoryId];
    if(storyAccess.granted !== currentAccess[currentStoryId].granted || storyAccess.grantReason !== currentAccess[currentStoryId].grantReason){
      return {...previousState, ...currentAccess};
    }
    return previousState;
  }
  return {...previousState, ...currentAccess};
};
