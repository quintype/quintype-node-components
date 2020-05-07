import React from "react";
import { connect, batch } from "react-redux";
import get from "lodash/get";
import {
  ACCESS_BEING_LOADED,
  ACCESS_UPDATED,
  PAYMENT_OPTIONS_UPDATED,
  SUBSCRIPTION_GROUP_UPDATED,
  METER_UPDATED,
  ASSET_PLANS,
  CAMPAIGN_SUBSCRIPTION_GROUP_UPDATED
} from "../store/actions";
import PropTypes from "prop-types";
import { awaitHelper } from "../utils";

const prod_Host = "https://www.accesstype.com";
const staging_Host = "https://staging.accesstype.com";

class AccessTypeBase extends React.Component {
  componentDidMount() {
    this.initAccessType();
  }

  loadScript = callback => {
    const accessTypeKey = get(this.props, ["accessTypeKey"]);
    const isStaging = get(this.props, ["isStaging"]);
    const enableAccesstype = get(this.props, ["enableAccesstype"]);

    if (!enableAccesstype) {
      return false;
    }

    if (accessTypeKey && !global.AccessType && global.document) {
      const accessTypeScript = document.createElement("script");
      const HOST = isStaging ? staging_Host : prod_Host;
      const environment = isStaging ? "&env=sandbox" : "";

      const accessTypeHost = `${HOST}/frontend/v2/accesstype.js?key=${accessTypeKey}${environment}`;

      accessTypeScript.setAttribute("src", accessTypeHost);
      accessTypeScript.setAttribute("data-accessType-script", "1");
      accessTypeScript.async = 1;
      accessTypeScript.onload = () => callback();
      document.body.appendChild(accessTypeScript);
      return true;
    }

    global.AccessType && callback();
    return true;
  };

  setUser = async (emailAddress, mobileNumber, accesstypeJwt) => {
    if (!global.AccessType) {
      return {};
    }

    const { error, data: user } = await awaitHelper(
      global.AccessType.setUser({
        emailAddress: emailAddress,
        mobileNumber: mobileNumber,
        accesstypeJwt: accesstypeJwt
      })
    );
    if (error) {
      console.warn(`User context setting failed --> `, error);
      return error;
    }
    return user;
  };

  validateCoupon = async (selectedPlanId, couponCode) => {
    if (!global.AccessType) {
      return {};
    }

    const { error, data } = await awaitHelper(
      global.AccessType.validateCoupon({
        subscriptionPlanId: selectedPlanId,
        couponCode
      })
    );
    if (error) {
      console.warn(`Error --> `, error);
      return error;
    }
    return data;
  };

  getSubscription = async () => {
    const accessTypeKey = get(this.props, ["accessTypeKey"]);
    const isStaging = get(this.props, ["isStaging"]);
    const HOST = isStaging ? staging_Host : prod_Host;

    // TODO: use AccesstypeJS method insead of direct api call
    const accessTypeHost = `${HOST}/api/v1/subscription_groups.json?key=${accessTypeKey}`;

    const { error, data: subscriptions } = await awaitHelper(
      (await global.fetch(accessTypeHost)).json()
    );
    if (error) {
      return {
        error: "subscriptions fetch failed"
      };
    }
    return subscriptions["subscription_groups"] || [];
  };

  getPaymentOptions = async () => {
    if (!global.AccessType) {
      return [];
    }
    const { error, data: paymentOptions } = await awaitHelper(
      global.AccessType.getPaymentOptions()
    );
    if (error) {
      return {
        error: "payment options fetch failed"
      };
    }
    return paymentOptions;
  };

  getAssetPlans = async (storyId = "") => {
    if (!global.AccessType) {
      return [];
    }
    const { error, data: assetPlans = {} } = await awaitHelper(
      global.AccessType.getAssetPlans({ id: storyId, type: "story" })
    );
    if (error) {
      return {
        error: "asset plan fetch failed"
      };
    }

    return assetPlans;
  };

