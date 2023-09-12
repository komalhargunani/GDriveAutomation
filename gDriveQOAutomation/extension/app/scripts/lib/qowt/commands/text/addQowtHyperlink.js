/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command to create a new hyperlink.
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
     * Creates a new addQowtHyperlink command and returns it.
     *
     * @param {Object} context
     * @param {String} contex.nodeId Identifier for the new hyperlink.
     * @param {String} contex.target Hyperlink target (e.g.
     *                               http://www.google.com)
     * @param {String} contex.parentId Identifies the parent node for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @return {Object} addQowtHyperlink command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtHyperlink missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtHyperlink missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtHyperlink missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtHyperlink', context);

        /**
         * Creates a hyperlink element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var hyperlinkElement = new QowtHyperlink();
          hyperlinkElement.setEid(context.nodeId);
          hyperlinkElement.lnk = context.target;

          api_.insertElement_(hyperlinkElement, context.parentId,
              context.siblingId, context.optFunction);
        };

        return api_;
      })();

    }

  };

  return factory_;

});
