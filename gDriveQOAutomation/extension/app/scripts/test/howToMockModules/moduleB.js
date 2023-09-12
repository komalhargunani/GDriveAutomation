define(['test/howToMockModules/singletonWithStateSample'], function(Singleton) {

  'use strict';

  return {
    getName: function() {
      // Module B does not set X on the singleton, so
      // it should get undefined back; unless other
      // tests have caused the Singleton to keep state!
      // This is why before each test we publish qowt:reset
      // such that all Singletons reset their state before tests are run
      return 'ModuleB: ' + Singleton.getX();
    },
    getStringFromSingletonDependency: function() {
      return Singleton.getDepString();
    }
  };
});