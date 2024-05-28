describe('Login and Order Process Test', () => {
    const email = 'test@example.com';
    const password = 'password123';

    beforeEach(() => {
        cy.session('login', () => {
            cy.visit('/auth/login');
            cy.intercept('POST', '/api/auth/login', {
                statusCode: 200,
                body: { token: '123', role: '1' }
            }).as('loginRequest');

            cy.get('input[formControlName="email"]').type(email);
            cy.get('input[formControlName="password"]').type(password);
            cy.get('button[type="submit"]').click();

            cy.wait('@loginRequest');
            cy.url().should('include', '/');
            cy.get('a').should('contain', 'Log Out');
        });
    });

    it('should complete the order process and return an item', () => {
        // Navigate to the products page
        cy.visit('/products');
        cy.url().should('include', '/products');

        // Click on a random "Buy" button
        cy.get('button').contains('Buy').then($buttons => {
            const randomIndex = Math.floor(Math.random() * $buttons.length);
            cy.wrap($buttons[randomIndex]).click();
        });

        // Go to the cart
        cy.visit('/cart');
        cy.url().should('include', '/cart');

        // Click on the "Bestelling plaatsen" button
        cy.contains('button', 'Bestelling plaatsen').click();

        // Navigate to the order history
        cy.visit('/order-history');
        cy.url().should('include', '/order-history');

        // Click on the "Return" button
        cy.contains('button', 'Return').click();
    });
});
