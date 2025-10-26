describe('EduQuest Navigation', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  describe('Home Page', () => {
    it('should load the home page successfully', () => {
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.contains('EduQuest').should('be.visible');
    });

    it('should display navigation to MathQuest', () => {
      cy.contains('a', 'MathQuest').should('be.visible');
    });
  });

  describe('MathQuest Navigation Flow', () => {
    it('should navigate from home to math start page', () => {
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math/start');
    });

    it('should navigate to math start configuration page via /math redirect', () => {
      cy.visit('/math');
      cy.url().should('include', '/math/start');
    });

    it('should complete navigation flow: home → math/start', () => {
      // Start from home
      cy.visit('/');

      // Navigate to MathQuest (goes directly to /math/start)
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math/start');
      cy.contains('れんしゅうの じゅんび').should('be.visible');
    });
  });

  describe('ClockQuest Navigation Flow', () => {
    it('should navigate from home to clock home page', () => {
      cy.visit('/');
      cy.contains('a', 'ClockQuest').click();
      cy.url().should('include', '/clock');
    });
  });

  describe('Back Navigation', () => {
    it('should navigate back from math start to math home', () => {
      cy.visit('/math/start');
      cy.go('back');
      cy.url().should('include', '/math');
    });

    it('should navigate back from math home to main home', () => {
      cy.visit('/math');
      cy.go('back');
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });
});
