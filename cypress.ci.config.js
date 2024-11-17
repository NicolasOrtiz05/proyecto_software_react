// cypress.ci.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          return launchOptions;
        }
      });
    },
    viewportWidth: 1382,
    viewportHeight: 736,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    testIsolation: false,
    experimentalRunAllSpecs: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    // Desactivar el fallo de las pruebas por errores
    experimentalWebKitSupport: true,
    chromeWebSecurity: false
  },
});