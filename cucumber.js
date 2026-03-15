// Cucumber configuration
// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md

export default {
  // Feature files location
  paths: ['features/**/*.feature'],

  // Step definitions and support files
  import: ['tests/step-definitions/**/*.js', 'tests/support/**/*.js'],

  // Output format
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
  ],

  // Fail fast in debug mode
  failFast: process.env.DEBUG === 'true',

  // Parallel execution (disabled by default for stability)
  parallel: 1,

  // Publish to Cucumber Reports (disabled)
  publishQuiet: true,
};
