describe('LoginComponent', () => {

    beforeEach(() => {
        // Clear session storage and local storage before each test
        cy.window().then((win) => {
            win.sessionStorage.clear();
            win.localStorage.clear();
        });
    });

    it('Should login when valid and validated credentials are provided and fetch products', () => {
        cy.intercept("POST", 'http://localhost:8080/api/auth/login', {fixture: 'loginResponse.json'}).as('loginRequest');
        cy.intercept("GET", 'http://localhost:8080/api/products', {fixture: 'products.json'}).as('productsRequest');

        cy.visit('http://localhost:4200/auth/login');
        cy.url().should('include', 'login');
        cy.get('[formControlName="email"]').type('test@account');
        cy.get('[formControlName="password"]').type('TestLangGenoeg1!');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').then((interception) => {
            console.log(interception.response.body); // Log the response body to verify it matches 'loginResponse.json'
            expect(interception.response.body.success).to.be.true;
        });

        cy.url().should('include', 'products'); // Check that the URL now includes 'products'
        cy.get('.nav-link').contains('Log Out'); // Verify the presence of the "Log Out" link

        // Wait for the products request and check for the response
        cy.wait('@productsRequest').then((interception) => {
            console.log(interception.response.body); // Log the response body to verify it matches 'products.json'
            expect(interception.response.body).to.have.length(3);
        });

        // Check that products are rendered in the DOM
        cy.get('.product').should('have.length', 3); // Assuming each product is rendered with a class of 'product'
    });

});
