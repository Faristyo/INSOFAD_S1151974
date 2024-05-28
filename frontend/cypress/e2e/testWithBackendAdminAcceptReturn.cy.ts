describe.only('Admin Login and Manage Orders Test', () => {
    const email = 'admin@gmail.com';
    const password = 'Admin@123!';
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
                role: '2'
            }
        }).as('loginRequest');

        // Intercept the API call to check if the user is logged in
        cy.intercept('GET', '/api/auth/check', {
            fixture: 'loginResponse.json'
        }).as('checkLogin');
    });

    it('should login and manage orders', () => {
        cy.visit('/auth/login');

        // Perform login
        cy.get('input[formControlName="email"]').type(email);
        cy.get('input[formControlName="password"]').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.body.token).to.equal(token);
        });

        cy.url().should('include', '/admin');
        cy.get('a').should('contain', 'Log Out');

        // Navigate to the order management page
        cy.visit('/admin');
        cy.url().should('include', '/admin');

        // Click "Good Condition" button for the first order
        cy.contains('button', 'Good Condition').first().should('be.visible').click();

        // Wait for the page to update before looking for the next button
        cy.wait(1000); // Adjust this timeout as necessary based on your app's response time

        // Click "Bad Condition" button for the first order
        cy.contains('button', 'Bad Condition').first().should('be.visible').click();
    });
});
