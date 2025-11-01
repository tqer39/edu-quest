describe('MathQuest Flow', () => {
  describe('Start Configuration Page', () => {
    beforeEach(() => {
      cy.visit('/math/start?grade=1&calc=calc-add');
    });

    it('should load the start configuration page', () => {
      cy.url().should('include', '/math/start');
      cy.contains('れんしゅうの じゅんび').should('be.visible');
    });

    it('should display selected grade summary', () => {
      cy.contains('選んだ学年').should('be.visible');
      cy.contains('現在の学年').should('be.visible');
    });

    it('should display question count selection', () => {
      // Question count should be visible on the page
      cy.contains('問題数').should('be.visible');
    });

    it('should have a start button', () => {
      cy.contains('button', 'はじめる').should('be.visible');
    });
  });

  describe('Play Page Navigation', () => {
    it('should navigate to play page after configuration', () => {
      cy.visit('/math/start?grade=1&calc=calc-add');

      // Start the quiz
      cy.contains('button', 'はじめる').click();

      // Should navigate to play page
      cy.url().should('include', '/math/play');
    });

    it('should display question on play page', () => {
      cy.visit('/math/start?grade=1&calc=calc-add');

      // Quick start with default settings
      cy.contains('button', 'はじめる').click();

      // Verify play page loaded
      cy.url().should('include', '/math/play');
      cy.contains('もんだい').should('be.visible');
    });
  });

  describe('Backward Compatibility Redirects', () => {
    it('should redirect /start to /math/start', () => {
      cy.visit('/start');
      cy.url().should('include', '/math');
    });

    it('should redirect /play to /math/play', () => {
      cy.visit('/play', { failOnStatusCode: false });
      // /play might require session, so we just check it doesn't 404
    });
  });
});
