// Make sure we first load our global before and after hooks
var deps = ['test/globalBeforeAfter'];
/**
 * This is the main karma requireJs setup file, it is loaded by karma after the
 * karma env is initialized, which will have resulted in the window.__karma
 * object having been populated with all the test, qowt and app files which were
 * loaded. We take that array and grab only our app test files, and let require
 * JS load those as dependencies, such that they (and their individual
 * dependencies) are loaded and ready to run. Once requireJs has loaded
 * everything, we call __karma__.start
 */
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/app\/scripts\/test\/.*-test\.js$/.test(file)) {
      deps.push(file);
    }
  }
}

// Guarantee all polymer elements are loaded before trying to run tests
deps.push('/base/app/scripts/common/elements/all.js');

window.__karma__.start = (function(originalStartFn){
  return function(){
    var args = arguments;
    document.addEventListener('WebComponentsReady', function(){
      originalStartFn.apply(null, args);
    });
  };
}(window.__karma__.start));

requirejs.config({
  waitSeconds: 30,
  // Karma serves files from '/base'
  baseUrl: '/base/app/scripts/',
  paths: {
    'qowtRoot': 'lib/qowt',
    'qowtRoot/variants': '../scripts/lib/qowt/variants/chrome'
  },
  // Ask Require.js to load these files (all our tests)
  deps: deps,
  // Start test run, once Require.js is done
  callback: window.__karma__.start

});
