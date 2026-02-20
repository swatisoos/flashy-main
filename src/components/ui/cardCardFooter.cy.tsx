import React from "react";
import { CardFooter } from "./card";

describe("<CardFooter />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardFooter />);
  });
});
