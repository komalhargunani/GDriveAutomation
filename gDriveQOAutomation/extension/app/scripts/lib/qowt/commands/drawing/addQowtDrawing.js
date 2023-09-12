define([
  'qowtRoot/commands/text/addQowtElementBase',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
    AddQowtElementBase,
    WidowOrphanHelper) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtDrawing command and returns it.
     *
     * @param {Object} context - Contextual data for the addQowtDrawing to use
     * @param {String} context.nodeId - Identifier for the new Drawing element.
     * @param {String} context.parentId - Identifies the parent node for the new
     *                                 element.
     * @param {String | undefined} context.siblingId - If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtDrawing command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtDrawing missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtDrawing missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtDrawing missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtDrawing', context);

        /**
         * Creates the drawing element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var newDrawing = new QowtDrawing();
          newDrawing.setEid(context.nodeId);
          newDrawing.setModel(context.layoutProperties);
          api_.insertElement_(newDrawing, context.parentId, context.siblingId,
              context.optFunction);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
