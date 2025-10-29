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
    it('should navigate from home to math grade selection page', () => {
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math');
      cy.contains('学年を選んでください').should('be.visible');
    });

    it('should display grade selection when visiting /math directly', () => {
      cy.visit('/math');
      cy.url().should('include', '/math');
      cy.contains('学年を選んでください').should('be.visible');
    });

    it('should navigate from grade selection to start configuration page', () => {
      cy.visit('/math');
      cy.contains('a', '小1').click();
      cy.url().should('include', '/math/start?grade=grade-1');
      cy.contains('れんしゅうの じゅんび').should('be.visible');
    });

    it('should complete navigation flow: home → math → grade → start', () => {
      // Start from home
      cy.visit('/');

      // Navigate to MathQuest (goes to grade selection)
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math');
      cy.contains('学年を選んでください').should('be.visible');

      // Select first grade
      cy.contains('a', '小1').click();
      cy.url().should('include', '/math/start?grade=grade-1');
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
      cy.visit('/math/start?grade=grade-1');
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
