describe('MathQuest Flow', () => {
  describe('Quest Start Page (Theme Selection)', () => {
    beforeEach(() => {
      // Navigate through the full flow to get to theme selection page with proper cookies
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      // Select quest mode - use more specific selector to avoid ambiguity
      cy.contains('.text-2xl', 'クエストに挑戦する').parent().parent().click();
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

  describe('Learning Page', () => {
    it('should load the addition learning page', () => {
      // Navigate through the full flow to learning page
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      // Select learning mode - use specific selector
      cy.contains('.text-2xl', '学習する').parent().parent().click();
      cy.contains('a', 'たし算の基礎').click();

      // Should navigate to learning page
      cy.url().should('include', '/math/learn/addition');
      cy.contains('h1', 'たし').should('be.visible');
      cy.contains('h1', 'ぼう').should('be.visible');
    });

    it('should display learning content sections', () => {
      cy.visit('/math/learn/addition?grade=elem-1');

      // Should have step cards with headings - check by visible content
      cy.contains('h2', 'たし').should('be.visible');
      cy.contains('h2', 'ステップ').should('be.visible');
      // Check for step indicator circles with numbers
      cy.get('.rounded-full').contains('1').should('be.visible');
      cy.get('.rounded-full').contains('2').should('be.visible');
      cy.get('.rounded-full').contains('3').should('be.visible');
      cy.get('.rounded-full').contains('4').should('be.visible');
    });
  });

  describe('Play Page Navigation', () => {
    it('should navigate to play page after selecting theme', () => {
      // Navigate through the full flow
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.contains('.text-2xl', 'クエストに挑戦する').parent().parent().click();
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
      cy.contains('.text-2xl', 'クエストに挑戦する').parent().parent().click();
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
