/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command responsible for creating a new table cell
 * and adding it to the document.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/commands/text/addQowtElementBase'], function(
  WidowOrphanHelper,
  AddQowtElementBase) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtTableCell command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId Identifier for the new table cell.
     * @param {String} contex.parentId Identifies the parent node for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtTableCell command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtTableCell missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtTableCell missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtTableCell missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtTableCell', context);

        /**
         * Creates a table cell element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var tableCell = new QowtTableCell();
          tableCell.setEid(context.nodeId);

          api_.insertElement_(tableCell, context.parentId, context.siblingId,
              context.optFunction);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
