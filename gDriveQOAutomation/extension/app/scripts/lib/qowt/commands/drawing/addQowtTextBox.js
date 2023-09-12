define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/commands/text/addQowtElementBase'], function(
  WidowOrphanHelper,
  AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtTextBox command and returns it.
     *
     * @param {Object} context
     * @return {Object} addQowtTextBox command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtTextBox missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtTextBox missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtTextBox missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtTextBox', context);

        /**
         * Creates the text box element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var newTextBox = new QowtTextBox();
          newTextBox.setEid(context.nodeId);
          newTextBox.setModel(context.formattingProperties);

          api_.insertElement_(newTextBox, context.parentId, context.siblingId,
              context.optFunction);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
