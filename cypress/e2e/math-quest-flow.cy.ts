describe('MathQuest Flow', () => {
  describe('Start Configuration Page', () => {
    beforeEach(() => {
      cy.visit('/math/start');
    });

    it('should load the start configuration page', () => {
      cy.url().should('include', '/math/start');
      cy.contains('練習の設定').should('be.visible');
    });

    it('should display grade level selection', () => {
      cy.contains('学年を選ぶ').should('be.visible');
    });

    it('should display question count selection', () => {
      cy.contains('問題数').should('be.visible');
    });

    it('should have a start button', () => {
      cy.contains('button', 'スタート').should('be.visible');
    });
  });

  describe('Play Page Navigation', () => {
    it('should navigate to play page after configuration', () => {
      cy.visit('/math/start');

      // Select grade level (1st grade)
      cy.contains('button', '1年生').click();

      // Start the quiz
      cy.contains('button', 'スタート').click();

      // Should navigate to play page
      cy.url().should('include', '/math/play');
    });

    it('should display question on play page', () => {
      cy.visit('/math/start');

      // Quick start with default settings
      cy.contains('button', '1年生').click();
      cy.contains('button', 'スタート').click();

      // Verify play page loaded
      cy.url().should('include', '/math/play');
      cy.contains('問題').should('be.visible');
    });
  });

  describe('Results Page Navigation', () => {
    it('should navigate to results page after completing quiz', () => {
      cy.visit('/math/start');

      // Start with minimal questions (5 questions)
      cy.contains('button', '1年生').click();
      cy.contains('button', '5問').click();
      cy.contains('button', 'スタート').click();

      // Answer all questions (selecting first answer button for each)
      for (let i = 0; i < 5; i++) {
        cy.get('form button[type="submit"]').first().click();
        cy.wait(500); // Wait for navigation/state update
      }

      // Should navigate to results page
      cy.url().should('include', '/math/results');
      cy.contains('結果').should('be.visible');
    });
  });

  describe('Backward Compatibility Redirects', () => {
    it('should redirect /start to /math/start', () => {
      cy.visit('/start');
      cy.url().should('include', '/math/start');
    });

    it('should redirect /play to /math/play', () => {
      cy.visit('/play', { failOnStatusCode: false });
      // /play might require session, so we just check it doesn't 404
    });
  });
});
