/**
 * @fileoverview Defines monkeyLoader, which is a RequireJS plugin for
 * conditionally loading monkey modules in Quickoffice Chrome.  These modules
 * are loaded for debug builds only; in release builds no action is taken.  The
 * modules are loaded from monkeyServer, which serves them over HTTP.  If monkey
 * server is not running, or more generally the modules failed to load, the
 * onload callback is made because this case is not an error case.
 */

define(['qowtRoot/features/utils'], function (FeatureUtils) {

  var monkeyModulesLoaded_ = 0;

  var api_ = {
    load : function (name, parentRequire, onload) {
      parentRequire = parentRequire || '';
      if (FeatureUtils.isDebug()) {
        console.log('Loading ' + name);
        loadMonkeyModule_.apply(this, arguments);
      } else {
        onload();
      }
    },
  };

  function loadMonkeyModule_ (name, parentRequire, onload) {
    var loader = function (v) {
      monkeyModulesLoaded_++;
      onload(v);
    };
    parentRequire([name], loader, function (err) {
      if (monkeyModulesLoaded_ === 0) {
        // haven't loaded ANY monkey modules yet; so assume monkey
        // server isn't running, and just "continue". This means
        // requireJs will not attempt to load any more modules, since
        // it is in an error handling loop here. But at least qowt can
        // resume and open documents. Basically we are running a debug
        // version of the app without running monkey tests.
        console.warn('Failed to load ' + name + '. ' +
                     'The monkey server is likely not running.');
        onload();
      } else {
        // if there was a problem with any of the tests, then bail out.
        // we do NOT want to continue, because the number of tests
        // that DID load is ambigious. Thus we may or may not have loaded
        // the xxx-test.js for the opened test document. Ie we may or
        // may not end up with a missing test failure. In order to not
        // have sporadic failures, we bail out...
        console.error('Monkey _is_ running, but we failed to ' +
                      'laod module ' + name + '.');
        console.error(err);
        console.error(err.stack);
      }
    });
  }

  return api_;
});
