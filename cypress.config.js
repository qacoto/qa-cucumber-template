const { defineConfig } = require('cypress');
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const createEsbuildPlugin =
  require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;
const { allureCypress } = require('allure-cypress/reporter');

module.exports = defineConfig({
  experimentalRunEvents: true,

  e2e: {
    baseUrl: 'https://www.saucedemo.com',

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      allureCypress(on, config, {
        resultsDir: 'cypress/reports/allure-results',
        links: [],
      });

      installLogsPrinter(on, {
        printLogsToConsole: 'always',
        printLogsToFile: 'always',
        outputRoot: config.projectRoot + '/logs/',
        outputTarget: {
          'out.txt': 'txt',
        },
      });

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      return config;
    },

    specPattern: 'cypress/e2e/**/*.feature',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    defaultCommandTimeout: 20000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32,
  },
});
