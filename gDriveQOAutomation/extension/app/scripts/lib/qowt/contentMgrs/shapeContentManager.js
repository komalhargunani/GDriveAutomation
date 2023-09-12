// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Content manager for Shape to handle purely optimistic
 * shape edits.
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/commands/commandManager',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/commands/drawing/formatObject',
  'qowtRoot/commands/drawing/modifyShapeFill',
  'qowtRoot/commands/quickpoint/modifyShapeTransform',
  'qowtRoot/commands/drawing/deleteShape'
], function(
    PubSub,
    ShapeWidget,
    CommandManager,
    SlidesContainer,
    TransactionStartCmd,
    TransactionEndCmd,
    FormatObjectCommand,
    ModifyShapeFillCommand,
    ModifyShapeTransformCommand,
    DeleteShapeCommand) {

  'use strict';

  // vvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv
  var _contentType = 'shape',
      _actionSubscriptionToken,
      _disableSubscriptionToken,
      _slideShowStarted,
      _slideShowStopped;

  /**
   * Creates a transactional command and adds it to the command manager if it
   * is to be sent to service, otherwise add the command as is to the command
   * manager.
   * @param {Object} command - the command to be embedded in a transaction.
   *
   * @private
   */
  var _createAndAddTransactionalCommand = function(command) {
    // Notice the arguments of cmdName = 'txStart', optimistic = false,
    // callsService = true which are default values for transactionStart command
    // and the last parameter opt_includeContext = true is required to set the
    // context in payload JSON. The context is required for Undo operation.

    if (command.callsService()) {
      var _rootCmd = TransactionStartCmd.create('txStart', false, true, true);
      _rootCmd.addChild(command);
      _rootCmd.addChild(TransactionEndCmd.create());
      CommandManager.addCommand(_rootCmd);
    } else {
      CommandManager.addCommand(command);
    }
  };

  /**
   * Handle all 'action' signals.
   * @private
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   */
  function _handleAction(eventType, eventData) {
    eventType = eventType || '';
    var context = eventData.context;
    if (context && context.contentType &&
        context.contentType === _contentType) {

      var config;
      if (context.node) {
        config = {
          fromNode: context.node
        };
      } else if (context.command && context.command.eid) {
        config = {
          fromId: context.command.eid
        };
      }
      var shapeWidget = ShapeWidget.create(config);

      switch (eventData.action) {
        case 'select':
          shapeWidget.select();
          break;

        case 'deselect':
          shapeWidget.deselect();
          break;

        case 'modifyTransform':
          _createAndAddTransactionalCommand(_modifyTransform(context));
          break;

        case 'modifyShapeFillColor':
          _createAndAddTransactionalCommand(_modifyShapeFillColor(context));
          break;

        case 'deleteShape':
          _createAndAddTransactionalCommand(_deleteShape(context));
          break;

        case 'formatObject':
          _createAndAddTransactionalCommand(_formatObject(context));
          break;

        default:
          break;
      }
    }
  }

  /**
   * Creates shapeDelete command
   * @param {object} context context info
   * @private
   */
  function _deleteShape(context) {
    var slideWidget, containerNumber, dcpCommand;
    dcpCommand = (context.command.type &&
        context.command.type === 'dcpCommand');
    slideWidget = SlidesContainer.getCurrentSlideWidget();
    containerNumber = (slideWidget.getSlideIndex()) + 1;
    if (dcpCommand && context.command.cn !== containerNumber) {
      _executeThumbnailSelection(context.command.cn - 1);
    }
    return DeleteShapeCommand.create(context, slideWidget, containerNumber);
  }

  /**
   * Creates modifyTransform command
   * @param {JSON} context context info
   * @return {Object} modifyTransform command
   *
   * @private
   */
  function _modifyTransform(context) {
    return ModifyShapeTransformCommand.create(context);
  }


  /**
   * Creates modifyShapeFill Command
   * @param {JSON} context context info
   * @return {Object} modifyShapeFill Command
   *
   * @private
   */
  function _modifyShapeFillColor(context) {
    return ModifyShapeFillCommand.create(context);
  }

  /**
   * Creates formatObject Command
   * @param {Object} context context info
   * @return {Object} formatObject Command
   * @private
   */
  function _formatObject(context) {
    return FormatObjectCommand.create(context);
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


  /**
   * disables the manager by un-subscribing to qowt events and disables the
   * subscription tokens
   */
  var _disable = function() {
    PubSub.unsubscribe(_disableSubscriptionToken);
    PubSub.unsubscribe(_actionSubscriptionToken);
    PubSub.unsubscribe(_slideShowStarted);
    PubSub.unsubscribe(_slideShowStopped);

    _disableSubscriptionToken = undefined;
    _actionSubscriptionToken = undefined;
    _slideShowStarted = undefined;
    _slideShowStopped = undefined;
  };

  /**
   * Hides current selection
   * @private
   */
  var _hideSelection = function() {
    // if shape is selected and user enter into slide show mode then we need
    // to deselect shape.
    PubSub.publish('qowt:clearSlideSelection');
  };

  /**
   * Shows hidden selection
   * @private
   */
  var _restoreSelection = function() {
    // if shape is deselected before entering into slide show mode then while
    // exiting from slide show mode we need to again show shape selected.

    // TODO(elqursh): Find a way to restore selection after exiting slide show
    // mode.
  };

  // vvvvvvvvvvvvvvvvvvvvvvv PUBLIC vvvvvvvvvvvvvvvvvvvvvvv

  var _api = {
    /**
     * Initializes the singleton shape content Manager. Subscribes to disable
     * and doAction qowt events.
     */
    init: function() {
      if (_disableSubscriptionToken) {
        throw new Error('shapeContentManager.init() called multiple times.');
      }

      _disableSubscriptionToken = PubSub.subscribe('qowt:disable', _disable);
      _actionSubscriptionToken = PubSub.subscribe('qowt:doAction',
          _handleAction);
      _slideShowStarted = PubSub.subscribe('qowt:slideShowStarted',
          _hideSelection);
      _slideShowStopped = PubSub.subscribe('qowt:slideShowStopped',
          _restoreSelection);
    }
  };

  return _api;
});
