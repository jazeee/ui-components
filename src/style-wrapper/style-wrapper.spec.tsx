import React from "react";
import { Button } from "@material-ui/core";
import { StyleWrapper } from ".";
import { TestWrapper } from "../test-utils";
import { cleanup, render } from "@testing-library/react";

afterEach(cleanup);

test("render style wrapper", () => {
  const { container } = render(
    <TestWrapper>
      <StyleWrapper>
        <Button color="primary">Primary</Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
      </StyleWrapper>
    </TestWrapper>,
  );
  expect(container).toMatchSnapshot();
});
