require('events').EventEmitter.defaultMaxListeners = 100; // limite plus élevée pour les listeners
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular', "karma-typescript"],
    logLevel: config.LOG_DEBUG,
    extensions: ['ts', 'tsx', 'js', 'jsx'],

    mime: { //Appel d'un mime pour mapper l'extension de fichier .ts au type MIME text/x-typescript
      'text/x-typescript': ['ts']
    },

    client: {
      clearContext: false, // laisser le contexte en place
      useIframe: false // ne pas utiliser d'iframe
    },

    preprocessors: {
      '**/*.ts': ['karma-typescript'] // Ceci ajoute karma-typescript comme préprocesseur pour tous les fichiers TypeScript
    },

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.spec.json",  // Le chemin vers votre fichier tsconfig.spec.json
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-verbose-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage'),
      require('karma-coverage-istanbul-reporter')
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

    coverageIstanbulReporter: { //Configuration du reporter coverage-istanbul
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },

    singleRun: true, // Cela assure que les tests s'exécutent une seule fois

    reporters: ['progress', 'junit', 'coverage', 'coverage-istanbul', 'karma-typescript', 'verbose'], // Rapporteur pour Jenkins

    junitReporter: {
      outputDir: 'test-results', // Répertoire de sortie pour les rapports JUnit
      outputFile: 'test-results.xml' // Nom du fichier de rapport JUnit
    }
  });
};
