define([
  'qowtRoot/commands/text/addQowtElementBase'], function(
    AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtHeader command.
     *
     * @param {Object} context
     * @param {String} contex.nodeId
     * @param {String} contex.parentId
     * @return {Object} addQowtHeader command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtHeader missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtHeader missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtHeader missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtHeader', context);

        /**
         * Sets the header id to section object
         * @override
         */
        api_.changeHtml = function() {
          var section = document.getElementById(context.parentId);
          if (section instanceof QowtSection) {
            section.headerId = context.nodeId;
          }
        };

        return api_;

      })();

    }

  };

  return factory_;

});
