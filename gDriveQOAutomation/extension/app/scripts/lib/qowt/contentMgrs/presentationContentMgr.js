/**
 * @fileoverview
 * Constructor for the Presentation Content Manager.
 * The content of a presentation is managed by this object
 * and all access to the content is made through its API.
 *
 * @constructor
 * @return {Object} The presentation content manager.
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/quickpoint/openPresentation',
  'qowtRoot/commands/quickpoint/getSlideInfo',
  'qowtRoot/commands/quickpoint/getSlideContent',
  'qowtRoot/commands/quickpoint/getMasterLayout',
  'qowtRoot/commands/quickpoint/getSlideLayout',
  'qowtRoot/commands/quickpoint/getStyles',
  'qowtRoot/commands/quickpoint/getThemes',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/contentMgrs/commonContentMgr',
  'qowtRoot/presentation/slideZoomManager',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/contentMgrs/shapeContentManager',
  'qowtRoot/contentMgrs/slideContentMgr',
  'qowtRoot/contentMgrs/mutationMgr',
  'qowtRoot/contentMgrs/textContentMgr',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr',
  'qowtRoot/messageBus/messageBus'], function(
  PubSub,
  CommandManager,
  CommandBase,
  OpenPresentationCmd,
  GetSlideInfoCmd,
  GetSlideContentCmd,
  GetMasterLayoutCmd,
  GetSlideLayoutCmd,
  GetStylesCmd,
  GetThemesCmd,
  Presentation,
  CommonContentMgr,
  SlideZoomManager,
  ModalDlg,
  I18n,
  ListFormatManager,
  SelectionManager,
  ShapeContentManager,
  SlideContentManager,
  MutationManager,
  TextContentMgr,
  ThumbnailStripContentMgr,
  MessageBus) {

  'use strict';

  var _actionSubscriptionToken;
  var _disableSubscriptionToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_disableSubscriptionToken) {
        throw new Error('presentationContentMgr.init() called multiple times.');
      }

      _actionSubscriptionToken = PubSub.subscribe('qowt:doAction',
          _handleAction);
      _disableSubscriptionToken = PubSub.subscribe('qowt:disable',_api.disable);

      //Initialize point specific modules
      TextContentMgr.init();
      SelectionManager.init();
      ShapeContentManager.init();
      SlideContentManager.init();
      ListFormatManager.init();
      MutationManager.init();
      ThumbnailStripContentMgr.init();
    },

    /**
     * disables the module.
     */
    disable: function() {
      PubSub.unsubscribe(_actionSubscriptionToken);
      PubSub.unsubscribe(_disableSubscriptionToken);

      _actionSubscriptionToken = undefined;
      _disableSubscriptionToken = undefined;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv

  var _contentType = 'presentation';

  /**
   * Handle all 'action' signals.
   * @param {string} event The name of the action signal received.
   * @param {Object} eventData The data associated with the signal.
   * @private
   */
  function _handleAction(event, eventData) {
    if (eventData.context && eventData.context.contentType) {

      if (eventData.context.contentType === _contentType) {
        switch (eventData.action) {
          case 'openPresentation':
            _openPresentation(eventData.context);
            break;
          case 'print':
            _print();
            break;
          case 'getStyles':
            _getStyles(eventData.context);
            break;
          case 'getSlide':
            _getSlide(eventData.context);
            break;
          case 'startSlideshow':
            _startSlideshow(eventData.context);
            break;
          case 'stopSlideshow':
            _stopSlideshow(eventData.context);
            break;
          case 'zoomIn':
            _zoomIn();
            break;
          case 'zoomOut':
            _zoomOut();
            break;
          default:
            console.warn('presentation manager did not handle action ' +
                eventData.action);
            break;
        }
      } else {
        if (eventData.context.contentType === "common") {
          CommonContentMgr.handleCommonAction(event, eventData);
        }
      }
    }
  }

  /**
   * Open the specified Presentation file.
   * @param {Object} context Details of the action requested.
   * @private
   */
  function _openPresentation(context) {
    var cmd = OpenPresentationCmd.create(context);
    CommandManager.addCommand(cmd);
  }

  /**
   * Handles printing but we need to warn the user about how it work
   * in Presentation.
   * @private
   */
  function _print() {
    var modalWarningDlgInstance = ModalDlg.info(
        I18n.getMessage('point_printing_warning_short_msg'),
        I18n.getMessage('point_printing_warning_msg'),
        function() {
          modalWarningDlgInstance.destroy();
          window.print();
        });
  }

  /**
   * Get the content of a specified slide by constructing the necessary
   * commands.
   * @param {Object} context Details of the action requested.
   * @private
   */
  function _getSlide(context) {

    if (context.slideNumber === undefined ||
        typeof(context.slideNumber) !== 'number') {
      throw new Error('PresentationContentMgr._getSlide() not given slide' +
          ' number');
    }

    var slideNumber = context.slideNumber;
    var thumb = context.nodeForSlide;

    var containingCmd = CommandBase.create();
    containingCmd.addChild(GetSlideInfoCmd.create(slideNumber));
    containingCmd.addChild(GetMasterLayoutCmd.create(thumb, slideNumber));
    containingCmd.addChild(GetSlideLayoutCmd.create(thumb, slideNumber));
    containingCmd.addChild(GetSlideContentCmd.create(thumb, slideNumber));
    CommandManager.addCommand(containingCmd);
  }

  /**
   * Start the slideshow from the current slide.
   * @private
   */
  function _startSlideshow() {
    // Note: MessageBus cannot be used in the presentButton custom element
    // because it creates a circular dependency, so sending message here.
    // The message must specify an Analytics category and the action.
    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'button-bar',
      action: 'present'
    });
    Presentation.toggleFullScreen();
  }

  /**
   * Stop the slideshow.
   * @private
   */
  function _stopSlideshow() {
    Presentation.slideShow.stop();
  }

  /**
   * Zooms in the slide.
   * @private
   */
  function _zoomIn() {
    SlideZoomManager.zoomIn();
  }

  /**
   * Zooms out the slide.
   * @private
   */
  function _zoomOut() {
    SlideZoomManager.zoomOut();
  }

  /**
   * Get the styles from the presentation.
   * @private
   */
  function _getStyles() {
    var containingCmd = CommandBase.create();
    containingCmd.addChild(GetThemesCmd.create());
    containingCmd.addChild(GetStylesCmd.create());
    CommandManager.addCommand(containingCmd);
  }

  return _api;

});
