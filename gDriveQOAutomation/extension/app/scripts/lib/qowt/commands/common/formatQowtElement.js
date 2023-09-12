/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview optimistic textual command to format a qowt element
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
    'qowtRoot/commands/text/textCommandBase',
    'qowtRoot/pubsub/pubsub'
  ], function (
    TextCmdBase,
    PubSub) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new formatQowtElement command and returns it.
     *
     * @param {Object} context
     * @param {String} context.formatting
     * @param {Number} context.eid
     * @param {Number} context.node
     * @returns {Object}
     */
    create: function(context) {
      // support old style formatting schema
      hackContext_(context);

      if (!context) {
        throw new Error('formatQowtElement missing context');
      }
      if (!context.formatting) {
        throw new Error('formatQowtElement missing formatting object');
      }
      if (!context.eid && !context.node) {
        throw new Error('formatQowtElement missing eid or node');
      }


      return (function() {

        var api_ = TextCmdBase.create('formatQowtElement', context);

        /**
         * Get the element to format (if it wasn't already given) and
         * decorate it with the context.formatting object
         * @override
         */
        api_.changeHtml = function() {
          // element's decorator mixins are smart enough to
          // decorate all nodes within a flow; so there is no
          // need to unflow here
          var node = context.node || document.getElementById(context.eid);
          if (node && node.isQowtElement && node.decorate) {
            node.decorate(context.formatting, context.synchronous);
          }
          if (node instanceof QowtDrawing) {
            node.select();
          }

          // Wait for the formatting changes to propagate before publishing.
          window.setTimeout(function() {
            PubSub.publish('qowt:formattingChanged', context);
          }, 0);
        };

        return api_;

      })();

    }

  };

  // TODO(jliebrand): remove once core supports .formatting objects
  // rather than ppr and del_ppr;
  function hackContext_(context) {
    if (context) {
      // For QW, run formatting data is stored in characterFormatting and para
      // model needs to be updated with rpr/del_rpr accordingly while undo/redo.
      var node = context.node || document.getElementById(context.eid);
      if (node && node instanceof QowtWordPara) {
        if (context.rpr) {
          if (!node.model.characterFormatting) {
            node.model.characterFormatting = {};
          }
          while (node) {
            _.extend(node.model.characterFormatting, context.rpr);
            node = node.flowInto;
          }
        } else if (context.del_rpr) {
          while (node) {
            node.model.characterFormatting =
                _.omit(node.model.characterFormatting, context.del_rpr);
            if (_.isEmpty(node.model.characterFormatting)) {
              delete node.model.characterFormatting;
            }
            node = node.flowInto;
          }
        }
      }

      context.formatting =
          context.formatting || context.ppr || context.rpr ||
          context.tableProperties || context.ropr || context.cpr ||
          context.ipr || context.dpr || context.sectpr || context.hdrpr ||
          context.ftrpr || {};

      var toDelete = []
          .concat(context.del_ppr || [])
          .concat(context.del_rpr || [])
          .concat(context.del_ipr || [])
          .concat(context.del_dpr || [])
          .concat(context.del_hdrpr || [])
          .concat(context.del_ftrpr || [])
          .concat(context.del_sectpr || []);

      for (var i = 0; i < toDelete.length; i++) {
        // add each formatting property that we should
        // remove as an undefined in the formatting object
        context.formatting[toDelete[i]] = undefined;
      }
      delete context.ppr;
      delete context.rpr;
      delete context.ipr;
      delete context.dpr;
      delete context.tableProperties;
      delete context.ropr;
      delete context.cpr;
      delete context.del_ppr;
      delete context.del_rpr;
      delete context.del_ipr;
      delete context.del_dpr;
      delete context.sectpr;
      delete context.hdrpr;
      delete context.ftrpr;
    }
  }

  return factory_;

});
