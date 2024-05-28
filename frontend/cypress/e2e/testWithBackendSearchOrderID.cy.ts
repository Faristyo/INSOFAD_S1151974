describe.only('Admin Login and Manage Orders Test', () => {
    const email = 'farisclashalt@gmail.com';
    const password = 'Sateshrkasd@WASCTHWOORD123';
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VyIERldGFpbHMiLCJpc3MiOiJMaW5hIFh1IiwiZXhwIjoxNzE2NzcwMzg4LCJ1c2VySWQiOiIxMCIsImlhdCI6MTcxNjc0ODc4OCwiZW1haWwiOiJmYXJpc2NsYXNoYWx0QGdtYWlsLmNvbSJ9.tSkVWFMGJVxHROKHx02mx-Y97ZPLQbq3mdJa0aO-IsM';
    const role = '2';

    beforeEach(() => {
        // Clear session storage and local storage before each test
        cy.window().then((win) => {
            win.sessionStorage.clear();
            win.localStorage.clear();
        });

        // Intercept the login request
        cy.intercept('POST', '/api/auth/login', (req) => {
            expect(req.body).to.have.property('email', email);
            expect(req.body).to.have.property('password', password);
            req.reply({
                statusCode: 200,
                body: {
                    email: email,
                    token: token,
                    role: role
                }
            });
        }).as('loginRequest');
    });

    it('should login and view orders', () => {
        cy.visit('/auth/login');

        // Perform login
        cy.get('input[formControlName="email"]').type(email);
        cy.get('input[formControlName="password"]').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.body.token).to.equal(token);
            cy.window().then((win) => {
                win.localStorage.setItem('token', token);
                cy.log('Token set in local storage:', win.localStorage.getItem('token'));
            });
        });

        cy.url().should('include', '/admin');
        cy.get('a').should('contain', 'Log Out');

        // Intercept the orders request to fetch real orders
        cy.intercept('GET', '/api/orders/allhistory', (req) => {
            req.headers['Authorization'] = `Bearer ${token}`;
        }).as('getOrders');

        // Visit the /admin page directly
        cy.visit('/admin');
        cy.url().should('include', '/admin');

        // Wait for the orders request to complete and verify the orders are displayed
        cy.wait('@getOrders').then((interception) => {
            cy.log('Intercepted getOrders response:', interception);
            expect(interception.response.statusCode).to.equal(200);
            cy.log('Orders:', interception.response.body);
        });

        // Ensure the .order-list element exists and contains the orders
        cy.get('.order-list', { timeout: 10000 }).should('exist').then(($orderList) => {
            cy.log('Order list found:', $orderList);
            cy.wrap($orderList).within(() => {
                cy.contains('button', 'Good Condition').should('exist');
                cy.contains('button', 'Bad Condition').should('exist');
            });
        });

        // Type numbers 1, 2, and 3 into the search bar
        for (let i = 1; i <= 3; i++) {
            cy.get('input[placeholder="Search"]').clear().type(i.toString());
            cy.wait(1000); // Adjust this timeout as necessary based on your app's response time
        }
    });
});
