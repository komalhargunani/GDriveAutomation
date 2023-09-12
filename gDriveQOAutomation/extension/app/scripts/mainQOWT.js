document.addEventListener( "WebComponentsReady", function () {
  require([
    'qowtRoot/qowt',
    'qowtRoot/third_party/when/when'], function(
    InitializeQOWT,
    when) {

    'use strict';


    // Load QOWT and when all polymer elements are ready initialize it
    when.promise(function(resolve) {
      resolve();
    }).timeout(
      30000, new Error('Failed to load polymer elements')).then(
      // Initialize QOWT on success and failure so that any error is passed
      // through, QOWT can then display the right error UI and sync the error to
      // the App which can then log the time out to GA
      InitializeQOWT, InitializeQOWT).done();
  });
});