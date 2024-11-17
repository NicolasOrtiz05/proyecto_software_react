// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1382,
    viewportHeight: 736,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    // Configuración para screenshots y videos
    screenshotOnRunFailure: true,
    video: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
  },
});