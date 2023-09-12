
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Document Content Manager singleton.
 * Responds to qowt:doAction signals with type 'document' and generates the
 * appropriate commands to send to the core.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/quickword/openDocument',
  'qowtRoot/commands/quickword/getDocumentStatistics',
  'qowtRoot/commands/quickword/getDocFonts',
  'qowtRoot/commands/quickword/getDocStyles',
  'qowtRoot/commands/quickword/getDocContent',
  'qowtRoot/commands/quickword/getListFormats',
  'qowtRoot/contentMgrs/commonContentMgr',
  'qowtRoot/contentMgrs/drawingContentMgr',
  'qowtRoot/contentMgrs/mutationMgr',
  'qowtRoot/contentMgrs/textContentMgr',
  'qowtRoot/utils/cssManager',
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/selection/selectionManager',
  'utils/analytics/documentMetaDataLogger'], function(
  PubSub,
  CommandManager,
  OpenDocumentCmd,
  GetDocStatsCmd,
  GetDocFontsCmd,
  GetDocStylesCmd,
  GetDocContentCmd,
  GetListFormatsCmd,
  CommonContentMgr,
  DrawingContentMgr,
  MutationManager,
  TextContentMgr,
  CssManager,
  ListFormatManager,
  SelectionManager,
  DocumentMetaDataLogger) {

  'use strict';

  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      PubSub.subscribe('qowt:doAction', _handleAction);

      //Initialize word specific modules.
      TextContentMgr.init();
      DrawingContentMgr.init();
      ListFormatManager.init();
      SelectionManager.init();
      MutationManager.init();
      DocumentMetaDataLogger.init();
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv


  var _contentType = 'document';

  /**
   * Handle all 'action' signals.
   * Not intended to be called directly, but made available for unit testing.
   * @param {string} event The name of the action signal received.
   * @param {Object} eventData The data associated with the signal.
   * @private
   */
  function _handleAction(event, eventData) {
    if (eventData.context && eventData.context.contentType) {
      if (eventData.context.contentType === _contentType) {
        switch (eventData.action) {
          case 'openDocument':
            _openDocument(eventData.context);
            break;
          case 'showSpecialChars':
            _showNonPrintingCharacters(eventData.context);
            break;
          default:
            _handleDocOperation(eventData);
        }
      } else {
        if (eventData.context.contentType === "common") {
          CommonContentMgr.handleCommonAction(event, eventData);
        }
      }
    }
  }

  /**
   * Handle action signals that operate on the document.
   * @param {Object} eventData The data associated with the signal.
   * @private
   */
  function _handleDocOperation(eventData) {
    var msdoc = document.getElementById('qowt-msdoc');
    if (msdoc) {
      switch(eventData.action) {
        case 'toggleZoom':
          if (eventData.context.zoomFullPage) {
            msdoc.zoomFullPage();
          } else {
            msdoc.zoomActualSize();
          }
          break;
        case 'fitToPage':
          msdoc.zoomFullPage();
          break;
        case 'fitToWidth':
          msdoc.zoomToWidth();
          break;
        case 'zoomIn':
          msdoc.zoomIn();
          break;
        case 'zoomOut':
          msdoc.zoomOut();
          break;
        case 'actualSize':
          msdoc.zoomActualSize();
          break;
        case 'wordCount':
          msdoc.showWordCountDialog();
          break;
        default:
          break;
      }
    }
  }

  /**
   * Open the specified Document file.
   * @param {Object} context Details of the action requested.
   * @private
   */
  function _openDocument(context) {
    var rootCmd = OpenDocumentCmd.create(context);
    rootCmd.addChild(GetDocStatsCmd.create());
    rootCmd.addChild(GetDocFontsCmd.create());
    rootCmd.addChild(GetDocStylesCmd.create());
    rootCmd.addChild(GetListFormatsCmd.create());
    rootCmd.addChild(GetDocContentCmd.create());
    CommandManager.addCommand(rootCmd);
  }

  /**
   * Turn the rendering of non printing characters on/off.
   *
   * @param {Object} context Details of the action requested.
   * @private
   */
  function _showNonPrintingCharacters(context) {
    // for now we only support end of paragraph markers and page breaks
    // so this is a bit hardcoded and crude, but it will do for now
    var vis = context.show ? "visible" : "hidden";
    CssManager.addRule("#qowt-msdoc span[data-mpb]", {
      visibility: vis
    });
  }

  return _api;

});
