import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Employee e2e test', () => {
  const employeePageUrl = '/employee';
  const employeePageUrlPattern = new RegExp('/employee(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const employeeSample = {};

  let employee;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/employees+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/employees').as('postEntityRequest');
    cy.intercept('DELETE', '/api/employees/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (employee) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/employees/${employee.id}`,
      }).then(() => {
        employee = undefined;
      });
    }
  });

  it('Employees menu should load Employees page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Employee').should('exist');
    cy.url().should('match', employeePageUrlPattern);
  });

  describe('Employee page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(employeePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Employee page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/employee/new$'));
        cy.getEntityCreateUpdateHeading('Employee');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', employeePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/employees',
          body: employeeSample,
        }).then(({ body }) => {
          employee = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/employees+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/employees?page=0&size=20>; rel="last",<http://localhost/api/employees?page=0&size=20>; rel="first"',
              },
              body: [employee],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(employeePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Employee page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('employee');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', employeePageUrlPattern);
      });

      it('edit button click should load edit Employee page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Employee');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', employeePageUrlPattern);
      });

      it('edit button click should load edit Employee page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Employee');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', employeePageUrlPattern);
      });

      it('last delete button click should delete instance of Employee', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('employee').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', employeePageUrlPattern);

        employee = undefined;
      });
    });
  });

  describe('new Employee page', () => {
    beforeEach(() => {
      cy.visit(`${employeePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Employee');
    });

    it('should create an instance of Employee', () => {
      cy.get(`[data-cy="firstName"]`).type('Wava').should('have.value', 'Wava');

      cy.get(`[data-cy="lastName"]`).type('Zieme').should('have.value', 'Zieme');

      cy.get(`[data-cy="email"]`).type('Brianne_Friesen41@hotmail.com').should('have.value', 'Brianne_Friesen41@hotmail.com');

      cy.get(`[data-cy="phoneNumber"]`).type('Electronics Sleek back-end').should('have.value', 'Electronics Sleek back-end');

      cy.get(`[data-cy="hireDate"]`).type('2023-06-15T17:15').blur().should('have.value', '2023-06-15T17:15');

      cy.get(`[data-cy="salary"]`).type('91292').should('have.value', '91292');

      cy.get(`[data-cy="commissionPct"]`).type('70377').should('have.value', '70377');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        employee = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', employeePageUrlPattern);
    });
  });
});
