// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Manages undo and redo stacks for QOWT.
 *
 * TODO(ganetsky): Implement composing undo commands together into bigger units
 *     based on heuristics for a better user experience. As in, how many
 *     keystrokes does a user want undone whenever they hit the undo key.
 *
 * @author Jason Ganetsky (ganetsky@google.com)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/utils/typeUtils'], function(
  PubSub,
  PromiseUtils,
  TypeUtils) {

  'use strict';

  var api_ = {

    /**
     * Pushes the inverse of the passed-in command onto the undo stack.
     * @param {Object} undo The command pushed onto the undo stack.
     */
    pushUndo: function(undo) {
      TypeUtils.checkArgTypes('UndoManager.pushUndo', {
        undo: [undo, 'promiseLike', 'queueableCommand']
      });
      pushStack_(undoStack_, undo);
      clearStack_(redoStack_);
    },

    /**
     * Pops the last command off the undo stack. Pushes the inverse of the
     * inverse onto the redo stack. Execute the returned command to undo the
     * last command.
     * @return {Object} The last command on the undo stack,
     *         or undefined if the stack is empty.
     *         It may return a future of a command.
     */
    popUndo: function() {
      var undo = popStack_(undoStack_);
      if (undo) {
        pushStack_(redoStack_, getInverse_(undo));
        return undo;
      }
    },

    /**
     * Pops the last command off the redo stack. Execute the returned command
     * to redo the last undone command.
     * @return {Object} The last command on the undo stack,
     *         or undefined if the stack is empty.
     *         It may return a future of a command.
     */
    popRedo: function() {
      var redo = popStack_(redoStack_);
      if (redo) {
        pushStack_(undoStack_, getInverse_(redo));
        return redo;
      }
    },

    /**
     * @return {Boolean} Whether the undo stack is empty.
     */
    isUndoEmpty: function() {
      return undoStack_.length === 0;
    },

    /**
     * @return {Boolean} Whether the redo stack is empty.
     */
    isRedoEmpty: function() {
      return redoStack_.length === 0;
    },

    /**
     * Resets the undo and redo stacks to empty.
     */
    reset: function() {
      clearStack_(redoStack_);
      clearStack_(undoStack_);
    }

  };

  // PRIVATE ===================================================================

  var undoStack_ = [];
  var redoStack_ = [];
  undoStack_.name = 'undo';
  redoStack_.name = 'redo';

  var getInverse_ = function(commandPromise) {
    function doGetInverse_(command) {
      if (!command.hasInverse()) {
        throw new Error('Command ' + command.toString() + ' came from the' +
            ' undo/redo stack, but was not invertible.');
      }
      return command.getInverse();
    }
    return TypeUtils.isPromiseLike(commandPromise) ?
        PromiseUtils.cast(commandPromise).then(doGetInverse_) :
        doGetInverse_(commandPromise);
  };

  var clearStack_ = function(stack) {
    if (stack.length > 0) {
      stack.splice(0, stack.length);
      publishStackEvent_(stack, false);
    }
  };

  var popStack_ = function(stack) {
    if (stack.length > 0) {
      var top = stack.pop();
      publishStackEvent_(stack, false);
      return top;
    }
  };

  var pushStack_ = function(stack, command) {
    stack.push(command);
    publishStackEvent_(stack, true);
  };

  var publishStackEvent_ = function(stack, increased) {
    if (increased && (stack.length === 1)) {
      PubSub.publish('qowt:' + stack.name + 'NonEmpty');
    }
    if (!increased && (stack.length === 0)) {
      PubSub.publish('qowt:' + stack.name + 'Empty');
    }
  };

  return api_;

});