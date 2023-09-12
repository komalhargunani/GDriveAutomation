// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview a mutation registry contains a set of handlers based
 * on given filters. It can process a mutation summary object by filtering
 * the mutations and invoking the handlers as needed
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/mutations/filter'], function(
    MutationFilter) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _api = {

          /**
           * register handler with an optional priority.
           * priority defaults to 100.
           * When processing nodes, lower priority order handlers
           * will run first (eg priority zero is TOP priority).
           * Same priority order will run at
           * first come first serve basis.
           *
           * @param {boolean} name argument for x y z
           */
          registerHandler: function(filterConfig, callback, priority) {
            if (priority === undefined) {
              priority = 100;
            }
            var filter = MutationFilter.create(filterConfig);
            if (callback &&
                filter &&
                filter.process &&
                typeof filter.process === 'function' &&
                typeof callback === 'function') {

              // use or create new array at this priority
              _handlers[priority] = _handlers[priority] || [];

              _handlers[priority].push({
                filter: filter,
                callback: callback
              });
            }
          },

          /**
           * Destroys all references.
           */
          destroy: function() {
            _handlers = {};
          },

          /**
           * iterate over the handlers in priority order, and
           * for those which filter includes the nodes, handle
           * the nodes.
           * NOTE: nodes can be an array of nodes, or a singular node
           *
           * @param {object} summary mutation summary object
           * @param {node|array} nodes one single node or an array of nodes
           * @param {array} filterRestriction array of filter restrictions
           */
          processNodes: function(summary, nodes, filterRestriction) {

            // if we got a single node, put it in a single element array
            if (!(nodes instanceof Array)) {
              nodes = [nodes];
            }

            // sort handlers on priority basis
            var priorities = Object.keys(_handlers);
            priorities = priorities.sort(function(a,b) {
              // keys are strings, so convert them to numbers to sort
              return parseInt(a,10) > parseInt(b,10);
            });


            nodes.forEach(function(node) {
              priorities.forEach(function(priority) {
                _handlers[priority].forEach(function(handler) {
                  if (handler.filter.process(node, filterRestriction)) {
                    handler.callback(summary, node);
                  }
                });
              });
            });
          }

        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

        var _handlers = {};

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
