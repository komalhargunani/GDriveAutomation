// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview factory module to create mutation summary filters.
 * These can be used to iterate over the nodes inside
 * a Mutation Summary Library object, and return true for any nodes
 * which match the filter.
 *
 * A filter can consist of:
 *   - {string} type String to identify the type of mutation:
 *                   'added',
 *                   'deleted',
 *                   'moved',
 *                   'changed',
 *                   'format',
 *                   'attrib-id',
 *                   'attrib-style' (etc for attribute changes)
 *
 *   - {NodeType} nodeType identify which types of nodes the filter applies to
 *                         if not given, it will match all node types
 *                   ELEMENT_NODE,
 *                   TEXT_NODE
 *
 *   - {Array} nodeNames array of strings identifying what tagNames the filter
 *                      applies to. If not given, will match ALL nodeNames
 *                      eg ['P', 'SPAN', 'BR', '#text']
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/utils/nodeTagger'], function(
    NodeTagger) {

  'use strict';

  var _factory = {

    create: function(filter) {
      if (filter.type === undefined) {
        throw new Error('Error: can not create mutation filter without type');
      }
      if (filter.nodeType === Node.TEXT_NODE) {
        // default
        filter.nodeNames = ['#text'];
      }

      // use module pattern for instance object
      var module = function() {

        var _api = {

          /**
           * process a given node to see if it matches this filter
           *
           * @param {HTML Node} node the node to process
           * @param {array} typeRestriction optional array of types
           *                                to restrict the match to
           * @return {boolean} returns true if the node matches this filter
           */
          process: function(node, typeRestriction) {
            var match = false;
            var restricted = (typeRestriction !== undefined &&
                typeRestriction.indexOf(filter.type) === -1);

            if (!restricted && NodeTagger.hasTag(node, filter.type)) {

              var nodeTypeMatch = true;
              if (filter.nodeType !== undefined) {
                nodeTypeMatch = (filter.nodeType === undefined ||
                    filter.nodeType === node.nodeType);
              }

              var nameMatch = true;
              if (filter.nodeNames !== undefined) {
                nameMatch = (filter.nodeNames.indexOf(node.nodeName) !== -1);
              }

              match = nodeTypeMatch && nameMatch;
            }

            return match;
          }
        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

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