  getCampaignSubscription = async () => {
    const isAccessTypeCampaignEnabled = get(this.props, ["isAccessTypeCampaignEnabled"], false);
    if(isAccessTypeCampaignEnabled) {
      const accessTypeKey = get(this.props, ["accessTypeKey"]);
      const isStaging = get(this.props, ["isStaging"]);
      const HOST = isStaging ? staging_Host : prod_Host;

      const accessTypeHost = `${HOST}/api/v1/campaigns.json?key=${accessTypeKey}`;

      const { error, data: campaignSubscriptions } = await awaitHelper(
        (await global.fetch(accessTypeHost)).json()
      );

      if (error) {
        return {
          error: "subscriptions fetch failed"
        };
      }
      return campaignSubscriptions["subscription_groups"] || [];
    }
    return [];
  }

  runSequentialCalls = async (storyId = "") => {
    let jwtResponse = await fetch(`/api/v1/access-token/integrations/${this.props.accessTypeBkIntegrationId}`);
    const user = await this.setUser(this.props.email, this.props.phone, jwtResponse.headers.get('x-integration-token'));

    if (user) {
      try {
        Promise.all([
          this.getSubscription(),
          this.getPaymentOptions(),
          this.getAssetPlans(storyId),
          this.getCampaignSubscription()
        ]).then(([subscriptionGroups, paymentOptions, assetPlans, campaignSubscriptionGroups]) => {
          batch(() => {
            this.props.subscriptionGroupLoaded(subscriptionGroups);
            this.props.paymentOptionsLoaded(paymentOptions);
            this.props.assetPlanLoaded(assetPlans);
            this.props.campaignSubscriptionGroupLoaded(campaignSubscriptionGroups)
          });
        });
      } catch (e) {
        console.log(`Subscription / payments failed`, e);
      }
    }
  };

  getSubscriptionForUser = async () => {
    if (!global.AccessType) {
      return {};
    }

    const { error, data: subscriptions = [] } = await awaitHelper(
      global.AccessType.getSubscriptions()
    );
    if (error) {
      return error;
    }
    return subscriptions;
  };

  initAccessType = () => {
    try {
      this.loadScript(() => this.runSequentialCalls());
    } catch (e) {
      console.warn(`Accesstype load fail`, e);
    }
  };

  makePaymentObject({
    selectedPlan = {},
    couponCode = "",
    recipientSubscriber = {},
    planType = "",
    storyId = "",
    storyHeadline = "",
    storySlug = "",
    paymentType = "",
    successUrl = "",
    returnUrl = "",
    cancelUrl = ""
  }) {
    const {
      id,
      title,
      description,
      price_cents: price_cents,
      price_currency: price_currency,
      duration_length: duration_length,
      duration_unit: duration_unit
    } = selectedPlan;
    const paymentObject = {
      type: planType,
      plan: {
        id,
        title,
        description,
        price_cents: price_cents,
        price_currency: price_currency,
        duration_length: duration_length,
        duration_unit: duration_unit
      },
      coupon_code: couponCode,
      payment: {
        payment_type: paymentType,
        amount_cents: price_cents,
        amount_currency: price_currency
      },
      assets: [
        {
          id: storyId,
          title: storyHeadline,
          slug: storySlug
        }
      ],
      recipient_subscriber: recipientSubscriber //for gift subscription
    };
    if ((successUrl || returnUrl)&& cancelUrl) {
      paymentObject.options = {};

      paymentObject.options.urls = {
        cancel_url: cancelUrl
      };
      paymentObject.options.urls = returnUrl ? {return_url:returnUrl} : {success_url:successUrl}
    }
    return paymentObject;
  }
makePlanObject(selectedPlanObj = {}, planType = "", storyId = "", storyHeadline = "", storySlug = "") {
  return selectedPlanObj.argType && selectedPlanObj.argType === "options" ? {
    selectedPlan: selectedPlanObj.selectedPlan,
    planType: selectedPlanObj.planType,
    storyId: selectedPlanObj.storyId,
    storyHeadline: selectedPlanObj.storyHeadline,
    storySlug: selectedPlanObj.storySlug,
    couponCode: selectedPlanObj.couponCode,
    recipientSubscriber: selectedPlanObj.recipientSubscriber
  } : {
    selectedPlan: selectedPlanObj,
    planType,
    storyId,
    storyHeadline,
    storySlug
  }
}
//TODO -> need to write test cases to cover all scenarios , selectedPlan, planType , coupon, urls, story details etc.
  initRazorPayPayment = (selectedPlanObj = {}, planType = "", storyId = "", storyHeadline = "", storySlug = "") => {
    if (!selectedPlanObj) {
      console.warn("Razor pay needs a plan");
      return false;
    }

    const planObject = this.makePlanObject(selectedPlanObj, planType, storyId, storyHeadline, storySlug) //we are doing this to sake of backward compatibility and will be refactored later.
    const { paymentOptions } = this.props;
    planObject["paymentType"] = get(planObject.selectedPlan, ["recurring"]) ? "razorpay_recurring" : "razorpay";
    const paymentObject = this.makePaymentObject(planObject);
    return paymentOptions.razorpay.proceed(paymentObject);
  };

