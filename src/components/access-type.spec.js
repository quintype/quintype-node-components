import React from "react";
import { Provider } from "react-redux";
import { cleanup, render } from "react-testing-library";
import { createStore } from "redux";
import { AccessType } from "./access-type";
afterEach(cleanup);
describe("AccessType", () => {
  let selectedPlan = {
    id: 47742,
    duration_length: 5,
    price_cents: 3000,
    price_currency: "THB",
    created_at: "2021-06-15T08:31:56.348Z",
    updated_at: "2021-06-16T11:58:23.996Z",
    duration_unit: "days",
    description: "Selected Plan",
    title: "Selected Plan",
    recurring: true,
    enabled: true,
    trial_period_enabled: false,
    supported_payment_providers: ["omise"],
    metadata: {},
  };
  let instance;
  // adding accessTypeKey as "dummykey" to avoid making calls to accesstype
  it("Successful omise recurring payment", async () => {
    const container = render(
      <Provider
        store={createStore((store) => store, {
          paymentOptions: {
            omise: {
              action: "pay",
              proceed: async (paymentOptions) => {
                return { proceed: (paymentObject) => paymentObject };
              },
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="dummyKey"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
        >
          {({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        </AccessType>
      </Provider>
    );
    expect(await instance(selectedPlan, "standard")).toStrictEqual({
      type: "standard",
      plan: {
        id: 47742,
        title: "Selected Plan",
        description: "Selected Plan",
        price_cents: 3000,
        price_currency: "THB",
        duration_length: 5,
        duration_unit: "days",
      },
      coupon_code: "",
      metadata: {},
      payment: {
        payment_type: "omise_recurring",
        amount_cents: 3000,
        amount_currency: "THB",
      },
      assets: [{ id: "", title: "", slug: "" }],
      recipient_subscriber: {},
    });
  });
  it("Successful omise one-time payment", async () => {
    const container = render(
      <Provider
        store={createStore((store) => store, {
          paymentOptions: {
            omise: {
              action: "pay",
              proceed: async (paymentOptions) => {
                return { proceed: (paymentObject) => paymentObject };
              },
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="dummyKey"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
        >
          {({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        </AccessType>
      </Provider>
    );
    expect(await instance({ ...selectedPlan, recurring: false }, "standard")).toStrictEqual({
      type: "standard",
      plan: {
        id: 47742,
        title: "Selected Plan",
        description: "Selected Plan",
        price_cents: 3000,
        price_currency: "THB",
        duration_length: 5,
        duration_unit: "days",
      },
      coupon_code: "",
      metadata: {},
      payment: {
        payment_type: "omise",
        amount_cents: 3000,
        amount_currency: "THB",
      },
      assets: [{ id: "", title: "", slug: "" }],
      recipient_subscriber: {},
    });
  });
  it("Failed omise payment when the payment options are not passed", async () => {
    const container = render(
      <Provider store={createStore((store) => store, {})}>
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="dummyKey"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
        >
          {({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        </AccessType>
      </Provider>
    );

    await expect(instance(selectedPlan, "standard")).rejects.toEqual({
      message: "Payment option is loading...",
    });
  });
  it("Successful razorpay recurring payment", async () => {
    const container = render(
      <Provider
        store={createStore((store) => store, {
          paymentOptions: {
            razorpay: {
              action: "pay",
              proceed: async (paymentObject) => paymentObject,
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="dummyKey"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
        >
          {({ initRazorPayPayment }) => {
            instance = initRazorPayPayment;
            return <div />;
          }}
        </AccessType>
      </Provider>
    );
    expect(await instance(selectedPlan, "standard")).toStrictEqual({
      type: "standard",
      plan: {
        id: 47742,
        title: "Selected Plan",
        description: "Selected Plan",
        price_cents: 3000,
        price_currency: "THB",
        duration_length: 5,
        duration_unit: "days",
      },
      coupon_code: "",
      metadata: {},
      payment: {
        payment_type: "razorpay_recurring",
        amount_cents: 3000,
        amount_currency: "THB",
      },
      assets: [{ id: "", title: "", slug: "" }],
      recipient_subscriber: {},
    });
  });
  it("Successful razorpay one-time payment", async () => {
    const container = render(
      <Provider
        store={createStore((store) => store, {
          paymentOptions: {
            razorpay: {
              action: "pay",
              proceed: async (paymentObject) => paymentObject,
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="dummyKey"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
        >
          {({ initRazorPayPayment }) => {
            instance = initRazorPayPayment;
            return <div />;
          }}
        </AccessType>
      </Provider>
    );
    expect(await instance({ ...selectedPlan, recurring: false }, "standard")).toStrictEqual({
      type: "standard",
      plan: {
        id: 47742,
        title: "Selected Plan",
        description: "Selected Plan",
        price_cents: 3000,
        price_currency: "THB",
        duration_length: 5,
        duration_unit: "days",
      },
      coupon_code: "",
      metadata: {},
      payment: {
        payment_type: "razorpay",
        amount_cents: 3000,
        amount_currency: "THB",
      },
      assets: [{ id: "", title: "", slug: "" }],
      recipient_subscriber: {},
    });
  });
});
