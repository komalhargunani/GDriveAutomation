define([
  'qowtRoot/commands/text/addQowtElementBase'], function(
    AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtFooterItem command.
     *
     * @param {Object} context
     * @param {String} contex.nodeId
     * @return {Object} addQowtFooterItem command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtFooterItem missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtFooterItem missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtFooterItem missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtFooterItem', context);

        /**
         * Sets 'qowt-eid' to footer item element
         * @override
         */
        api_.changeHtml = function() {
          var footerType = {
            'b': 'both',
            'e': 'even',
            'o': 'odd',
            'f': 'first-page'
          };

          var section = document.getElementById(context.parentId);
          var ftrItem = section &&
              section.getFooterItem(footerType[context.tp]);
          ftrItem.setAttribute('qowt-eid', context.nodeId);
          ftrItem.id = context.nodeId;
        };

        return api_;

      })();

    }

  };

  return factory_;

});
