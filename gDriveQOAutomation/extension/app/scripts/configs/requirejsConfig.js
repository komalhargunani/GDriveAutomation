
// this allows us to load this file either directly in to
// an html file before requireJs is loaded (it'll use window.require = conf)
// or as a mainConfigurationFile for the grunt-contrib-requirejs
// optimizer
window.require = window.require || {};
require.config = require.config || function(conf) {
  window.require = conf;
};

require.config({
  waitSeconds: 60,
  baseUrl: "../scripts/",  // path is relative to app/views/qowt.html
  shim: {
    'controllers/application': {
      deps: [
      'qowtRoot/lib/framework/framework',
      'third_party/googleAnalytics/google-analytics-bundle',
      'third_party/lo-dash/lo-dash.min'
      ]
    },
    'qowtRoot/qowt': {
      deps: [
      'qowtRoot/lib/framework/framework',
      'third_party/lo-dash/lo-dash.min'
      ]
    },
    'qowtRoot/features/utils': {
      deps: ['scriptRoot/configs/chromeFeatures']
    },
    'unitTestRoot/controller': {
      deps: ['qowtRoot/lib/framework/framework']
    },
    'unitTestRoot/tester': {
      deps: ['qowtRoot/lib/framework/framework']
    },
    'monkeyClient': {
      deps: ['qowtRoot/utils/jasmineUtils']
    }
  },
  paths: {
    "scriptRoot": ".",
    "qowtRoot": "lib/qowt",

    "qowtRoot/variants": "lib/qowt/variants/chrome",

    'thirdPartyQOWT': 'lib/qowt/third_party',
    'thirdParty': 'third_party',
    'socket.io-client':
        'http://localhost:9876/node_modules/socket.io/node_modules/' +
        'socket.io-client/dist/socket.io',

    'unitTestRoot': 'lib/qowt/unittests',

    'monkeyAppClient': 'http://localhost:9876/client/monkeyAppClient',
    'monkeyTests': 'http://localhost:9876/_allTests',
    'monkeyClient': 'http://localhost:9876/client/monkeyClient',
    'monkeyE2E': 'http://localhost:9876/e2eTests/monkeyE2ELoader'
  }
});
