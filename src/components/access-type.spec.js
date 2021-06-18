/* eslint-disable no-unused-vars */
import { AccessType } from "./access-type";
import React from "react";
import { render, cleanup } from "react-testing-library";
import { Provider } from "react-redux";
import { createStore } from "redux";

afterEach(cleanup);

describe("AccessType", () => {
  beforeAll(() => {
    global.fetch = jest.fn((host) =>
      Promise.resolve({
        json: () => {
          if (host.includes("/api/v1/subscription_groups.json")) {
            return Promise.resolve([
              {
                id: 20714,
                account_id: 9,
                name: "Omise",
                description: "group to test omise integration",
                subscription_type: "standard",
                public: true,
                created_at: "2021-06-15T08:31:12.623Z",
                updated_at: "2021-06-15T08:31:12.623Z",
                preferred_identity_provider: "email",
                currency: "USD",
                campaign_active: false,
                subscription_plans: [
                  {
                    id: 47742,
                    subscription_group_id: 20714,
                    duration_length: 5,
                    price_cents: 3000,
                    price_currency: "THB",
                    created_at: "2021-06-15T08:31:56.348Z",
                    updated_at: "2021-06-16T11:58:23.996Z",
                    duration_unit: "days",
                    description: "Omise",
                    title: "Omise",
                    recurring: true,
                    enabled: true,
                    trial_period_enabled: false,
                    supported_payment_providers: ["omise"],
                    assets: [
                      {
                        title: "omise",
                        type: "site",
                      },
                    ],
                    display_assets: [
                      {
                        title: "omise",
                        type: "site",
                      },
                    ],
                  },
                ],
              },
            ]);
          } else if (host.includes("/api/v1/campaigns.json")) {
            return Promise.resolve([
              {
                id: 20760,
                account_id: 9,
                name: "Devbox Omise Campaign",
                description: "dev box omise Campaign",
                subscription_type: "campaign",
                public: true,
                created_at: "2021-06-17T10:14:49.926Z",
                updated_at: "2021-06-17T10:14:49.926Z",
                preferred_identity_provider: "email",
                currency: "JPY",
                target_amount: 30000,
                target_reached: false,
                collected_amount_cents: 0,
                collected_amount: 0,
                collected_amount_percentage: 0,
                subscription_plans: [
                  {
                    id: 47760,
                    subscription_group_id: 20760,
                    duration_length: 5,
                    price_cents: 10000,
                    price_currency: "JPY",
                    created_at: "2021-06-17T10:16:02.149Z",
                    updated_at: "2021-06-17T10:16:02.149Z",
                    duration_unit: "days",
                    description: "yen currency",
                    title: "Campaign Omise",
                    recurring: false,
                    enabled: true,
                    trial_period_enabled: false,
                    supported_payment_providers: ["omise"],
                    assets: [
                      {
                        title: "full-site",
                        type: "site",
                      },
                    ],
                    display_assets: [
                      {
                        title: "full-site",
                        type: "site",
                      },
                    ],
                  },
                ],
              },
            ]);
          } else if (host.includes("/api/v1/access-token/integrations")) {
            return Promise.resolve({
              headers: {
                "x-integration-token":
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXItdXJsIjpudWxsLCJuYW1lIjoiYWJjIiwiaWQiOjE2OTQ1MzEsImVtYWlsIjoiM2QyOTM5MWUtNDAzMy00NzhmLTlhOGMtYTc4ZjVmMTM0ODdmQGVtYWlsLndlYmhvb2suc2l0ZSIsImZpcnN0LW5hbWUiOm51bGwsImxhc3QtbmFtZSI6bnVsbCwidGltZXN0YW1wIjoxNjIzOTI4NzIxNzYzLCJpYXQiOjE2MjM5Mjg3MjF9.gJjwrDDaaNBFQNfrDcdzczCIsN_pxVD1njYXA-6XxOs",
              },
            });
          }
        },
      })
    );
  });

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
  };
  let instance;

  it("Successful omise recurring payment", () => {
    const container = render(
      <Provider
        store={createStore((x) => x, {
          paymentOptions: {
            omise: {
              action: "pay",
              proceed: async (i) => {
                return { proceed: (j) => j };
              },
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="j"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
          children={({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        />
      </Provider>
    );
    instance(selectedPlan, "standard")
      .then((data) =>
        expect(data).toStrictEqual({
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
          payment: {
            payment_type: "omise_recurring",
            amount_cents: 3000,
            amount_currency: "THB",
          },
          assets: [{ id: "", title: "", slug: "" }],
          recipient_subscriber: {},
        })
      )
      .catch((error) => error);
  });

  it("Successful omise one-time payment", () => {
    const container = render(
      <Provider
        store={createStore((x) => x, {
          paymentOptions: {
            omise: {
              action: "pay",
              proceed: async (i) => {
                return { proceed: (j) => j };
              },
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="j"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
          children={({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        />
      </Provider>
    );
    instance({ ...selectedPlan, recurring: false }, "standard")
      .then((data) =>
        expect(data).toStrictEqual({
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
          payment: {
            payment_type: "omise",
            amount_cents: 3000,
            amount_currency: "THB",
          },
          assets: [{ id: "", title: "", slug: "" }],
          recipient_subscriber: {},
        })
      )
      .catch((error) => error);
  });

  it("Failed omise payment ", () => {
    const container = render(
      <Provider store={createStore((x) => x, {})}>
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="j"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
          children={({ initOmisePayment }) => {
            instance = initOmisePayment;
            return <div />;
          }}
        />
      </Provider>
    );
    instance(selectedPlan, "standard")
      .then((data) => data)
      .catch((error) =>
        expect(error.message).toStrictEqual("Payment option is loading...")
      );
  });

  it("Successful razorpay recurring payment", () => {
    const container = render(
      <Provider
        store={createStore((x) => x, {
          paymentOptions: {
            razorpay: {
              action: "pay",
              proceed: async (i) => i,
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="j"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
          children={({ initRazorPayPayment }) => {
            instance = initRazorPayPayment;
            return <div />;
          }}
        />
      </Provider>
    );

    instance(selectedPlan, "standard")
      .then((data) =>
        expect(data).toStrictEqual({
          type: "standard",
          plan: {
            id: 47774,
            title: "Selected Plan",
            description: "Selected Plan",
            price_cents: 3000,
            price_currency: "USD",
            duration_length: 1,
            duration_unit: "months",
          },
          coupon_code: "",
          payment: {
            payment_type: "razorpay_recurring",
            amount_cents: 3000,
            amount_currency: "USD",
          },
          assets: [{ id: "", title: "", slug: "" }],
          recipient_subscriber: {},
        })
      )
      .catch((error) => error);
  });

  it("Successful razorpay one-time payment", () => {
    const container = render(
      <Provider
        store={createStore((x) => x, {
          paymentOptions: {
            razorpay: {
              action: "pay",
              proceed: async (i) => i,
            },
          },
        })}
      >
        <AccessType
          isStaging={true}
          enableAccesstype={true}
          accessTypeKey="j"
          email="r@gmail.com"
          phone="9900990099"
          disableMetering={false}
          stagingHost="https://staging.accesstype.com"
          accessTypeBkIntegrationId="8"
          children={({ initRazorPayPayment }) => {
            instance = initRazorPayPayment;
            return <div />;
          }}
        />
      </Provider>
    );

    instance({ ...selectedPlan, recurring: false }, "standard")
      .then((data) =>
        expect(data).toStrictEqual({
          type: "standard",
          plan: {
            id: 47774,
            title: "Selected Plan",
            description: "Selected Plan",
            price_cents: 3000,
            price_currency: "USD",
            duration_length: 1,
            duration_unit: "months",
          },
          coupon_code: "",
          payment: {
            payment_type: "razorpay",
            amount_cents: 3000,
            amount_currency: "USD",
          },
          assets: [{ id: "", title: "", slug: "" }],
          recipient_subscriber: {},
        })
      )
      .catch((error) => error);
  });
});
