// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Content manager for Slide to handle operations
 * over slide.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/drawing/addShape',
  'qowtRoot/commands/drawing/addShapeInit',
  'qowtRoot/commands/drawing/insertSlideNote',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/geometry/objectDefaults',
  'qowtRoot/models/point',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    CommandManager,
    TransactionEndCmd,
    TransactionStartCmd,
    AddShapeCommand,
    AddShapeInitCommand,
    InsertSlideNoteCmd,
    UnitConversionUtils,
    ObjectDefaults,
    PointModel,
    PubSub,
    IdGenerator,
    SlidesContainer) {

  'use strict';

  var _contentType = 'slide', _actionSubscriptionToken,
      _disableSubscriptionToken, _shapeJson;

  var _shapeData, _slideNode;

  /**
   * Creates a transactional command and adds it to the command manager.
   * @param {Object} command - the command to be embedded in a transaction.
   *
   * @private
   */
  var _createAndAddTransactionalCommand = function(command) {
    if (command.callsService()) {
      var _rootCmd = TransactionStartCmd.create();
      _rootCmd.addChild(command);
      _rootCmd.addChild(TransactionEndCmd.create());
      CommandManager.addCommand(_rootCmd);
    } else {
      CommandManager.addCommand(command);
    }
  };

  /**
   * Handle all 'action' signals against qowt:doAction.
   * @param {String} event The name of the action signal received.
   * @param {Object} eventData The data associated with the signal.
   * @private
   */
  function _handleAction(event, eventData) {
    event = event || {};
    if (eventData.context && eventData.context.contentType &&
        eventData.context.contentType === _contentType) {

      switch (eventData.action) {
        case 'initAddShape':
          _createAndAddTransactionalCommand(_addShapeInit(eventData));
          break;
        case 'addShape':
          _createAndAddTransactionalCommand(_addShape(eventData.context));
          break;
        case 'insertSlideNote':
          _createAndAddTransactionalCommand(_addSlideNote(eventData.context));
          break;
        default:
          break;
      }
    }
  }

  /**
   * Creates addShape command
   * @param {Object} context  context info
   * @return {Object} add shape command
   *
   * @private
   */
  function _addShape(context) {
    var _dcpCommand, containerNumber;
    _dcpCommand = (context.command &&
        context.command.type && context.command.type === 'dcpCommand');
    var slideWidget = SlidesContainer.getCurrentSlideWidget();
    containerNumber = (slideWidget.getSlideIndex()) + 1;

    if (_dcpCommand && context.command.cn !== containerNumber) {
      _executeThumbnailSelection(context.command.cn - 1);
    }
    _slideNode = slideWidget.node();
    var layoutId = slideWidget.getLayoutId();
    if (layoutId) {
      PointModel.SlideLayoutId = layoutId;
    }
    if (!_dcpCommand) {
      _shapeData = context.command.sp;
      _shapeData.shapeId = slideWidget.generateShapeId();
      _modifyShapeJson(_shapeData);
      context.command.sp = _shapeJson;
    }
    return AddShapeCommand.create(context, slideWidget, containerNumber);
  }

  /**
   * Creates add shape init command.
   * @param {Object} eventData  event data for add shape
   * @private
   */
  function _addShapeInit(eventData) {
    return AddShapeInitCommand.create(eventData);
  }


  /**
   * Creates insert slide note command.
   * @param {Object} eventData  event data for insert slide note
   * @private
   */
  function _addSlideNote(eventData) {
    return InsertSlideNoteCmd.create(eventData);
  }

  /**
   * This method modifies the shape JSON object by converting the extends
   * and offsets in emu units also attaches the ID to it.
   * @param {Object} shapeData Shape's data including transforms in PX,
   *    preset ID and isTxtBox flag.
   * @private
   */
  var _modifyShapeJson = function(shapeData) {
    var _shapeEId, _textBodyId, _paraId, _endParaRprId, _textBody;
    _shapeEId = 'E-' + IdGenerator.getUniqueId();
    _textBodyId = 'E-' + IdGenerator.getUniqueId();
    _paraId = 'E-' + IdGenerator.getUniqueId();
    _endParaRprId = 'E-' + IdGenerator.getUniqueId();
    if (shapeData.isTxtBox) {
      _shapeJson = ObjectDefaults.getTextBoxDefaults();
    } else {
      _shapeJson = ObjectDefaults.getShapeDefaults(shapeData.prstId);
    }
    _modifyTransforms(shapeData.transforms);
    _shapeJson.eid = _shapeEId;
    _textBody = _shapeJson.elm[0];
    //First element of _shapeJson is text body
    _textBody.eid = _textBodyId;
    _textBody.elm[0].eid = _paraId;
    _textBody.elm[0].endParaRPr.eid = _endParaRprId;
    _shapeJson.spPr.xfrm = shapeData.transforms;
    _shapeJson.nvSpPr.shapeId = shapeData.shapeId;

  };
  /**
   * This method modifies the shape Data object by converting the extends
   * and offsets in emu units.
   * @param {Object} transforms Shape's transform in PX.
   * @private
   */
  var _modifyTransforms = function(transforms) {
    var convertPixelToEmu = UnitConversionUtils.convertPixelToEmu;
    transforms.ext.cx =
        convertPixelToEmu(parseInt(transforms.ext.cx, 10) /
            PointModel.currentZoomScale);
    transforms.ext.cy =
        convertPixelToEmu(parseInt(transforms.ext.cy, 10) /
            PointModel.currentZoomScale);
    transforms.off.x =
        convertPixelToEmu((parseInt(transforms.off.x, 10) -
            _slideNode.offsetLeft) /
            PointModel.currentZoomScale);
    transforms.off.y =
        convertPixelToEmu((parseInt(transforms.off.y, 10) -
            _slideNode.offsetTop) /
            PointModel.currentZoomScale);
  };

  /**
   * Resets the manager by un-subscribing to qowt events and resets the
   * subscription tokens
   * @private
   */
  function _disable() {
    PubSub.unsubscribe(_disableSubscriptionToken);
    PubSub.unsubscribe(_actionSubscriptionToken);

    _disableSubscriptionToken = undefined;
    _actionSubscriptionToken = undefined;
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

  var _api = {
    /**
     * Initializes the singleton slide content Manager. Subscribes to disable
     * and doAction qowt events.
     */
    init: function() {
      if (_disableSubscriptionToken) {
        throw new Error('slideContentManager.init() called multiple times.');
      }
      _disableSubscriptionToken = PubSub.subscribe('qowt:disable', _disable);
      _actionSubscriptionToken = PubSub.subscribe('qowt:doAction',
          _handleAction);
    }
  };

  return _api;
});
