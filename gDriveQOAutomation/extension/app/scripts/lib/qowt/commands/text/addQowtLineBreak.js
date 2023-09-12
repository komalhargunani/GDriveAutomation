/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command responsible for creating a new line break and
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
     * Creates a new addQowtLineBreak command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId Identifier for the new line break.
     * @param {String} contex.parentId Identifies the parent for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtLineBreak command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtLineBreak missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtLineBreak missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtLineBreak missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtLineBreak', context);

        /**
         * Creates the line break element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var lineBreak = new QowtLineBreak();
          lineBreak.setEid(context.nodeId);
          lineBreak.model.btp = context.btp;
          api_.insertElement_(lineBreak, context.parentId, context.siblingId);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
