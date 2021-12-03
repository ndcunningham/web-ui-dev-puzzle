describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  describe(' and click on Want to Read', () => {
    it('Then: I click Want to Read should show Notification', () => {
      cy.get('input[type="search"]').type('javascript');
      cy.get('form').submit();

      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);

      cy.get('[data-testing="want-to-read"]').first().click();

      cy.get('snack-bar-container').should('exist');
      cy.get('[data-testing="reading-list-item"]').should('have.length', 1);
    });

    it('Then: Undo should restore after adding a Book', () => {
      cy.get('input[type="search"]').type('javascript');
      cy.get('form').submit();

      cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);

      cy.get('[data-testing="want-to-read"]').first().click();
      cy.get('snack-bar-container').should('exist');
      cy.get('snack-bar-container button').should('contain.text', 'Undo')

      cy.get('snack-bar-container button').click();
      cy.get('[data-testing="reading-list-item"]').should('have.length', 0);
    });
  });
});
