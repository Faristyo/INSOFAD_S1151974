import {timeout} from "rxjs";

it("should go to info component", () => {
    // Intercept login request
    cy.intercept("POST", 'http://localhost:8080/api/auth/login', (req) => {
        expect(req.body).to.have.property('email', 'farisclashalt@gmail.com');
        expect(req.body).to.have.property('password', 'Sateshrkasd@WASCTHWOORD123!');
        req.reply({
            statusCode: 200,
            body: {
                email: "farisclashalt@gmail.com",
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJMaW5hIFh1IiwiZXhwIjoxNzE2NzU3ODk2LCJ1c2VySWQiOiIxMCIsImlhdCI6MTcxNjczNjI5NiwiZW1haWwiOiJmYXJpc2NsYXNoYWx0QGdtYWlsLmNvbSJ9.5fIXr4Rve4qvYm4Exh4-uC8MHpNzn0SxPaICUKw-Xbw"
            }
        });
    }).as('login');

    // Intercept product request
    cy.intercept('GET', 'http://localhost:8080/api/products', { fixture: 'products.json' }).as('product');

    // Intercept place order request
    cy.intercept('POST', 'http://localhost:8080/api/orders', {
        statusCode: 200,
        body: { success: true, orderId: 123 }
    }).as('placeOrder');

    // Intercept order history request
    cy.intercept('GET', 'http://localhost:8080/api/orders', { fixture: 'orders.json' }).as('orders');

    // Visit login page
    cy.visit('http://localhost:4200/auth/login');

    // Perform login
    cy.get('input[formControlName="email"]').type('farisclashalt@gmail.com');
    cy.get('input[formControlName="password"]').type('Sateshrkasd@WASCTHWOORD123!');
    cy.get('button.btn').click();



    cy.url().should('include', '/products');
    cy.get('a').should('contain', 'Log Out');

    // Intercept the products request and provide mock data
    cy.intercept('GET', '/api/products').as('getProducts');

    cy.visit('/products');
    cy.url().should('include', '/products');

    cy.wait('@getProducts').then((interception) => {
        if (interception && interception.response) {
            cy.log('Intercepted Products Response:', interception.response.body);
        }
    });

    cy.get('.producten-container .product', { timeout: 10000 }).should('have.length.above', 0);

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

    cy.visit('/order');
    cy.url().should('include', '/order');

    // Click on the first "Return" button in the order history
    cy.contains('button', 'Return').first().should('be.visible').click();

    // Select a return reason, type "hello" in the textbox, and submit the form
    cy.get('.modal-body').within(() => {
        cy.get('input[type="radio"]').first().check();
        cy.get('input[type="text"]').type('hello');
        cy.contains('button', 'Submit').click();
    });
});

