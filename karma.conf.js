require('events').EventEmitter.defaultMaxListeners = 100; // limite plus élevée pour les listeners
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-verbose-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    browsers: ['ChromeHeadless'],

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless=new',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--disable-dbus',   // Ajoutez ce flag
          '--disable-remote-fonts' // et celui-ci pour éviter des erreurs potentielles liées aux polices.
        ]
      }
    },

    singleRun: true, // Cela assure que les tests s'exécutent une seule fois

    reporters: ['progress', 'junit', 'verbose'], // Rapporteur pour Jenkins

    junitReporter: {
      outputDir: 'test-results', // Répertoire de sortie pour les rapports JUnit
      outputFile: 'test-results.xml' // Nom du fichier de rapport JUnit
    }
  });
};
