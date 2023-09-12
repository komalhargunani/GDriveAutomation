/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command responsible for creating a new image and adding
 * it to the document.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/commands/text/addQowtElementBase',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
    AddQowtElementBase,
    PubSub,
    SelectionManager,
    WidowOrphanHelper) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtImage command and returns it.
     *
     * @param {Object} context
     * @param {String} context.nodeId Identifier for the new image.
     * @param {String} context.parentId Identifies the parent node for the new
     *                                 element.
     * @param {String | undefined} context.siblingId If defined, the insertion
     *                             will be performed immediately after this
     *                             node.
     * @param {String} context.src virtual path to the image data (e.g.
     *                             './img_E8.png').
     * @return {Object} addQowtImage command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtImage missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtImage missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtImage missing parentId');
      }
      if (!context.src) {
        throw new Error('addQowtImage missing src');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtImage', context);

        /**
         * Creates a image element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          WidowOrphanHelper.unbalanceNode(context.parentId);

          var imageElement = new QowtWordImage();
          imageElement.setEid(context.nodeId);
          imageElement.src = context.src;

          api_.insertElement_(imageElement, context.parentId,
              context.siblingId, context.optFunction);

          var drawing = imageElement.parentNode;
          if (SelectionManager.wasElmTheLastSelection(drawing)) {
            // deSelect the currently selected element if any.
            PubSub.publish('qowt:looseSelectionOverlay');
            _.isFunction(drawing.select) && drawing.select();
          }
        };

        return api_;

      })();

    }

  };

  return factory_;

});
