import React, {Component} from 'react';
import {connect, batch} from 'react-redux';
import get from "lodash/get";
import {
    ACCESS_BEING_LOADED,
    ACCESS_UPDATED,
    PAYMENT_OPTIONS_UPDATED,
    SUBSCRIPTION_GROUP_UPDATED,
    METER_UPDATED
} from "../store/actions";
import PropTypes from "prop-types";
import {awaitHelper} from "../utils";


class AccessTypeBase extends Component {

    componentDidMount() {
        this.initAccessType();
    }

    loadScript = callback => {
        const accessTypeKey = get(this.props, ['accessTypeKey']);
        const isStaging = get(this.props, ['isStaging']);
        const enableAccesstype = get(this.props, ['enableAccesstype']);

        if(!enableAccesstype){
            return false;
        }

        if(accessTypeKey && !global.AccessType && global.document) {
            const accessTypeScript = document.createElement('script');
            let accessTypeHost = `https://www.accesstype.com/frontend/accesstype.js?key=${accessTypeKey}`;
            if(isStaging){
                accessTypeHost = `https://staging.accesstype.com/frontend/accesstype.js?key=${accessTypeKey}&env=sandbox`;
            }
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

    setUser = async (emailAddress, mobileNumber) => {
        if(!global.AccessType){
            return {};
        }

        const { error, data: user }  = await awaitHelper(global.AccessType.setUser({ 'emailAddress': emailAddress, 'mobileNumber':  mobileNumber}));
        if(error) {
            console.warn(`User context setting failed --> `, error);
            return error;
        }
        return user;
    };

    getSubscription = async () => {
        const accessTypeKey = get(this.props, ['accessTypeKey']);
        const isStaging = get(this.props, ['isStaging']);
        let accessTypeHost = `https://www.accesstype.com/api/v1/subscription_groups.json?key=${accessTypeKey}`;
        if(isStaging){
            accessTypeHost = `https://staging.accesstype.com/api/v1/subscription_groups.json?key=${accessTypeKey}`;
        }
        const { error, data: subscriptions }  = await awaitHelper((await global.fetch(accessTypeHost)).json());
        if(error) {
            return {
                error: 'subscriptions fetch failed'
            };
        }
        return subscriptions["subscription_groups"] || [];
    };

    getPaymentOptions= async () => {
        if(!global.AccessType){
            return [];
        }
        const { error, data: paymentOptions }  = await awaitHelper(global.AccessType.getPaymentOptions());
        if(error) {
            return {
                error: 'payment options fetch failed'
            };
        }
        return paymentOptions;
    };

    runSequentialCalls = async () => {
        const user = await this.setUser(this.props.email, this.props.phone);
        if(user) {
            try{
                Promise.all([this.getSubscription(), this.getPaymentOptions()]).then(([subscriptionGroups, paymentOptions]) => {
                    batch(() => {
                        this.props.subscriptionGroupLoaded(subscriptionGroups);
                        this.props.paymentOptionsLoaded(paymentOptions);
                    })
                })
            }catch (e) {
                console.log(`Subscription / payments failed`, e);
            }

        }
    };

    getSubscriptionForUser = async () => {
        if(!global.AccessType){
            return {};
        }

        const { error, data: subscriptions = []}  = await awaitHelper(global.AccessType.getSubscriptions());
        if(error){
            return error;
        }
        return subscriptions;
    };

    initAccessType = () => {
        try {
            this.loadScript(() => this.runSequentialCalls());
        }
        catch (e) {
            console.warn(`Accesstype load fail`, e);
        }
    };


    initRazorPayPayment = selectedPlan => {
        if(!selectedPlan){
            console.warn('Razor pay needs a plan');
            return false;
        }

        const {paymentOptions} = this.props;
        const {id, title, description, 'price_cents': priceCents, 'price_currency': priceCurrency, 'duration_length': durationLength, 'duration_unit': durationUnit } = selectedPlan;
        const paymentType = get(selectedPlan, ["recurring"]) ? "razorpay_recurring" : "razorpay";
        const paymentObject = {
            type: 'standard',
            plan: {id, title, description, price_cents: priceCents, price_currency: priceCurrency, duration_length: durationLength, duration_unit: durationUnit},
            payment: {payment_type: paymentType, amount_cents: priceCents, amount_currency: priceCurrency},
        };
        return paymentOptions.razorpay.proceed(paymentObject);
    };

    pingBackMeteredStory = async (assetId, accessData) => {
        const stringData = JSON.stringify(accessData);

        if(global.navigator && global.navigator.sendBeacon){
            global.navigator.sendBeacon(`/api/access/v1/stories/${assetId}/pingback`, stringData);
            return true;
        }

        const meteredBody = {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: stringData
        };
        const {data, error} = await awaitHelper((await global.fetch(`/api/access/v1/stories/${assetId}/pingback`, meteredBody)).json());
        return true;
    };

    checkAccess = async assetId => {
        if(!assetId){
            console.warn('AssetId is required');
            return false;
        }

        this.props.accessIsLoading(true);

        const meteringParam = this.props.disableMetering === true ? '?disable-meter=true' : '';
        const { error, data: accessData }  = await awaitHelper((await global.fetch(`/api/access/v1/stories/${assetId}/access${meteringParam}`)).json());

        const accessById =  {[assetId] : accessData};

        this.props.accessUpdated(accessById);
        this.props.accessIsLoading(false);

        const {granted, grantReason, data = {}} = accessData;
        if(!meteringParam && granted && grantReason === "METERING"){
            this.pingBackMeteredStory(assetId, {granted, grantReason});
            this.props.meterUpdated(data.numberRemaining || -1);
        }

        if(error){
            return error;
        }
        return accessById;
    };

    render() {
      const {children} = this.props;

      return children({
        initAccessType: this.initAccessType,
        initRazorPayPayment: this.initRazorPayPayment,
        checkAccess: this.checkAccess,
        getSubscriptionForUser: this.getSubscriptionForUser,
        accessUpdated: this.props.accessUpdated,
        accessIsLoading: this.props.accessIsLoading
      });

    }
}

AccessTypeBase.propTypes = {
    children: PropTypes.func.isRequired,
    email: PropTypes.string,
    phone: PropTypes.number,
    isStaging: PropTypes.bool
};

const mapStateToProps = state => ({
    subscriptions : state.subscriptions || null,
    paymentOptions: state.paymentOptions || null
});


const mapDispatchToProps = dispatch  => ({
    subscriptionGroupLoaded: subscriptions => dispatch({type: SUBSCRIPTION_GROUP_UPDATED, subscriptions}),
    paymentOptionsLoaded: paymentOptions => dispatch({type: PAYMENT_OPTIONS_UPDATED, paymentOptions}),
    accessIsLoading : loading => dispatch({type: ACCESS_BEING_LOADED, loading}),
    accessUpdated : access => dispatch({type: ACCESS_UPDATED, access}),
    meterUpdated : meterCount => dispatch({type: METER_UPDATED, meterCount})
});

export const AccessType = connect(mapStateToProps, mapDispatchToProps)(AccessTypeBase);
