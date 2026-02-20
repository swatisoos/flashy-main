import React from "react";
import { CardTitle } from "./card";

describe("<CardTitle />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardTitle />);
  });
});
