// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This command modifies shape transforms optimistically through
 * changeHtml. Same command is used for undo operation driven from service.
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/point/pointEditError',
  'qowtRoot/models/point',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/utils/objectUtils',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    EditCommandBase,
    PubSub,
    ShapeEditError,
    PointModel,
    ShapeWidget,
    PlaceHolderPropertiesManager,
    ObjectUtils,
    PlaceHolderManager,
    SlidesContainer) {

  'use strict';

  var _factory = {

    create: function(context) {

      // don't try to execute if it's missing mandatory data.
      if (context === undefined) {
        throw new Error('Modify shape transform cmd missing context');
      }
      if (context.command === undefined) {
        throw new Error('Modify shape transform cmd missing command');
      }
      if (context.command.eid === undefined) {
        throw new Error('Modify shape transform cmd missing eid');
      }
      if (context.command.sn === undefined) {
        throw new Error('Modify shape transform cmd missing slide number');
      }

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==true)
        var callsService = true;
        if (context.command.type === 'dcpCommand') {
          callsService = false;
        }

        var _api = EditCommandBase.create('modTrfm', true, callsService);

        var _payLoadTransform = context.command.xfrm;

        var currentSlideWidget = SlidesContainer.getCurrentSlideWidget();
        var currentSlideIndex = currentSlideWidget.getSlideIndex();

        // This if block will be executed in case of undo operation.
        // For example, if user moved a shape from slide 1 and go to other
        // slide and press undo key. In this case to perform undo operation,
        // we need to set slide on which we need to do undo operation. Once
        // slide set, will update shape widget with new context and perform
        // move operation with new context.
        if (context.command.sn !== currentSlideIndex + 1) {
          _executeThumbnailSelection(context.command.sn - 1);
        }

        var _shapeWidget = ShapeWidget.create({fromId: context.command.eid});
        if (!_shapeWidget) {
          return;
        }

        var _objectUtils = new ObjectUtils(),
            _originalTransforms = _shapeWidget.getTransforms();

        if (context.command.type !== 'dcpCommand') {
          /**
           * Revert the action of changeHtml.
           * Invoked when a command has failed and the command queue
           * has been invalidated.
           * This is necessary to ensure the HTML remains in sync with the DOM.
           */
          _api.doRevert = function() {
            _shapeWidget.setTransforms(_originalTransforms);
          };

          /**
           * DCP JSON for modify shape transform command
           *
           * @return {Object} The JSON Payload to send to the dcp service.
           * {string} name: 'modTrfm' The op.code.
           * {string} eid: The id to use for the new element.
           * {string} xfrm: The new transform of the shape.
           * {string} sn: current slide number.
           */
          _api.dcpData = function() {
            return context.command;
          };
        } else {
          // If its a Core generated command then the operation has already been
          // performed on Core so doRevert should not be defined.
          _api.doRevert = undefined;
        }
        /**
         * Optimistically update transforms of node.
         */
        _api.changeHtml = function() {

          if (!_payLoadTransform) {
            // For placeholder shapes, xfrm properties are not available at
            // core side, so we have to retrieve and apply it through cascading.

            if (currentSlideWidget) {
              var layoutId = currentSlideWidget.getLayoutId();
              if (layoutId) {
                PointModel.SlideLayoutId = layoutId;
              }

              PlaceHolderManager.updateCurrentPlaceHolderForShape(
                  _shapeWidget.getPlaceholderType(),
                  _shapeWidget.getPlaceholderIndex());
              var resolvedSpPr =
                  PlaceHolderPropertiesManager.getResolvedShapeProperties();

              if (resolvedSpPr && resolvedSpPr.xfrm) {
                // get local copy of resolved shape properties
                var localResolvedSpPr = _objectUtils.clone(resolvedSpPr);
                _payLoadTransform = localResolvedSpPr.xfrm;
              }
            }
          }
          if (_payLoadTransform) {
            _shapeWidget.setTransforms(_payLoadTransform);
          }
        };

        /**
         * Handles DCP failures.
         */
        _api.onFailure = function() {
          _error('modify_shape_transform_error');
        };

        /**
         * Publishes error
         * @param {string} errorId error info
         * @private
         */
        function _error(errorId) {
          console.error(errorId);
          var error = ShapeEditError.create(errorId, false);
          PubSub.publish('qowt:error', error);
        }

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
