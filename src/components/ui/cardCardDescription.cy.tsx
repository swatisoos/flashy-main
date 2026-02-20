import React from "react";
import { CardDescription } from "./card";

describe("<CardDescription />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardDescription />);
  });
});
