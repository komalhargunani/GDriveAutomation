// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This command modifies shape fill optimistically through
 * changeHtml. Same command is used for undo operation driven from service.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/point/pointEditError',
  'qowtRoot/models/point',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/utils/objectUtils'
], function(
    EditCommandBase,
    PubSub,
    ShapeEditError,
    PointModel,
    ShapeWidget,
    PlaceHolderPropertiesManager,
    SlidesContainer,
    ObjectUtils) {

  'use strict';

  var factory_ = {

    create: function(context) {

      // don't try to execute if it's missing mandatory data.
      if (context === undefined) {
        throw new Error('Error: modify shape fill cmd missing context');
      }
      if (context.command === undefined) {
        throw new Error('Error: modify shape fill cmd missing command');
      }
      if (context.command.eid === undefined) {
        throw new Error('Error: modify shape fill cmd missing eid');
      }
      if (context.command.sn === undefined) {
        throw new Error('Error: modify shape fill cmd missing slide number');
      }
      // TODO (rahul.tarafdar): this needs to be a part of EditCommandBase.
      // EditCommandBase should be able to abstract this logic in its
      // framework
      // extend default command (optimistic==true, callsService==true)
      var callsService = true;
      if (context.command.type === 'dcpCommand') {
        callsService = false;
      }

      var api_ = EditCommandBase.create('modShapeFill', true, callsService);

      var payLoadFill_ = context.command.fill;

      var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
      var currentSlideIndex = currentSlideWidget.getSlideIndex();

      // This if block will be executed in case of undo operation.
      // For example, if user edits a shape on some slide and go to other
      // slide. Before an undo operation, the slide(on which undo operation
      // being performed) must be selected.
      if (context.command.sn !== currentSlideIndex + 1) {
        _executeThumbnailSelection(context.command.sn - 1);
      }

      var shapeWidget_ = ShapeWidget.create({fromId: context.command.eid});
      if (!shapeWidget_) {
        throw new Error('Error: modify shape fill cmd shape widget is' +
            ' undefined');
      }

      var objectUtils_ = new ObjectUtils(),
          originalFill_ = objectUtils_.clone(shapeWidget_.getFill());

      // Create dcpData only if its a user operation and command needs to be
      // sent to Core.
      // TODO (rahul.tarafdar): this needs to be a part of EditCommandBase.
      // EditCommandBase should be able to abstract this logic in its
      // framework - similar to abstraction of onSuccess() and doOptimistic()
      // in changeHtml()

      if (context.command.type !== 'dcpCommand') {
        /**
         * Revert the action of changeHtml.
         * Invoked when a command has failed and the command queue
         * has been invalidated.
         * This is necessary to ensure the HTML remains in sync with the DOM.
         */
        api_.doRevert = function() {
          shapeWidget_.setFill(originalFill_);
        };

        /**
         * DCP JSON for modify shape fill command
         *
         * @return {Object} The JSON Payload to send to the dcp service.
         * {string} name: 'modTrfm' The op.code.
         * {string} eid: The id to use for the new element.
         * {string} fill: The new fill of the shape.
         * {string} sn: current slide number.
         */
        api_.dcpData = function() {
          return context.command;
        };
      } else {
        // If its a Core generated command then the operation has already been
        // performed on Core so doRevert should not be defined.
        api_.doRevert = undefined;
      }
      /**
       * Optimistically update fills of node.
       */
      api_.changeHtml = function() {

        var shapeJson = shapeWidget_.getJson();
        shapeWidget_.updatePlaceholderProperties();

        if (!payLoadFill_) {
          // For placeholder shapes, fill properties are not available at
          // core side, so we have to retrieve and apply it through cascading.
          if (!shapeWidget_.isPlaceholderShape()) {
            delete shapeJson.spPr.fill;
          } else {
            if (!currentSlideWidget) {
              return;
            }

            var layoutId = currentSlideWidget.getLayoutId();
            if (layoutId) {
              PointModel.SlideLayoutId = layoutId;
            }

            var resolvedSpPr =
                PlaceHolderPropertiesManager.getResolvedShapeProperties();

            if (resolvedSpPr && resolvedSpPr.fill) {
              // get local copy of resolved shape properties
              var localResolvedSpPr = objectUtils_.clone(resolvedSpPr);
              payLoadFill_ = localResolvedSpPr.fill;
            }
            if (!resolvedSpPr.fill) {
              delete shapeJson.spPr.fill;
              shapeJson.spPr.fill = {};
            }
          }
        } else {
          //This check ensures that fill object to be created if not exists
          //in cached shapeJson, before applying fill using setFill.
          if (!shapeJson.spPr.fill) {
            shapeJson.spPr.fill = {};
          }
        }
        shapeWidget_.setFill(payLoadFill_);
      };

      /**
       * Handles DCP failures.
       */
      api_.onFailure = function() {
        console.error('modify_shape_fill_error');
        var error = ShapeEditError.create('modify_shape_fill_error', false);
        PubSub.publish('qowt:error', error);
      };

      /**
       * Publish selection events for thumbnail.
       * @param {Number} index index of thumbnail to be selected
       * @private
       */
      function _executeThumbnailSelection(index) {
        var _contextData = {
          action: 'slideSelect',
          context: {
            contentType: 'slideManagement',
            index: index
          }
        };
        PubSub.publish('qowt:doAction', _contextData);
      }

      return api_;
    }
  };
  return factory_;
});
