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

  it('Then: I should mark the book as finished', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('.book--content button').first().click();

    cy.get('[data-testing="toggle-reading-list"]').click();
    
    cy.get('[data-testing="reading-list-finished"]').should('exist');
    cy.get('[data-testing="reading-list-finished"]').click();

    cy.get('.reading-list-item').should('have.class', 'finished')
  })
});