  //TODO -> need to write test cases to cover all scenarios , selectedPlan, planType , coupon, urls, story details etc.
  initStripePayment = (options =  {}) => { 
    if (!options.selectedPlan) {
      console.warn("Stripe pay needs a plan");
      return false;
    }

    const { paymentOptions } = this.props;
    const paymentType = get(options.selectedPlan, ["recurring"]) ? "stripe_recurring" : "stripe";
    const paymentObject = this.makePaymentObject({ paymentType , ...options});
    return paymentOptions.stripe ? paymentOptions.stripe.proceed(paymentObject) : Promise.reject({message:"Payment option is loading..."})
  };

  pingBackMeteredStory = async (asset, accessData) => {
    const stringData = JSON.stringify(accessData);

    if (global.navigator && global.navigator.sendBeacon) {
      global.navigator.sendBeacon(
        `/api/access/v1/stories/${asset.id}/pingback`,
        stringData
      );
      return true;
    }

    const meteredBody = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: stringData
    };
    const {data, error} = await awaitHelper(global.AccessType.pingbackAssetAccess(asset, accessData));
    return true;
  };

  checkAccess = async assetId => {
    if (!assetId) {
      console.warn("AssetId is required");
      return false;
    }

    this.props.accessIsLoading(true);

    const asset = {id: assetId, type: 'story'};
    const { error, data: accessData }  = await awaitHelper(global.AccessType.isAssetAccessible(asset, this.props.disableMetering));

    const accessById = { [assetId]: accessData };

    this.props.accessUpdated(accessById);
    this.props.accessIsLoading(false);

    const { granted, grantReason, data = {} } = accessData;
    if(!this.props.disableMetering && granted && grantReason === "METERING") {
        this.pingBackMeteredStory(asset, accessData);
        this.props.meterUpdated(data.numberRemaining || -1);
    }

    if (error) {
      return error;
    }
    return accessById;
  };

  render() {
    const { children } = this.props;

    return children({
      initAccessType: this.initAccessType,
      initRazorPayPayment: this.initRazorPayPayment,
      initStripePayment: this.initStripePayment,
      checkAccess: this.checkAccess,
      getSubscriptionForUser: this.getSubscriptionForUser,
      accessUpdated: this.props.accessUpdated,
      accessIsLoading: this.props.accessIsLoading,
      getAssetPlans: this.props.getAssetPlans,
      validateCoupon: this.validateCoupon
    });
  }
}

AccessTypeBase.propTypes = {
  children: PropTypes.func.isRequired,
  email: PropTypes.string,
  phone: PropTypes.number,
  isStaging: PropTypes.bool,
  enableAccesstype: PropTypes.bool.isRequired,
  accessTypeKey: PropTypes.string.isRequired,
  accessTypeBkIntegrationId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  subscriptions: state.subscriptions || null,
  paymentOptions: state.paymentOptions || null,
  assetPlans: state.assetPlans || null
});

