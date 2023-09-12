
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview A generic factory for text commands. These are all
 * optimistic-only commands that poke the html triggering mutations. The effect
 * of these commands is undoable.
 *
 * See https://go/qowt-text-undo for the details.
 *
 * Instances of these objects are created from 2 flows...
 *   (1) normal content-editable mechanics whose action is invertible, and...
 *   (2) the inverse commands that apply the 'undo'.
 *
 * This latter type should not cause the text tool to generate additional undo
 * frames.
 *
 * This base class must be instantiated by an extending object. It is not
 * directly usable.
 *
 * Clients must...
 * (1) implement _api.changeHtml() as a function which acts upon the
 *     HTML to acheive the desired result.
 * (2) _not_ supply any getInverse(). This base object sets the correct inverse.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/commands/commandBase',
    'qowtRoot/events/errors/textualEditError',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/selection/helpers/textHelper'
  ], function(
    CommandBase,
    TextualEditError,
    PubSub,
    TextSelectionHelper
  ) {

  'use strict';

  var _factory = {
    /**
     * Creates an object instance and return it.
     *
     * @param {String} opt_name Optional command name.
     * @returns {Object} A new base command object.
     */
    create: function(opt_name) {

      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true, callsService==false)
        opt_name = opt_name || 'txtCmdBase';
        var _api = CommandBase.create(opt_name, true, false);

        // Provide a doOptimistic that cannot be overwritten/deleted.
        Object.defineProperty(_api, 'doOptimistic', {
            value: _doOptimistic,
            writable: false});

        _api.changeHtml = function() {
          // This method must be overrideen in extending objects.
          throw new Error('textCommandBase changeHtml() was not overridden');
        };


        // vvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        function _doOptimistic() {
          // Modify the html.
          _api.changeHtml();

          var helper = new TextSelectionHelper();
          helper.fixupInvalidCaret();
        }

        /**
         * Utility method used by specialisations to indicate if there was an
         * error situation during a part of the edit.
         *
         * @param {String} message
         */
        _api.error = function(message) {
          console.error(_api.name + ': ' + message);
          // publish fatal error
          var error = TextualEditError.create();
          PubSub.publish('qowt:error', error);
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
