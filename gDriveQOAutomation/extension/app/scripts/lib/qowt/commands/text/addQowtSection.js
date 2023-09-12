define([
  'qowtRoot/commands/text/addQowtElementBase',
  'qowtRoot/utils/domUtils'
], function(
    AddQowtElementBase,
    DomUtils) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtSection command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId
     * @param {String} contex.parentId
     * @param {String | undefined} context.siblingId
     * @return {Object} addQowtSection command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtSection missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtSection missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtSection missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtSection', context);

        /**
         * Creates the section element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          var section = new QowtSection();
          section.setEid(context.nodeId);

          if (context.siblingId) {
            api_.insertElement_(section, context.parentId, context.siblingId);
          } else {
            // For some document when we do select all and delete, all the
            // sections except the last one is getting deleted. In undo
            // response, sibling id is missing for each section. So in this
            // case, section will add as first child of page.
            var pages = document.querySelectorAll('qowt-page');
            DomUtils.insertAtStart(section, pages[0] /*reference node*/);
          }
        };

        return api_;
      })();
    }

  };

  return factory_;

});