const mapDispatchToProps = dispatch => ({
  subscriptionGroupLoaded: subscriptions =>
    dispatch({ type: SUBSCRIPTION_GROUP_UPDATED, subscriptions }),
  paymentOptionsLoaded: paymentOptions =>
    dispatch({ type: PAYMENT_OPTIONS_UPDATED, paymentOptions }),
  accessIsLoading: loading => dispatch({ type: ACCESS_BEING_LOADED, loading }),
  accessUpdated: access => dispatch({ type: ACCESS_UPDATED, access }),
  meterUpdated: meterCount => dispatch({ type: METER_UPDATED, meterCount }),
  assetPlanLoaded: assetPlans => dispatch({ type: ASSET_PLANS, assetPlans }),
  campaignSubscriptionGroupLoaded: campaignSubscriptions =>
    dispatch({ type: CAMPAIGN_SUBSCRIPTION_GROUP_UPDATED, campaignSubscriptions })
});

/**
 * `AccessType` is a generic connected render prop which exposes methods to handle access to stories / assets and initialize accesstype js
 *
 *   Name | arguments | Description
 *  --- | --- | ---
 *  `initAccessType`| -NA- | Initializes accesstype, checks for existance of accesstype before requesting for AT js
 *  `initRazorPayPayment`| `selectedPlan`(object) | Executes accesstype js method to bring forth RP payment gateway
 *  `checkAccess`| `assetId`(string) | Checks if the user has access to the story/asset id passed
 *  `getSubscriptionForUser`| -NA- | Gets the subscriptions of the current logged in user
 *  `accessUpdated`| `accessObject`(object) | Sets the current story access to redux store
 *  `accessIsLoading`| `loading`(boolean) | A boolean which holds true between the request for access of a story and its response
 *
 * ###### Notes :
 *
 * * This component uses AccessType Js internally
 * * It uses the Access API from subtype for metering, the API works on firebase which uses `thinmint` cookie (set by qlitics) of the user to verify and keep track of visits
 * * This component only supports Razorpay payment options for now
 * * It communicates to sketches where routes are in pattern `/api/access/v1/*`
 * * Metered story has a pingback which is achieved by the use of `navigator.sendBeacon` if available or falls back to fetch, this is needed to update the count of the visited stories for a user
 * * Access to story/asset is saved on the redux store under the keyword access which holds keys as story asset id and the access returned from the API as its value
 * * `subscriptions` is the key in the store under which all the subscription groups created for the specified account are maintained
 * * `paymentOptions` is the key under the store which has all the payment options created for the current AT account
 * * `selectedPlan` used by `initRazorPayPayment` refers to one of the plan object nested within the subscription groups
 *
 * ```javascript
 * //access object on store
 *
 * access : {
 *   'c1f6c0d7-2829-4d31-b673-58728f944f82': {
 *         'data': {
 *           'isLoggedIn':true,
 *           'granted': false
 *           'grantReason': "SUBSCRIBER"
 *         }
 *     }
 * }
 * ```
 *
 * Example
 * ```javascript
 * import { AccessType } from "@quintype/components";
 *
 *
 * render() {
 *   return  <AccessType
 *                  enableAccesstype={enableAccesstype}
 *                  isStaging={isStaging}
 *                  accessTypeKey={accessTypeKey}
 *                  email={email}
 *                  phone={phone}
 *                  disableMetering={disableMetering}
 *                >
 *                  {({ initAccessType, checkAccess, accessUpdated, accessIsLoading }) => (
 *                    <div>
 *                      <StoryComponent
 *                        accessIsLoading={accessIsLoading}
 *                        accessUpdated={accessUpdated}
 *                        initAccessType={initAccessType}
 *                        checkAccess={checkAccess}
 *                        {...this.props}
 *                      />
 *                    </div>
 *                  )}
 *                </AccessType>
 * }
 *
 * ```
 * @component
 * @category Subscription
 */
export const AccessType = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccessTypeBase);
