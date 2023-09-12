/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Base class for adding a new QOWT element.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/commands/text/textCommandBase',
  'qowtRoot/utils/domUtils'], function(
  TextCmdBase,
  DomUtils) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtElementBase command and returns it.
     *
     * @param {String | undefined} cmdName command name.
     * @return {Object} addQowtElementBase command
     */
    create: function(cmdName) {

      cmdName = cmdName || 'addQowtElementBase';

      return (function() {

        var api_ = TextCmdBase.create(cmdName);

        /**
         * Inserts the element into the DOM.
         *
         * If the sibling is defined, then the element will be added
         * immediately afterwards, otherwise it will be added as the
         * first child of the parent element.
         *
         * It will "do the right thing" if the parent/sibling are
         * flowing content (eg it will unflow if needed, and find the
         * correct node within the flow to place the element)
         *
         * @param {HTMLElement} element the element to add to the DOM
         * @param {string} parentId the ID of the parent node
         * @param {string} opt_siblingId optionally the ID of the sibling node
         * @param {function} optFunction optional function to find node if
         *                  node is present in shadow dom
         */
        api_.insertElement_ = function(element, parentId, opt_siblingId,
                                       optFunction) {

          var sibling = opt_siblingId ? document.getElementById(opt_siblingId):
          null;

          var exclude = ['QOWT-FOOTER', 'QOWT-HEADER'];
          if(sibling && exclude.includes(sibling.nodeName)) {
             sibling = null;
          }

          if (opt_siblingId && sibling === null && optFunction) {
            sibling = optFunction(opt_siblingId);
          }
          if (sibling) {
            // make sure we put ourselves next to the "end node"
            // of the sibling's flow (if it had one)
            sibling = sibling.flowEnd ? sibling.flowEnd() : sibling;
            DomUtils.insertAfter(element, sibling);
          } else {
            // else place it as the first child of the parent
            var parent = document.getElementById(parentId);
            if (parent === null && optFunction) {
              parent = optFunction(parentId);
            }
            if (parent) {
              parent = parent.flowStart ? parent.flowStart() : parent;
              DomUtils.insertAtStart(element, parent /*reference node*/);
            } else {
              throw new Error('addQowtElementBase: failed to find parent');
            }
          }
        };

        return api_;

      })();

    }

  };

  return factory_;

});
