define([
  'qowtRoot/media/insertMediaHandler'
], function(
    InsertAudioHandler) {
  'use strict';

  var factory_ = {
    create: function() {
      var module = function() {
        var api_ = InsertAudioHandler.create();
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
