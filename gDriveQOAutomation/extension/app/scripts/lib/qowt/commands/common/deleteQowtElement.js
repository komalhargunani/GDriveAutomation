
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to remove textual elements from the html.
 * This will generate HTML mutations that will be turned into Core commands
 * by the TextTool.
 *
 * This command is generated through an Undo or Redo request from the user. It
 * is generated from the 'getInverse()' method of the relevant domMutation
 * command.
 *
 * Note this has no involvement in the 'normal flow' of a user entering text as
 * part of regular editing.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/tools/text/preEdit/widowOrphanHelper',
    'qowtRoot/models/env',
    'qowtRoot/commands/text/textCommandBase'
  ], function(
    WidowOrphanHelper,
    EnvModel,
    TextCmdBase) {

  'use strict';

  var _factory = {
    /**
     * Creates a new deleteNodes command and returns it.
     *
     * @param {Object} context
     * @param {String | undefined} context.nodeId
     * @param {String | undefined} context.parentId
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: deleteQowtElement cmd missing context');
      }

      // use module pattern for instance object
      var module = function() {
        // extend base command
        var _api = TextCmdBase.create('deleteQowtElement');

        /**
         * Optimistically append the given node to the correct target parent.
         * Note: this should only ever be called as part of a user-initiated
         * undo operation. In this context this command is required to reverse
         * the action of a prior delete command.
         * @override
         */
        _api.changeHtml = function() {

          function isNextParentElmTD(parent) {
             return parent.parentNode.nodeName === 'TD';
          }

          // Core Response of redo of delete section contains 'deleteNode'
          // command with node id of header/footer element. However qowt never
          // used node id of header/footer. 'deleteQowtElement' searches for
          // element with nodeId from context however it wont find any element
          // with nodeId of header/footer elements. Header/footer are the only
          // element whose id is not used, hence they need to be ignored here.
          if (context.nodeType !== 'headerType' &&
              context.nodeType !== 'footerType') {
            var node = document.getElementById(context.nodeId);
            if (node === null && context.optFunction) {
              node = context.optFunction(context.nodeId);
            }
            if (!node) {
              throw new Error('deleteQowtElement: failed to find node');
            }

            var parent = node.parentNode;
            if((parent.id === 'contents' && isNextParentElmTD(parent)) ||
              node.nodeName === 'TR') {
              parent = Polymer.dom(node).parentNode;
            }
            if (!(parent.isQowtElement) && node.nodeName === "QOWT-SECTION") {
              parent = parent.parentElement.closest('QOWT-PAGE');
            }
            if (!parent) {
              throw new Error('deleteQowtElement: failed to find parent');
            }

            WidowOrphanHelper.unbalanceNodes([node, parent]);

            // parent can have changed after unbalancing
            parent = node.parentNode;
            if((parent.id === 'contents' && isNextParentElmTD(parent)) ||
              node.nodeName === 'TR') {
              parent = Polymer.dom(node).parentNode;
            }
            if (!(parent.isQowtElement) && node.nodeName === "QOWT-SECTION") {
              parent = parent.parentElement.closest('QOWT-PAGE');
            }
            if (!parent) {
              throw new Error('deleteQowtElement: failed to find parent');
            }

            if(EnvModel.app === 'word') {
              Polymer.dom(parent).removeChild(node);
              Polymer.dom(parent).flush();
            } else {
              parent.removeChild(node);
            }
          }
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
