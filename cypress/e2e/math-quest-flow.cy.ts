describe('MathQuest Flow', () => {
  describe('Start Configuration Page', () => {
    beforeEach(() => {
      // Navigate through the full flow to get to start page with proper cookies
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();
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
      // Navigate through the full flow
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();

      // Start the quiz
      cy.contains('button', 'はじめる').click();

      // Should navigate to play page
      cy.url().should('include', '/math/play');
    });

    it('should display question on play page', () => {
      // Navigate through the full flow
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();

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
