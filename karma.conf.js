module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular', "karma-typescript"],
    logLevel: config.LOG_DEBUG,

    mime: { //Appel d'un mime pour mapper l'extension de fichier .ts au type MIME text/x-typescript
      'text/x-typescript': ['ts','tsx']
    },

    client: {
      clearContext: false, // laisser le contexte en place
      useIframe: false // ne pas utiliser d'iframe
    },

    files: [
      'src/app/**/*.spec.ts' // ceci inclut tous les fichiers .spec.ts dans le dossier src/app et ses sous-dossiers
    ],

    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
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

    reporters: ['progress', 'junit', 'coverage', 'coverage-istanbul'], // Rapporteur pour Jenkins

    junitReporter: {
      outputDir: 'test-results', // Répertoire de sortie pour les rapports JUnit
      outputFile: 'test-results.xml' // Nom du fichier de rapport JUnit
    }
  });
};
