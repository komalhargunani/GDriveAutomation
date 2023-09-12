define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/commands/text/addQowtElementBase'], function(
    WidowOrphanHelper,
    AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtColumnBreak command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId Identifier for the new line break.
     * @param {String} contex.parentId Identifies the parent for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtColumnBreak command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtColumnBreak missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtColumnBreak missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtColumnBreak missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtColumnBreak', context);

        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var columnBreak = new QowtColumnBreak();
          columnBreak.setEid(context.nodeId);

          api_.insertElement_(columnBreak, context.parentId, context.siblingId);
        };

        return api_;
      })();
    }
  };

  return factory_;

});
