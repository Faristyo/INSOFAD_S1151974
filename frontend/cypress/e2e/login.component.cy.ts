describe('LoginComponent', () => {

  beforeEach(() => {
    // Clear session storage and local storage before each test
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });
  });

  it('Should not login if email address is invalid', () => {
    cy.visit('http://localhost:4200/auth/login');
    cy.url().should('include', 'login');
    cy.get('[formControlName="email"]').type('geenAtSign');
    cy.get('[formControlName="password"]').type('TestLangGenoegWachtwoord1!');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Should not login if password is too short', () => {
    cy.visit('http://localhost:4200/auth/login');
    cy.url().should('include', 'login');
    cy.get('[formControlName="email"]').type('test@test');
    cy.get('[formControlName="password"]').type('test');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Should not login if invalid but validated credentials are provided', () => {
    cy.intercept("POST", 'http://localhost:8080/api/auth/login', {fixture: 'loginFailed.json'});

    cy.visit('http://localhost:4200/auth/login');
    cy.url().should('include', 'login');
    cy.get('[formControlName="email"]').type('test@account');
    cy.get('[formControlName="password"]').type('TestLangGenoeg1!');
    cy.get('button[type="submit"]').click();

    cy.wait(500);

    cy.get('.nav-link').contains('Log Out').should('not.exist'); // Verify that the "Log Out" link does not exist
  });

  it('Should login when valid and validated credentials are provided', () => {
    cy.intercept("POST", 'http://localhost:8080/api/auth/login', {fixture: 'loginResponse.json'});

    cy.visit('http://localhost:4200/auth/login');
    cy.url().should('include', 'login');
    cy.get('[formControlName="email"]').type('test@account');
    cy.get('[formControlName="password"]').type('TestLangGenoeg1!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'products'); // Check that the URL now includes 'products'
    cy.get('.nav-link').contains('Log Out'); // Verify the presence of the "Log Out" link
  });
});
