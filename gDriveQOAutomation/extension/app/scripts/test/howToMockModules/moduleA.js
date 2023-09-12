define(['test/howToMockModules/singletonWithStateSample'], function(Singleton) {

  'use strict';

  return {
    getName: function() {
      Singleton.setX('foobar');
      return "ModuleA: " + Singleton.getX();
    },
    getStringFromSingletonDependency: function() {
      return Singleton.getDepString();
    }
  };
});