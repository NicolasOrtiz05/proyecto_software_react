describe('paginaprincipaltest', function () {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  it('paginaprincipaltest', function () {
    // Visita la página principal
    cy.visit(BASE_URL);

    // Establecer el tamaño de la ventana
    cy.viewport(1382, 736);

    // Realizar clic en productos
    clickWhenVisible(".producto:nth-child(1) .producto-agregar");
    clickWhenVisible(".producto:nth-child(3) .producto-agregar");
    clickWhenVisible(".producto:nth-child(11) .producto-agregar");
    clickWhenVisible(".producto:nth-child(14) .producto-agregar");

    // Navegar entre secciones del menú
    clickWhenVisible("li:nth-child(2) > .boton-menu");
    clickWhenVisible(".producto:nth-child(2) .producto-agregar");

    clickWhenVisible("li:nth-child(3) > .boton-menu");
    clickWhenVisible(".producto:nth-child(5) .producto-agregar");

    clickWhenVisible("li:nth-child(4) > .boton-menu");
    clickWhenVisible(".producto:nth-child(3) .producto-agregar");
  });
});

// Función auxiliar para hacer clic cuando el elemento esté visible
const clickWhenVisible = (selector) => {
  cy.get(selector)
    .should('be.visible')  // Espera a que el elemento sea visible
    .scrollIntoView()      // Desplaza el elemento al centro de la pantalla
    .click();              // Hace clic en el elemento
};
