/**
 * @author: Jelte Liebrand (jelte@google.com)
 * ViewLayout class.
 * Creates the 'view' for the given application context. This includes
 * constructing the correct toolbar, and the correct layout control for content
 * (eg document, workbook or presentation)
 * This is a singleton
 *
 * @param {Object} config - configuration object
 *          config.appContext  {String} application context required:
 *                                  word, sheet, point
 *          config.anchorNode {Node} - containing node reference where layout
 *                                     will be put
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/models/env',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/widgets/ui/feedbackButton',
  'qowtRoot/configs/word',
  'qowtRoot/configs/sheet',
  'qowtRoot/configs/point',
  'qowtRoot/utils/i18n',
  'qowtRoot/selection/selectionManager',
  'common/elements/ui/mainToolbar/mainToolbar'], function(
    Features,
    EnvModel,
    DomListener,
    NavigationUtils,
    PubSub,
    WorkbookControl,
    PresentationControl,
    MessageBus,
    FeedbackButton,
    WordConfig,
    SheetConfig,
    PointConfig,
    I18n,
    SelectionManager
    /*QowtMainToolbar*/) {

  'use strict';

  var _node,
      _feedbackButton,
      _mainToolbar;

  var _api = {
    /**
     * Initialise a layout control relevant for the specified content.
     * @param {Object} config Configuration for this layout control.
     * @param {w3c element} config.anchorNode Container node for this control.
     * @param {String} config.appContext The application for this content.
     */
    init: function(config) {
      _setupHTML(config);

      // construct a feedback button
      _feedbackButton = FeedbackButton.create(I18n.getMessage(
                                              'action_create_user_feedback'));
      window.setTimeout(_addFeedbackButton, 0);

      // TODO(dskelton) Remove this when all clients have mirgrated to Polymer
      // core-keyboard-shortcut elements.
      // Start listening for menu hot keys.
      DomListener.addListener(document, 'keydown', _broadcastKeys, true);

      // Listen for 'contextmenu' events so we can track them.
      DomListener.addListener(document, 'contextmenu',
          _handleContextMenu, true);

      // Construct the correct application layout control based on the
      // config.appContext and add an environment class to the outer node to
      // help with application specific css targetting.

      var toolbarConfig;
      _node.setAttribute('app',config.appContext);
      switch (config.appContext) {
        case 'word':
          toolbarConfig = WordConfig.MAIN_TOOLBAR;
          _setupToolbar(toolbarConfig, config.appContext, config.newDocument);

          // TODO(jliebrand): this is where we should construct
          // the scroll shadow top funky thing (as a polymer element?)

          var docContainer = document.createElement('div');
          docContainer.id = 'qowt-doc-container';
          docContainer.classList.add('qowt-root');
          _node.appendChild(docContainer);
          EnvModel.rootNode = docContainer;

          break;
        case 'sheet':
          toolbarConfig = SheetConfig.MAIN_TOOLBAR;
          _setupToolbar(toolbarConfig, config.appContext, config.newDocument);
          WorkbookControl.init();
          WorkbookControl.appendTo(_node);
          break;
        case 'point':
          toolbarConfig = PointConfig.MAIN_TOOLBAR;
          _setupToolbar(toolbarConfig, config.appContext, config.newDocument);
          PresentationControl.init(_node);
          break;
        default:
          throw ("Error: missing application context");
      }
      
      // TODO: This is a temp effort to get viewers focussed and responding
      // to keypresses. The app used to do this as part of kickStartQowt().
      // Need to review and find a better means of establishing this focus.
      window.focus();
    },
    
    // Used as a callback to defer showing the toolbar
    showToolbar: function(appContext) {
      switch (appContext) {
        case 'word':
        case 'sheet':
        case 'point':
            _mainToolbar.show();
          break;
        default:
          throw ("Error: missing application context");
      }
    },

    /**
     * Get a widget for a toolbar item.
     * @param {String} itemId String made from the item type and action.
     *    itemConfig.type + '-' + itemConfig.action e.g.: 'button-bold',
     *    'menu-format'
     * @return {Object|undefined} The item widget.
     */
    getToolbarItem: function(itemId) {
      return _mainToolbar.getItem(itemId);
    },


    /**
     * This returns list of top level menu items.
     * @return {Array.Object} Array of top level menu items
     */
    getTopLevelMenus: function() {
      return _mainToolbar.getTopLevelMenus();
    },

    // Allow a mock main toolbar to be passed in to facilitate testing.
    // This function should not be used in production.
    setMockToolbar: function(mockMainToolbar) {
      if(mockMainToolbar) {
        _mainToolbar = mockMainToolbar;
      }
    },

    getMainToolbar: function() {
      return _mainToolbar;
    }
  };

  // The feedback button flashes on the screen if we add it straight away
  // so it is append inside a timeout.
  var _addFeedbackButton = function() {
    // We only want to show the feedback button for viewer (not for editors).
    // The editors should include the link in a relevant menu item.
    if (!Features.isEnabled('edit')) {
      _feedbackButton.appendTo(_node);
    }
  };

  var _setupHTML = function(config) {
    // construct view layout control div, in which both the toolbar
    // and the application context layout control will live
    _node = document.createElement('div');
    _node.id = 'view-layout';
    _node.classList.add('qowt-view-layout');
    // In order to position the qowt-root with/without edit toolbars
    // we need a css hook.
    // TODO: Use flex box for the view layout to set this stuff automatically.
    if (Features.isEnabled('edit')  && config.appContext !== 'point') {
      _node.classList.add('qowt-editor');
    }

    // TODO Remove this else block and config.appContext !== 'point' condition
    // from above if once we have standard point editor.
    else {
      if (Features.isEnabled('edit') && config.appContext === 'point' &&
          Features.isEnabled('pointEdit')) {
        _node.classList.add('qowt-editor');
      } else{
        _node.classList.add('qowt-editor-disabled');
      }
    }
    config.anchorNode.appendChild(_node);
  };

  var _setupToolbar = function(toolbarConfig, app, newDocument) {
    // Fix for QW-1885: Hide the toolbar until the CSS has been enabled
    // Here we hide the toolbar on creation, the toolbar is shown on a
    // timeout set in qowt.js when the stylesheet is enabled
    toolbarConfig.hideOnCreate = true;
    if (newDocument) { // hide the download button in case of new document.
      var activityItems = toolbarConfig.ACTIVITYBAR.items;
      activityItems.forEach(function(item) {
        if (item.is === 'QOWTDownloadButton') {
          item.hide = true;
        }
      });
    }
    if (Features.isEnabled('edit')) {
      _createMainToolbar(toolbarConfig, app);
    } else {
      throw new Error('edit mode not in config - cannot setupToolbar');
    }
  };

  var _createMainToolbar = function(toolbarConfig, app) {
    _mainToolbar = _mainToolbar || new QowtMainToolbar();
    _mainToolbar.app = app;
    _mainToolbar.id = 'main-toolbar';
    _mainToolbar.init(_node, toolbarConfig);
  };

  /**
   * TODO(dskelton) Remove this when all clients have mirgrated to Polymer
   * core-keyboard-shortcut elements.
   *
   * Broadcast the keypress along with contentType of current selection so
   * shortcut owners can check for matches.
   * @param {event} event The received event.
   * @private
   */
  var _broadcastKeys = function(event) {
    // TODO: Need to find a better solution for handling events on the target
    // element. For now this is done because currently viewLayoutControl is
    // capturing keydown events on document, which is preventing events to
    // children. So even if the target is mainToolbar the keydown event is also
    // listened on view. Therefore ignoring keydown events if the target is
    // mainToolbar.
    if (event && (NavigationUtils.isTargetWithinMainToolbar(event.target))) {
       return;
     }

    var currentSelection = SelectionManager.getSelection(),
        currentContentType;
    if (currentSelection) {
      currentContentType = currentSelection.contentType;
    }

    PubSub.publish('qowt:shortcutKeys', {'event': event,
      'contentType': currentContentType});
  };

  var _handleContextMenu = function(event) {
    // Here we record a GA Event to track how frequently the context menu
    // is used. It won't tell us what was selected of course.
    // The message must specify an Analytics category and the action.
    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'menu',
      /* We record the event type === 'contextmenu'. */
      action: event.type
    });
  };

  return _api;
});
