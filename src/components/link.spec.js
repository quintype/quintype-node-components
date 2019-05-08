import { Link } from './link';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, cleanup, fireEvent } from 'react-testing-library';
import React from 'react';

afterEach(cleanup);

describe("Link", () => {
  it("Creates a Link", () => {
    const { container } = render(
      <Provider store={createStore(() => {}, {qt: {}})}>
        <Link href="/" >Click</Link>
      </Provider>
    )
    expect(container.firstChild).toMatchSnapshot();
  });

  it("Navigates when the link is clicked", () => {
    const mockNavigateTo = jest.fn();
    const mockPreventDefault = jest.fn();
    const { getByText } = render(
      <Provider store={createStore(() => { }, { qt: {} })}>
        <Link href="/" navigateTo={mockNavigateTo} preventDefault={mockPreventDefault}>Click</Link>
      </Provider>
    )
    fireEvent.click(getByText("Click"));
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo.mock.calls[0][0]).toBe('/');
  });

  it("Does not navigate if disableAjaxLinks is true", () => {
    const mockNavigateTo = jest.fn();
    const mockPreventDefault = jest.fn();
    const { getByText } = render(
      <Provider store={createStore(() => { }, { qt: {} })}>
        <Link href="/" navigateTo={mockNavigateTo} preventDefault={mockPreventDefault} disableAjaxLinks={true}>Click</Link>
      </Provider>
    )
    fireEvent.click(getByText("Click"));
    expect(mockPreventDefault).toHaveBeenCalledTimes(0);
    expect(mockNavigateTo).toHaveBeenCalledTimes(0);
  });

  it("Does not navigate if shift is held", () => {
    const mockNavigateTo = jest.fn();
    const mockPreventDefault = jest.fn();
    const { getByText } = render(
      <Provider store={createStore(() => { }, { qt: {} })}>
        <Link href="/" navigateTo={mockNavigateTo} preventDefault={mockPreventDefault}>Click</Link>
      </Provider>
    )
    fireEvent.click(getByText("Click"), { ctrlKey: true });
    expect(mockPreventDefault).toHaveBeenCalledTimes(0);
    expect(mockNavigateTo).toHaveBeenCalledTimes(0);
  });
})
