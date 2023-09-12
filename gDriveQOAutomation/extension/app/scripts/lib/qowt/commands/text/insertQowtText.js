
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to insert text into an existing HTML element.
 * This will generate HTML mutations that will be turned into Core commands
 * by the TextTool.
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
     * Creates a new insertQowtText command and returns it.
     *
     * @param {Object} context
     * @param {String} context.spanId
     * @param {Number} context.offset
     * @param {String} context.text
     * @returns {Object}
     */
    create: function(context) {
      // don't try to execute if it's missing crucial data
      if (context === undefined) {
        throw new Error('Error: insert qowt text cmd missing context');
      }
      if (context.spanId === undefined) {
        throw new Error('Error: insert qowt text cmd missing spanId');
      }
      if (context.offset === undefined) {
        throw new Error('Error: insert qowt text cmd missing offset');
      }
      if (context.text === undefined) {
        throw new Error('Error: insert qowt text cmd missing text');
      }

      // use module pattern for instance object
      var module = function() {
        // extend base command
        var _api = TextCmdBase.create('insertQowtText');

        /**
         * Optimistically insert the specified text into the html.
         * Note: this should only ever be called as part of a user-initiated
         * undo operation. In this context this command is required to reverse
         * the action of a prior deleteText command.
         * @override
         */
        _api.changeHtml = function() {
          context.spanId = context.spanId;
          // note: no need to unflow/unbalance; the qowt-run element
          // supports removing text while being flowed
          var run = document.getElementById(context.spanId);
          if (run === null && context.optFunction) {
            run = context.optFunction(context.spanId);
          }
          if (run instanceof QowtWordRun || run instanceof QowtPointRun) {
            run.insertText(
              context.offset, context.text, {
                moveCaret: true,
                bringIntoView: true
            }
            );
          } else {
            throw new Error('insertQowtText error: node is not a QowtRun!');
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
