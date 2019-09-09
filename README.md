# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

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
