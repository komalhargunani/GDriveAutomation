define([
  'qowtRoot/media/insertMediaHandler'
], function(
    InsertMediaHandler) {
  'use strict';

  var factory_ = {
    create: function() {
      var module = function() {
        var api_ = InsertMediaHandler.create();
        api_.canMediaBeInserted = function() {
          // To be implemented.
        };

        api_.insertMedia = function() {
          // To be implemented.
        };
        return api_;
      };
      var instance = module;
      return instance;
    }
  };
  return factory_;
});
