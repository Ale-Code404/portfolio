const bodyClass = "bg-white dark:bg-zinc-900 dark:text-white";

describe("Common", () => {
  it("has title", () => {
    const page = cy.visit("/");

    page
      .get("title")
      .should("exist");

    page.get("title").should("exist");
  });

  it("has meta tags", () => {
    const page = cy.visit("/");

    page
      .get("meta[name=keywords]")
      .should("exist");
    page.get("meta[name=keywords]")
      .should("exist");
  });

  it("has used stack", () => {
    const page = cy.visit("/");

    // Should have al least one stack
    page.get("#used-stack").should("have.length.gte", 1);
  });

  it("has projects", () => {
    const page = cy.visit("/");

    // Should have al least one project
    page.get("article").should("have.length.gte", 1);
  });

  it("has experiences", () => {
    const page = cy.visit("/");

    // Should have al least one experience
    page
      .get("#experiences-list .experience-list-item")
      .should("have.length", 2);
  });

  it("has social networks", () => {
    const page = cy.visit("/");

    // Should have al least one social network
    page.get(".social-networks").should("have.length.gte", 1);
  });

  it("initialize with default theme", () => {
    const page = cy.visit("/");

    page.getAllLocalStorage().then((storage) => {
      const local = storage[Cypress.config().baseUrl] ?? false;

      if (local) {
        expect(local).to.have.property("theme");
      }
    });
  });
});

describe("Mobile", () => {
  beforeEach(() => {
    cy.viewport("samsung-s10");
  });

  it("can toggle theme on mobile", () => {
    cy.visit("/");

    cy.get("#open-menu").click();
    cy.get("#mobile-theme-switcher").click();

    // Remove dark class
    cy.get("body").should("have.class", `${bodyClass} overflow-hidden`);
    cy.get("#mobile-theme-switcher").click();

    // Trigger dark class
    cy.get("body").should("have.class", bodyClass);
    cy.get("#close-menu").click();
  });

  it("can toggle mobile menu", () => {
    cy.visit("/");

    cy.get("#open-menu").click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("#close-menu").click();
    cy.get("#mobile-menu").should("not.be.visible");
  });

  it("show mobile menu", () => {
    cy.viewport("samsung-s10").visit("/");

    cy.get("#desktop-nav").should("not.be.visible");
    cy.get("#open-menu").should("be.visible");
  });

  it("on open mobile menu cant do vertical scrolling", () => {
    cy.viewport("samsung-s10").visit("/");

    cy.get("#open-menu").click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("body").should("have.css", "overflow", "hidden");
    cy.get("#close-menu").click();
  });
});
