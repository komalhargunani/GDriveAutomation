// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview  Content Manager that listens for doActions related to
 * thumbnail and takes action if the action is valid given our current
 * selection.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 */

define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/quickpoint/edit/clearUndoRedoStack',
  'qowtRoot/commands/quickpoint/edit/deleteSlide',
  'qowtRoot/commands/quickpoint/edit/duplicateSlide',
  'qowtRoot/commands/quickpoint/edit/hideUnhideSlide',
  'qowtRoot/commands/quickpoint/edit/insertSlide',
  'qowtRoot/commands/quickpoint/edit/moveSlide',
  'qowtRoot/models/point',
  'qowtRoot/models/transientAction',
  'qowtRoot/presentation/strategies/slideSelection',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/dataStructures/stackFactory',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
  CommandManager,
  TransactionEndCmd,
  TransactionStartCmd,
  ClearUndoRedoStackCommand,
  DeleteSlideCommand,
  DuplicateSlideCommand,
  HideUnhideSlide,
  InsertSlideCommand,
  MoveSlideCommand,
  PointModel,
  TransientActionModel,
  SelectionStrategies,
  PubSub,
  StackFactory,
  ThumbnailStrip) {

  'use strict';


  // ========== PRIVATE ==========
  var _actionSubscriptionToken,
      _disableSubscriptionToken,
      _contentType = 'slideManagement',
      _highlightedThumbs;

  /**
   * Handle 'slideSelect' action
   * @param {object} contextData context data related to slide selection.
   * @private
   */
  var _selectSlides = function(contextData) {
    var _selectionStrategy = SelectionStrategies.getStrategy(
        contextData.type, contextData.shift, contextData.meta);

    var slideIndex = contextData.index;

    if (ThumbnailStrip.selectedIndex() !== slideIndex) {
      // Clear transient formatting action on selection change
      TransientActionModel.clearTransientValues();
    }

    // If we are in a slideshow mode, then we should not show hidden slides.
    if (PointModel.slideShowMode) {
      var thumb = ThumbnailStrip.thumbnail(slideIndex);
      if (thumb && thumb.isHidden()) {
        slideIndex = _getNonHiddenSlideIndex(contextData);
      }
    }
    if (_selectionStrategy.select) {
      _selectionStrategy.select(slideIndex);
    }
  };

  /**
   * This method gets the index of next non-hidden slide. Presentation may
   * contain consecutive hidden slides; we should skip those and find the
   * subsequent non hidden slide. If we are traversing from top to bottom, then
   * we should look in forward direction to get the non hidden slide and vice
   * versa.
   * @param {object} contextData context data related to slide selection.
   * @return {number} Index of subsequent non-hidden slide
   * @private
   */
  var _getNonHiddenSlideIndex = function(contextData) {
    var currentIndex = contextData.index;
    var direction = (contextData.keyIdentifier === 'Up' ||
        contextData.keyIdentifier === 'Left') ? -1 : 1;


    while (ThumbnailStrip.thumbnail(currentIndex) &&
        ThumbnailStrip.thumbnail(currentIndex).isHidden()) {
      currentIndex = currentIndex + direction;
    }
    return currentIndex;
  };

  /**
   * Disable the module.
   * @private
   */
  var _disable = function() {
    PubSub.unsubscribe(_actionSubscriptionToken);
    PubSub.unsubscribe(_disableSubscriptionToken);

    _actionSubscriptionToken = undefined;
    _disableSubscriptionToken = undefined;

    _resetSelection();

    _highlightedThumbs = undefined;
  };

  /**
   * Removes selection from all selected slides
   */
  var _resetSelection = function() {
    //Set the current active slide to be selected again as there is always one
    //slide which is selected
    var _activeSelection = _highlightedThumbs.pop();
    _highlightedThumbs.clear(function(thumbnail) {
      thumbnail.highlight(false);
    });

    if (_activeSelection) {
      _highlightedThumbs.push(_activeSelection);
    }
  };

  /**
   * Creates 'showSld' command and adds it to command manager for further
   * execution.
   * @param {object} command - data related to hide/unhide action
   * @return {object} hide/unhide command
   *
   * @private
   */
  var _setSlidesDisplay = function(command) {
    // Add slideNumbers data to command object when it is a user action.
    // In case of undo operation, slideNumbers is sent by service(core).
    if (command.type !== 'dcpCommand') {
      command.slideNumbers = [];
      _highlightedThumbs.iterate(function(thumb) {
        //If a highlighted thumb is already in the desired state then don't
        //process it again
        //For eg:
        //Suppose slide 1 is already hidden.
        //User selects slide 1 to 4 and triggers the 'hide' operation
        //In this case we should just send slide 2 to 4 in the array for
        //processing. Slide 1 is already hidden so no need to do that operation.
        //In the above example, command.showSlide = false (since user wants to
        //hide the slides). For slide 1 thumb.isHidden() will return true.
        //So the condition will not be fulfilled and it will not be added to
        //the command.
        if (command.showSlide === thumb.isHidden()) {
          // DCP protocol follows 1 base system for slide numbers
          command.slideNumbers.push((thumb.getSlideIndex() + 1).toString());
        }
      });
    }
    if (command.slideNumbers && command.slideNumbers.length > 0) {
      return HideUnhideSlide.create(command);
    }
  };

  /**
   * Manipulate and deduce required operation to perform
   *
   * Deduce the possible operations that can be performed for the current
   * selection and broadcast updateSlideMenu accordingly
   *
   * @private
   */
  var _updateMenu = function() {
    var enableHide = false;
    _highlightedThumbs.iterate(function(thumb) {
      if (!thumb.isHidden()) {
        // Even if one unhidden slide is selected 'Hide' option should be
        // enabled
        enableHide = true;
      }
    });

    var isPresoEmpty = _highlightedThumbs.m_arr.length === 0;
    if (isPresoEmpty) {
      PubSub.publish('qowt:presentationEmpty');
    } else {
      PubSub.publish('qowt:presentationNonEmpty');
    }

    PubSub.publish('qowt:updateSlideMenu', {hide: enableHide});
  };

  var _clearUndoRedoStack = function() {
    //create a command and send it to core
    CommandManager.addCommand(ClearUndoRedoStackCommand.create());
  };

  /**
   * Creates delete slide command and adds it to command manager for further
   * execution
   *
   * @param {object} context data related to delete slide action
   * @return {object} Delete Slide command
   *
   * @private
   */
  var _deleteSlide = function(context) {
    // Create a command object and add slideNumber data to command object when
    // it is a user action.
    // In case of undo operation, slideNumber is sent by service(core).
    if (!context.command || (context.command &&
        context.command.type !== 'dcpCommand')) {
      context.command = {
        slideNumbers: []
      };
      var slidesToBeDeleted = [];
      _highlightedThumbs.iterate(function(thumb) {
        slidesToBeDeleted.push(thumb.getSlideIndex() + 1);
      });
      slidesToBeDeleted = slidesToBeDeleted.sort(function(a, b) {
        return b - a;
      });

      //TODO kunjan.thakkar: Currently, DCP does not support an array of
      //integers. Once the support is available the casting of indices to
      //string needs to be removed.
      slidesToBeDeleted = slidesToBeDeleted.toString().split(',');
      context.command.slideNumbers = slidesToBeDeleted;
    }
    return DeleteSlideCommand.create(context.command);
  };

  /**
   * Creates a transactional command and adds it to the command manager if it
   * is to be sent to service, otherwise add the command as is to the command
   * manager.
   * @param {Object} command - the command to be embedded in a transaction.
   *
   * @private
   */
  var _createAndAddTransactionalCommand = function(command) {
    if (!command) {
      return;
    }

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
   * Creates move slide command and adds it to command manager for further
   * execution
   *
   * @param {object} context data related to move slide action
   *
   * @return {object} Move Slide command
   * @private
   */
  var _moveSlide = function(context) {
    // Add slideNumber and moveSlideToPosition data to command object when it is
    // a user action.
    // In case of undo operation, slideNumber and moveSlideToPosition are sent
    // by service(core).
    if (!context.command || (context.command &&
        context.command.type !== 'dcpCommand')) {
      context.command = context.command ? context.command : {};
      context.command.slideNumbers = [];

      var slidesToBeMoved = [];
      _highlightedThumbs.iterate(function(thumb) {
        slidesToBeMoved.push(thumb.getSlideIndex() + 1);
      });

      slidesToBeMoved = slidesToBeMoved.sort(function(a, b) {
        return a - b;
      });

      if (!context.command.moveSlideToPosition) {
        context.command.moveSlideToPosition = _calculateMoveToPosition(
            slidesToBeMoved, context.position);
      }

      //TODO kunjan.thakkar: Currently, DCP does not support an array of
      //integers. Once the support is available the casting of indices to
      //string needs to be removed.
      slidesToBeMoved = slidesToBeMoved.toString().split(',');
      context.command.slideNumbers = slidesToBeMoved;
    }
    // User cannot move all the slides in a presentation. Hence, create and send
    // moveSlide command only if number of slides selected is less than the
    // total number of slides.
    if (context.command.slideNumbers.length <
        ThumbnailStrip.numOfThumbnails()) {
      return MoveSlideCommand.create(context);
    }
  };

  /**
   * Calculate the index to which the slides have to be moved depending upon the
   * position specified.
   *
   * @param {Object} slidesToBeMoved slides that are to be moved
   * @param {String} position position to which the slides are to be moved.
   *
   * @return {Number} index position to which the slides are to be moved to.
   * @private
   */
  var _calculateMoveToPosition = function(slidesToBeMoved, position) {
    var moveSlideToPosition;
    switch (position) {
      case 'up':
        moveSlideToPosition = slidesToBeMoved[0] - 1;
        moveSlideToPosition = moveSlideToPosition < 1 ? 1 : moveSlideToPosition;
        break;
      case 'down':
        moveSlideToPosition = slidesToBeMoved[slidesToBeMoved.length - 1] + 1;
        moveSlideToPosition = moveSlideToPosition >
            ThumbnailStrip.numOfThumbnails() ?
            ThumbnailStrip.numOfThumbnails() : moveSlideToPosition;

        break;
      case 'start':
        moveSlideToPosition = 1;
        break;
      case 'end':
        moveSlideToPosition = ThumbnailStrip.numOfThumbnails();
        break;
    }
    return moveSlideToPosition;
  };

  /**
   * Creates duplicate slide command
   *
   * @param {object} context data related to duplicate slide action
   * @return {object} Duplicate slide command
   *
   * @private
   */
  var _duplicateSlide = function(context) {
    return DuplicateSlideCommand.create(context.command);
  };

  /**
   * Handle all 'action' signals.
   * @param {string} event The name of the action signal received.
   * @param {Object} eventData The data associated with the signal.
   * @private
   */
  var _handleAction = function(event, eventData) {
    event = event || {};
    if (eventData && eventData.context &&
        eventData.context.contentType === _contentType) {
      switch (eventData.action) {
        case 'slideSelect':
          _selectSlides(eventData.context);
          // Update Slide Menu Items according to new selection.
          _updateMenu();
          _clearUndoRedoStack();
          break;
        case 'resetSlideSelection':
          _resetSelection();
          break;
        case 'hideSld':
        case 'showSld':
          _createAndAddTransactionalCommand(
              _setSlidesDisplay(eventData.context.command));
          break;
        case 'insertSlide':
          _createAndAddTransactionalCommand(_insertSlide(eventData.context));
          break;
        case 'deleteSlide':
          _createAndAddTransactionalCommand(_deleteSlide(eventData.context));
          break;
        case 'moveSlide':
          _createAndAddTransactionalCommand(_moveSlide(JSON.parse(
              JSON.stringify(eventData.context))));
          break;
        case 'duplicateSlide':
          _createAndAddTransactionalCommand(_duplicateSlide(eventData.context));
          break;
        default:
          console.warn('Thumbnail strip content manager could not handle' +
              ' action ' + eventData.action);
          break;
      }
    }
  };

  /**
   * Creates insert slide command and adds it to command manager for further
   * execution
   *
   * @param {object} context data related to insert slide action
   * @return {object} Insert slide command
   *
   * @private
   */
  var _insertSlide = function(context) {
    _clearSelection();
    // Create a command object and add slide number data to command object when
    // it is a user action.
    // In case of undo operation, slide number is sent by service(core).
    if (!context.command || (context.command &&
        context.command.type !== 'dcpCommand')) {
      var maxIndex = -1;
      _highlightedThumbs.iterate(function(thumb) {
        var currentSlideIndex = thumb.getSlideIndex();
        maxIndex = maxIndex > currentSlideIndex ? maxIndex : currentSlideIndex;
      });

      context.command = {
        // QOWT follows 1 base system for slide numbers
        // So add 1 to get the actual slide index of slide after which the new
        // slide is to be inserted.
        // Add 1 to get the position at which the new slide is to be inserted.
        sn: maxIndex + 2
      };
    }
    return InsertSlideCommand.create(context.command);
  };

  var _clearSelection = function() {
    PubSub.publish('qowt:clearSlideSelection');
    PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement'});
  };

  // ========== PUBLIC ==========
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_disableSubscriptionToken) {
        throw new Error(
            'thumbnailStripContentMgr.init() called multiple times.');
      }
      _highlightedThumbs = StackFactory.create();
      SelectionStrategies.init(_highlightedThumbs);
      ThumbnailStrip.setHighlightedThumbs(_highlightedThumbs);

      //subscribe for events
      _actionSubscriptionToken = PubSub.subscribe('qowt:doAction',
          _handleAction);
      _disableSubscriptionToken = PubSub.subscribe('qowt:disable', _disable);

    },

    /**
     * Returns highlighted thumbnails.
     * @return {array} array of highlighted thumbnails.
     */
    selectedThumbnails: function () {
      return _highlightedThumbs;

    }
  };

  return _api;
});
