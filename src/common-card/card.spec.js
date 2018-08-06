// @flow
import "jest-dom/extend-expect";
import Button from "@material-ui/core/Button";
import React from "react";
import { CommonCard } from "./index";
import { TestWrapper } from "../utils";
import { cleanup, render } from "react-testing-library";

afterEach(cleanup);

test("render common card", () => {
  const { container, getByTestId } = render(
    <TestWrapper>
      <CommonCard title="Test Card">This is a test</CommonCard>
    </TestWrapper>,
  );
  expect(getByTestId("card-header")).toHaveTextContent("Test Card");
  expect(getByTestId("card-content")).toHaveTextContent("This is a test");
  expect(container).toMatchSnapshot();
});

test("render common card with margin", () => {
  const { container, getByTestId } = render(
    <TestWrapper>
      <CommonCard
        title="Test Card"
        hasMargin
      >
        This is a test
      </CommonCard>
    </TestWrapper>,
  );
  expect(getByTestId("card-header")).toHaveTextContent("Test Card");
  expect(getByTestId("card-content")).toHaveTextContent("This is a test");
  expect(container).toMatchSnapshot();
});

test("render common card with header actions", () => {
  const { container, getByTestId } = render(
    <TestWrapper>
      <CommonCard headerActions={[<Button key="0">Test Header Action Button</Button>]}>This is a test</CommonCard>
    </TestWrapper>,
  );
  expect(getByTestId("card-header")).toHaveTextContent("Test Header Action Button");
  expect(getByTestId("card-content")).toHaveTextContent("This is a test");
  expect(container).toMatchSnapshot();
});

test("render common card without title or header actions", () => {
  const { container, getByTestId } = render(
    <TestWrapper>
      <CommonCard>This is a test</CommonCard>
    </TestWrapper>,
  );
  expect(getByTestId("card-content")).toHaveTextContent("This is a test");
  expect(container).toMatchSnapshot();
});

test("render common card with footer actions", () => {
  const { container, getByTestId } = render(
    <TestWrapper>
      <CommonCard
        title="Test Card"
        footerActions={[<Button key="0">Test Footer Action Button</Button>]}
      >
        This is a test
      </CommonCard>
    </TestWrapper>,
  );
  expect(getByTestId("card-header")).toHaveTextContent("Test Card");
  expect(getByTestId("card-content")).toHaveTextContent("This is a test");
  expect(getByTestId("card-actions")).toHaveTextContent("Test Footer Action Button");
  expect(container).toMatchSnapshot();
});
