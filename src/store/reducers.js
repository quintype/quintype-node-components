/**
 * @module Reducers
 */
import {
  BREAKING_NEWS_UPDATED,
  CLIENT_SIDE_RENDERED,
  PAGE_LOADING,
  NAVIGATE_TO_PAGE,
  PAGE_FINISHED_LOADING,
  HAMBURGER_CLICKED,
  HAMBURGER_CLOSED,
  MEMBER_UPDATED,
  MEMBER_BEING_LOADED,
  SUBSCRIPTION_GROUP_UPDATED,
  PAYMENT_OPTIONS_UPDATED,
  ACCESS_BEING_LOADED,
  ACCESS_UPDATED,
  METER_UPDATED,
  ASSET_PLANS
} from "./actions";
import { computeAccess } from "../utils";

function setToTrueOnEvent() {
  const events = Array.from(arguments);
  return function(state = false, action) {
    return state || events.includes(action.type);
  };
}

function breakingNewsReducer(state = [], action) {
  switch (action.type) {
    case BREAKING_NEWS_UPDATED:
      return action.stories;
    default:
      return state;
  }
}

const breakingNewsLoadedReducer = setToTrueOnEvent(BREAKING_NEWS_UPDATED);
const clientSideRenderedReducer = setToTrueOnEvent(CLIENT_SIDE_RENDERED);

function pageLoadingReducer(state = false, action) {
  switch (action.type) {
    case PAGE_LOADING:
      return true;
    case NAVIGATE_TO_PAGE:
      return false;
    case PAGE_FINISHED_LOADING:
      return false;
    default:
      return state;
  }
}

function hamburgerOpenedReducer(state = false, action) {
  switch (action.type) {
    case HAMBURGER_CLICKED:
      return true;
    case HAMBURGER_CLOSED:
      return false;
    case NAVIGATE_TO_PAGE:
      return false;
    default:
      return state;
  }
}

function memberReducer(state = null, action) {
  switch (action.type) {
    case MEMBER_UPDATED:
      return action.member;
    default:
      return state;
  }
}

function memberLoadingReducer(state = true, action) {
  switch (action.type) {
    case MEMBER_BEING_LOADED:
      return true;
    case MEMBER_UPDATED:
      return false;
    default:
      return state;
  }
}

function subscriptionReducer(state = [], action) {
  switch (action.type) {
    case SUBSCRIPTION_GROUP_UPDATED:
      return action.subscriptions;
    default:
      return state;
  }
}

function paymentOptionsReducer(state = {}, action) {
  switch (action.type) {
    case PAYMENT_OPTIONS_UPDATED:
      return action.paymentOptions;
    default:
      return state;
  }
}

function accessLoadingReducer(state = true, action) {
  switch (action.type) {
    case ACCESS_BEING_LOADED:
      return action.loading;
    default:
      return state;
  }
}

function accessReducer(state = {}, action) {
  switch (action.type) {
    case ACCESS_UPDATED:
      return computeAccess(state, action);
    default:
      return state;
  }
}

function meteringReducer(state = -1, action) {
  switch (action.type) {
    case METER_UPDATED:
      return action.meterCount;
    default:
      return state;
  }
}

function assetPlansReducer(state = null, action) {
  switch (action.type) {
    case ASSET_PLANS:
      return action.assetPlans;
    default:
      return state;
  }
}

/**
 * ComponentReducers is a list of reducers that are needed by the various components included
 */
export const ComponentReducers = {
  breakingNews: breakingNewsReducer,
  breakingNewsLoaded: breakingNewsLoadedReducer,
  clientSideRendered: clientSideRenderedReducer,
  pageLoading: pageLoadingReducer,
  hamburgerOpened: hamburgerOpenedReducer,
  member: memberReducer,
  memberLoading: memberLoadingReducer,
  subscriptions: subscriptionReducer,
  paymentOptions: paymentOptionsReducer,
  accessLoading: accessLoadingReducer,
  access: accessReducer,
  meteringCount: meteringReducer,
  assetPlans: assetPlansReducer
};
