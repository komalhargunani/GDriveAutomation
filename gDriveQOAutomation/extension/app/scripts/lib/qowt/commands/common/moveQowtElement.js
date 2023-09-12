
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to reparent nodes in the  HTML document.
 * This will generate HTML mutations that will be turned into Core commands
 * by the TextTool.
 *
 * Note this has no involvement in the 'normal flow' of a user entering text as
 * part of regular editing.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/tools/text/preEdit/widowOrphanHelper',
    'qowtRoot/commands/text/textCommandBase',
    'qowtRoot/utils/domUtils'
  ], function(
    WidowOrphanHelper,
    TextCmdBase,
    DomUtils
  ) {

  'use strict';

  var _factory = {
    /**
     * Creates a new moveQowtElement command and returns it.
     *
     * @param {Object} context
     * @param {String} context.nodeId Id of the element to be moved.
     * @param {String} context.parentId Id of the new parent.
     * @param {String | undefined} context.siblingId identifies the left
     *                             sibling id (if defined).
     * @returns {Object} moveQowtElement command.
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: moveQowtElement cmd missing context');
      }
      if (context.nodeId === undefined) {
        throw new Error('Error: moveQowtElement cmd missing nodeId');
      }
      if (context.parentId === undefined) {
        throw new Error('Error: moveQowtElement cmd missing parentId');
      }
      // use module pattern for instance object
      var module = function() {
        // extend base command
        var _api = TextCmdBase.create('moveQowtElement');

        /**
         * Optimistically reparent the specified elements.
         * Note: this should only ever be called as part of a user-initiated
         * undo operation. In this context this command is required to reverse
         * the action of a prior deleteText command.
         * @override
         */
        _api.changeHtml = function() {
          WidowOrphanHelper.unbalanceNodes([context.nodeId, context.parentId]);
          if (context.siblingId) {
            WidowOrphanHelper.unbalanceNode(context.siblingId);
          }

          var node = document.getElementById(context.nodeId);
          if (!node) {
            _api.error('moveQowtElement failed to changeHtml - cant find node');
          } else {
            var newParent = document.getElementById(context.parentId);
            if (!newParent) {
              _api.error('moveQowtElement failed - ' +
                         'can not find new parent node: ' + context.parentId);
            } else {
              if (context.siblingId) {
                var sibling = document.getElementById(context.siblingId);
                if (!sibling) {
                  _api.error('moveQowtElement failed - ' +
                             'can not find new sibling: ' + context.siblingId);
                } else {
                  DomUtils.insertAfter(node, sibling);
                }
              } else {
                // no sibling so put it back at the start of the newParent
                DomUtils.insertAtStart(node, newParent);
              }
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
