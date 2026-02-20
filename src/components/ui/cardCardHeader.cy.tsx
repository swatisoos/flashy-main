import React from "react";
import { CardHeader } from "./card";

describe("<CardHeader />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardHeader />);
  });
});
