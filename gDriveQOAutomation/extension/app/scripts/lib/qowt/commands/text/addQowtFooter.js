define([
  'qowtRoot/commands/text/addQowtElementBase'], function(
    AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtFooter command.
     *
     * @param {Object} context
     * @param {String} contex.nodeId
     * @param {String} contex.parentId
     * @return {Object} addQowtFooter command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtFooter missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtFooter missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtFooter missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtFooter', context);

        /**
         * Sets the footer id to section object
         * @override
         */
        api_.changeHtml = function() {
          var section = document.getElementById(context.parentId);
          if (section instanceof QowtSection) {
            section.footerId = context.nodeId;
          }
        };

        return api_;

      })();

    }

  };

  return factory_;

});
