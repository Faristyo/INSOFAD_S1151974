describe.only('Login and Load Products Test', () => {
    const email = 'farisclashalt@gmail.com';
    const password = 'Sateshrkasd@WASCTHWOORD123';
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJMaW5hIFh1IiwiZXhwIjoxNzE2NzAwMjAxLCJ1c2VySWQiOiIxMCIsImlhdCI6MTcxNjY3ODYwMSwiZW1haWwiOiJmYXJpc2NsYXNoYWx0QGdtYWlsLmNvbSJ9.O2pRLvQjvLVyiSx4I1MYyHSf5RbzM2ZmvkZbaXfd7R0';

    beforeEach(() => {
        // Clear session storage and local storage before each test
        cy.window().then((win) => {
            win.sessionStorage.clear();
            win.localStorage.clear();
        });

        // Intercept the login request
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
                token: token,
                role: '1'
            }
        }).as('loginRequest');

        // Intercept the API call to check if the user is logged in
        cy.intercept('GET', '/api/auth/check', {
            fixture: 'loginResponse.json'
        }).as('checkLogin');
    });

    it('should load products after login and buy a product', () => {
        cy.visit('/auth/login');

        // Perform login
        cy.get('input[formControlName="email"]').type(email);
        cy.get('input[formControlName="password"]').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.body.token).to.equal(token);
        });

        cy.url().should('include', '/products');
        cy.get('a').should('contain', 'Log Out');

        // Intercept the products request and provide mock data
        cy.intercept('GET', '/api/products', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Product 1', price: 10 },
                { id: 2, name: 'Product 2', price: 20 },
                { id: 3, name: 'Product 3', price: 30 }
            ]
        }).as('getProducts');

        cy.visit('/products');
        cy.url().should('include', '/products');

        cy.wait('@getProducts').then((interception) => {
            if (interception && interception.response) {
                cy.log('Intercepted Products Response:', interception.response.body);
            }
        });

        cy.get('.producten-container .product', { timeout: 10000 }).should('have.length', 3);

        cy.get('.producten-container .product').then($products => {
            const randomIndex = Math.floor(Math.random() * $products.length);
            cy.wrap($products[randomIndex]).contains('button', 'Buy').click();
        });

        // Intercept the order placement request and provide a mock response
        cy.intercept('POST', '/api/order', {
            statusCode: 200,
            body: { success: true, orderId: 123 }
        }).as('placeOrder');

        cy.visit('/cart');
        cy.url().should('include', '/cart');

        cy.contains('button', 'Bestelling plaatsen').should('be.visible').click();

        // Debug log to ensure button click triggers request
        cy.log('Clicked Bestelling plaatsen button');

        cy.wait('@placeOrder').then((interception) => {
            cy.log('Intercepted Order Placement:', interception.response.body);
            expect(interception.response.body.success).to.be.true;
        });

        // Intercept the order history request and provide mock order data
        cy.intercept('GET', '/api/order/history', {
            statusCode: 200,
            body: [
                { id: 123, productName: 'Product 1', status: 'Completed' }
            ]
        }).as('getOrderHistory');

        cy.visit('/order');
        cy.url().should('include', '/order');

        cy.wait('@getOrderHistory').then((interception) => {
            if (interception && interception.response) {
                cy.log('Intercepted Order History Response:', interception.response.body);
            }
        });

        cy.contains('button', 'Return').should('be.visible').click();
    });
});
