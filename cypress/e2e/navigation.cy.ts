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

    it('should navigate from grade selection to mode selection page', () => {
      cy.visit('/math');
      cy.contains('a', '小学1年生').click();
      cy.url().should('include', '/math/select');
      cy.contains('学習方法を選んでください').should('be.visible');
    });

    it('should complete navigation flow: home → math → grade → mode select → quest select → start', () => {
      // Start from home
      cy.visit('/');

      // Navigate to MathQuest (goes to grade selection)
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math');
      cy.contains('学年を選んでください').should('be.visible');

      // Select first grade
      cy.contains('a', '小学1年生').click();
      cy.url().should('include', '/math/select');
      cy.contains('学習方法を選んでください').should('be.visible');

      // Select quest mode - use specific selector to avoid ambiguity
      cy.contains('.text-2xl', 'クエストに挑戦する').parent().parent().click();
      cy.url().should('include', '/math/quest');
      cy.contains('クエストを選んでください').should('be.visible');

      // Select a quest (たし算)
      cy.contains('a', 'たし算').click();
      cy.url().should('include', '/math/start');
      cy.contains('たし算のテーマを選んでください').should('be.visible');
    });

    it('should complete learning navigation flow: home → math → grade → mode select → learn', () => {
      // Start from home
      cy.visit('/');

      // Navigate to MathQuest (goes to grade selection)
      cy.contains('a', 'MathQuest').click();
      cy.url().should('include', '/math');
      cy.contains('学年を選んでください').should('be.visible');

      // Select first grade
      cy.contains('a', '小学1年生').click();
      cy.url().should('include', '/math/select');
      cy.contains('学習方法を選んでください').should('be.visible');

      // Select learning mode - use specific selector
      cy.contains('.text-2xl', '学習する').parent().parent().click();
      cy.url().should('include', '/math/learn');
      cy.contains('学習トピック').should('be.visible');

      // Select a topic (たし算の基礎)
      cy.contains('a', 'たし算の基礎').click();
      cy.url().should('include', '/math/learn/addition');
      cy.contains('h1', 'たし').should('be.visible');
      cy.contains('h1', 'ぼう').should('be.visible');
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
      cy.visit('/math/start?grade=1');
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
