define([
  'qowtRoot/commands/text/addQowtElementBase'], function(
    AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtHeaderItem command.
     *
     * @param {Object} context
     * @param {String} contex.nodeId
     * @return {Object} addQowtHeader command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtHeaderItem missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtHeaderItem missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtHeaderItem missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtHeaderItem', context);

        /**
         * Sets 'qowt-eid' to header item element
         * @override
         */
        api_.changeHtml = function() {
          var headerType = {
            'b': 'both',
            'e': 'even',
            'o': 'odd',
            'f': 'first-page'
          };

          var section = document.getElementById(context.parentId);
          var hdrItem = section &&
              section.getHeaderItem(headerType[context.tp]);
          hdrItem.setAttribute('qowt-eid', context.nodeId);
          hdrItem.id = context.nodeId;
        };

        return api_;

      })();

    }

  };

  return factory_;

});
