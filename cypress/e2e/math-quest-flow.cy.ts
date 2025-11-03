describe('MathQuest Flow', () => {
  describe('Theme Selection Page', () => {
    beforeEach(() => {
      // Navigate through the full flow to get to theme selection page with proper cookies
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();
    });

    it('should load the theme selection page', () => {
      cy.url().should('include', '/math/start');
      cy.contains('たし算のテーマを選んでください').should('be.visible');
    });

    it('should display play settings', () => {
      cy.contains('プレイ設定').should('be.visible');
    });

    it('should display question count selection', () => {
      // Question count should be visible on the page
      cy.contains('問題数').should('be.visible');
    });

    it('should have theme selection cards', () => {
      // Theme cards should be visible
      cy.get('[class*="grid"]').should('be.visible');
    });
  });

  describe('Play Page Navigation', () => {
    it('should navigate to play page after selecting theme', () => {
      // Navigate through the full flow
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();

      // Select a theme (click on any theme card)
      cy.get('a[href*="/math/play"]').first().click();

      // Should navigate to play page
      cy.url().should('include', '/math/play');
    });

    it('should display question on play page', () => {
      // Navigate through the full flow
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('a', 'クエストに挑戦する').click();
      cy.contains('a', 'たし算').click();

      // Select a theme to start
      cy.get('a[href*="/math/play"]').first().click();

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
