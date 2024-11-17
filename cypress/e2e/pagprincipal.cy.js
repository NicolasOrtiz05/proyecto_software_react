describe('paginaprincipaltest', function () {
  beforeEach(function() {
    // Visitar la página principal antes de cada prueba
    cy.visit('/');
    
    // Esperar a que los productos se carguen inicialmente, aumentando el timeout
    cy.get('.producto', { timeout: 30000 }).should('exist');
    
    // Establecer el tamaño de la ventana
    cy.viewport(1382, 736);

    // Espera adicional antes de comenzar las pruebas (opcional)
    cy.wait(3000); // Solo si es necesario, esta espera se ejecutará antes de cada prueba
  });

  it('paginaprincipaltest', function () {
    // Verificar que los productos se han cargado antes de empezar
    cy.get('.producto').should('have.length.gt', 0).then(() => {
      // Realizar clic en productos de la página principal
      clickWhenVisible(".producto:nth-child(1) .producto-agregar");
      clickWhenVisible(".producto:nth-child(3) .producto-agregar");
      clickWhenVisible(".producto:nth-child(11) .producto-agregar");
      clickWhenVisible(".producto:nth-child(14) .producto-agregar");
    });

    // Navegar a la segunda sección y agregar producto
    cy.get('li:nth-child(2) > .boton-menu')
      .click()
      .then(() => {
        cy.get('.producto', { timeout: 30000 }).should('exist'); // Asegurarse que los productos estén disponibles
        clickWhenVisible(".producto:nth-child(2) .producto-agregar");
      });

    // Navegar a la tercera sección y agregar producto
    cy.get('li:nth-child(3) > .boton-menu')
      .click()
      .then(() => {
        cy.get('.producto', { timeout: 30000 }).should('exist'); // Asegurarse que los productos estén disponibles
        clickWhenVisible(".producto:nth-child(5) .producto-agregar");
      });

    // Navegar a la cuarta sección y agregar producto
    cy.get('li:nth-child(4) > .boton-menu')
      .click()
      .then(() => {
        cy.get('.producto', { timeout: 30000 }).should('exist'); // Asegurarse que los productos estén disponibles
        clickWhenVisible(".producto:nth-child(3) .producto-agregar");
      });
  });
});

// Función auxiliar mejorada para hacer clic cuando el elemento esté visible
const clickWhenVisible = (selector) => {
  cy.get(selector, { timeout: 30000 }) // Aumentar el tiempo de espera a 30 segundos
    .should('be.visible')
    .scrollIntoView({ behavior: 'smooth' })
    .wait(500) // Esperar a que termine el scroll
    .then(() => {
      // Volver a consultar el elemento después del scroll
      cy.get(selector).should('be.visible').click({ force: true });
    });
};
