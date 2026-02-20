import React from "react";
import { CardContent } from "./card";

describe("<CardContent />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardContent />);
  });
});
