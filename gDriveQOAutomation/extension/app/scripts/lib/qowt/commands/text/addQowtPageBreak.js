/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command responsible for creating a new page break and
 * adding it to the document.
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
     * Creates a new addQowtPageBreak command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId Identifier for the new page break.
     * @param {String} contex.parentId Identifies the parent for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtPageBreak command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtPageBreak missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtPageBreak missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtPageBreak missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtPageBreak', context);

        /**
         * Creates the page break element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var pageBreak = new QowtPageBreak();
          pageBreak.setEid(context.nodeId);

          api_.insertElement_(pageBreak, context.parentId, context.siblingId);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
