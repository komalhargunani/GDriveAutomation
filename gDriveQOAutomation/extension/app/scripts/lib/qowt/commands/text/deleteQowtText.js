// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to delete text from an existing HTML element.
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
  'qowtRoot/commands/text/textCommandBase'
], function(
  TextCmdBase) {

  'use strict';

  var _factory = {
    /**
     * Creates a new deleteQowtText command and returns it.
     *
     * @param {Object} context
     * @param {String} context.spanId
     * @param {Number} context.offset
     * @param {Number} context.length
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: delete qowt text cmd missing context');
      }
      if (context.spanId === undefined) {
        throw new Error('Error: delete qowt text cmd missing spanId');
      }
      if (context.offset === undefined) {
        throw new Error('Error: delete qowt text cmd missing offset');
      }
      if (context.length === undefined) {
        throw new Error('Error: delete qowt text cmd missing length');
      }

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true, callsService==true)
        var _api = TextCmdBase.create('deleteQowtText');

        /**
         * Optimistically delete the specified text from the html.
         * Note: this should only ever be called as part of a user-initiated
         * undo operation. In this context this command is required to reverse
         * the action of a prior insertText command.
         * @override
         */
        _api.changeHtml = function() {
          // note: no need to unflow/unbalance; the qowt-run element
          // supports removing text while being flowed
          var run = document.getElementById(context.spanId);
          if (run === null && context.optFunction) {
            run = context.optFunction(context.spanId);
          }
          if (run instanceof QowtWordRun || run instanceof QowtPointRun) {
            run.removeText(
              context.offset, context.length, {
                moveCaret: true,
                bringIntoView: true
              }
            );
          } else {
            throw new Error('deleteQowtText error: node is not a QowtRun!');
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