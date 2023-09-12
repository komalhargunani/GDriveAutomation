define([
  'common/elements/customSelector',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/ui/verbalizationHelper',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/fileInfo',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/platform',
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/i18n',
  'common/elements/ui/menuBar/qowt-menu-bar/qowt-menu-bar-strings',
  'qowtRoot/utils/typeUtils',
  'third_party/chromeVox/chromevox-api',
  'third_party/lo-dash/lo-dash.min'
], function(
    CustomSelector,
    MixinUtils,
    QowtElement,
    VerbalizationHelper,
    PubSub,
    FileInfo,
    DomListener,
    Platform,
    Factory,
    I18n,
    MenubarStrings,
    TypeUtils,
    CvoxApi
    /*lo-dash*/) {

  'use strict';
  var _kEscapeKeyCode = 27;
  var kCmd = 'cmd-';

  var mainToolbarProto = {
    is: 'qowt-main-toolbar',

    properties: {
      app: {
        type: 'String',
        value: '',
        reflectToAttribute: true
      },
      i18nMsgs: {
        type: 'Object',
        value: MenubarStrings.getMessages()
      }
    },
    hostAttributes: {
      tabindex: 0
    },
    listeners: {
       keydown: 'onKeyDownHandler_',
       click: 'onClickHandler_'
    },

    destroyToken_: '',
    toolbarWidgets_: {},
    widgetSubCallbacks_: {},
    toolbarSubscriptions_: {},
    formatCodeToItemMap_: {},
    kListenerID_: 'mainToolbarMouseDown',
    polymerButtons_: {}, // Map of button name to constructor
    focusedButtonIndex: -1,
    blurButtonbarToken_: '',
    blurMainToolbarToken_: '',
    updateFileName_: '',

    isApp: function(app, appName) {
      return app === appName;
    },

    getSaveAsIcon: function(appName) {
      if (appName === 'word') {
        return 'docs-icons:document' +
            (FileInfo.isMacroEnabledFile ? '_disabled' : '');
      } else if (appName === 'point') {
        return 'docs-icons:presentation' +
            (FileInfo.isMacroEnabledFile ? '_disabled' : '');
      } else if (appName === 'sheet') {
        return 'docs-icons:spreadsheet' +
            (FileInfo.isMacroEnabledFile ? '_disabled' : '');
      }
    },

    ready: function() {
      // TODO(davidshimel) Do this in a more declarative way.
      this.$['qowt-main-title-inner'].innerText = FileInfo.displayName;

      // These are buttons we've already Polymerized.
      this.polymerButtons_['button-bold'] = QowtBoldButton;
      this.polymerButtons_['button-border'] = QowtBorderDropdown;
      this.polymerButtons_['button-cellAlign'] = QowtCellAlignDropdown;
      this.polymerButtons_['button-italic'] = QowtItalicButton;
      this.polymerButtons_['button-merge'] = QowtMergeButton;
      this.polymerButtons_['button-merge-dropdown'] = QowtMergeDropdown;
      this.polymerButtons_['button-print'] = QowtPrintButton;
      this.polymerButtons_['button-toggleZoom'] = QowtZoomToFitButton;
      this.polymerButtons_['button-underline'] = QowtUnderlineButton;
      this.polymerButtons_['button-strikethrough'] = QowtStrikethroughButton;
      this.polymerButtons_['group-justify'] = QowtJustifyButtonGroup;
    },

    /**
     * Initialise the toolbar.
     * TODO(davidshimel) Maybe we can do this in the ready callback instead.
     * @param {HTML Element} parentNode Node to append the toolbar to.
     * @param {Object} toolbarConfig Toolbar configuration object.
     */
    init: function(parentNode, toolbarConfig) {
      if (this.destroyToken_) {
        throw new Error('mainToolbar.init() called multiple times.');
      }

      this.constructToolbar_(parentNode, toolbarConfig);

      this.destroyToken_ =
        PubSub.subscribe('qowt:destroy', this.destroy.bind(this));
      this.blurButtonbarToken_ =
        PubSub.subscribe('qowt:buttonbar:button:actionPerformed',
            this.blurButtonbar.bind(this));
      this.blurMainToolbarToken_ =
      PubSub.subscribe('qowt:blurMaintoolbar',
          this.blurMainToolbar.bind(this));
      this.updateFileName_ =
        PubSub.subscribe('qowt:updateFileName', this.updateFileName.bind(this));
      if (!Platform.isCros) {
        CvoxApi.init();
      }
    },

    /**
     * Opposite of the init function, probably only useful in unit tests.
     */
    destroy: function() {
      if (this.destroyToken_) {
        this.deconstructToolbar_();

        if (PubSub.unsubscribe(this.destroyToken_)) {
          this.destroyToken_ = undefined;
        }
        if (PubSub.unsubscribe(this.blurButtonbarToken_)) {
          this.blurButtonbarToken_ = undefined;
        }

        if (PubSub.unsubscribe(this.blurMainToolbarToken_)) {
          this.blurMainToolbarToken_ = undefined;
        }

        if (PubSub.unsubscribe(this.updateFileName_)) {
          this.updateFileName_ = undefined;
        }
      }
    },

    updateFileName: function() {
      if(this.updateFileName_){
        this.$['qowt-main-title-inner'].innerText = FileInfo.displayName;
      }
    },

    blurButtonbar: function() {
      if (this.blurButtonbarToken_) {
        this.$['qowt-main-buttonbar'].blurToolbar();
        this.blur();
      }
    },

    blurMainToolbar: function() {
      if (this.blurMainToolbarToken_) {
        this.$['qowt-main-buttonbar'].blurToolbar();
        this.blur();
      }
    },


    /**
     * Make the toolbar visible.
     */
    show: function() {
      this.style.display = 'block';
    },

    /**
     * Hide the toolbar from view.
     */
    hide: function() {
      this.style.display = 'none';
    },

    /**
     * Get a widget for a toolbar item.
     * @param {String} itemId String made from the item type and action.
     * itemConfig.type + '-' + itemConfig.action e.g.: 'button-bold',
     *    'menu-format'
     * @return {Object|undefined} The item widget.
     */
    getItem: function(itemId) {
      var item;
      if (itemId && this.toolbarWidgets_) {
        item = this.toolbarWidgets_[itemId] ||
            this.$$('#menu-bar').querySelector('#' + itemId) ||
            this.$['qowt-main-buttonbar'].querySelector('#' + itemId);
      }
      return (item === null) ? undefined : item;
    },

    /**
     * Returns element from toolbar widget.
     * @param {String} selector - element name
     * @return {html element|undefined} .
     */
    getElement: function(selector) {
      return (this.querySelector(selector) ||
          this.shadowRoot.querySelector(selector));
    },

    /**
     * Returns elements from toolbar widget.
     * @param {String} selector - element name
     * @return {html elements | undefined}
     */
    getElements: function(selector) {
      return (this.querySelectorAll(selector).length ?
          this.querySelectorAll(selector) :
          this.shadowRoot.querySelectorAll(selector));
    },

    /**
     * This returns list of top level menu items.
     * @return {Array.Object} Array of top level menu items
     */
    getTopLevelMenus: function() {
      var topLevelMenus;
      if (this.$$('#menu-bar')) {
        topLevelMenus = this.$$('#menu-bar').
                        querySelectorAll(':scope > [role="menu"]');
      }
      return topLevelMenus;
    },

    /**
     * Construct the toolbar, attach widgets to it, and subscribe to events.
     * @param {Element} parentNode HTML node on which to attach the toolbar.
     * @param {object} toolbarConfig Configuration data for the toolbar.
     * @private
     */
    constructToolbar_: function(parentNode, toolbarConfig) {
      // TODO(davidshimel) Do this in a more declarative way.
      this.toolbarWidgets_['bacon-bar'] = this.$.baconBar;
      this.toolbarWidgets_['butter-bar'] = this.$.butterBar;

      this.constructItems_(
        Polymer.dom(this.$['qowt-main-buttonbar']), toolbarConfig.BUTTONBAR);
      this.constructItems_(
        Polymer.dom(this.$.activityButtonContainer), toolbarConfig.ACTIVITYBAR);
      Polymer.updateStyles();

      // Ensure that, even if no child elements of the toolbar subscribe have
      // callbacks for selection changed, the toolbar's handler for selection
      // changed is still called.
      if (!this.widgetSubCallbacks_['qowt:selectionChanged']) {
        this.widgetSubCallbacks_[signal] = [];
      }

      /* For each set of widgets that require a subscription,
      * make the subscription, save the token, and make a callback
      * that invokes the callback function passing the signal
      * for each of the registered widgets.
      */
      var subs = Object.keys(this.widgetSubCallbacks_),
          subi, subt = subs.length,
          signal;

      for (subi = 0; subi < subt; subi++) {
        signal = subs[subi];
        this.toolbarSubscriptions_[signal] = PubSub.subscribe(
            signal,
            this.delegateSubCallback_.bind(this));
      }

      DomListener.add(this.kListenerID_,
          this, 'mousedown', function(evt) {
            evt.preventDefault();
            PubSub.publish('qowt:toolbarClicked');
          });

      if (toolbarConfig.hideOnCreate) {
        this.hide();
      }

      //Setting ARIA attributes for main toolbar elements
      // TODO(Upasana): temporarily disabling this aria attribute for toolbar
      // as part of cvox-api usecase.
//      this.setAttribute('role', 'toolbar');
      var docTitle = I18n.getMessage('document_title_aria_spoken_word') +
          this.$['qowt-main-title-inner'].innerText;
      this.$['qowt-main-title-inner'].setAttribute('aria-label', docTitle);
      this.$['qowt-main-buttonbar'].setAttribute('aria-label', 'Main');
      this.$['qowt-main-buttonbar'].setAttribute('role', 'toolbar');


      parentNode.appendChild(this);
    },

    /**
     * Construct and attach the toolbar widgets.
     * @param {Element} parentNode HTML node on which to attach new items.
     * @param {object} config Configuration data for the items.
     * @private
     */
    constructItems_: function(parentNode, config) {
      var itemConfig,
          item,
          itemId,
          signal;
      if (config && config.items) {
        for (var i = 0; i < config.items.length; i++) {
          itemConfig = config.items[i];
          if (!this.createAndAppendPolyBtn_(itemConfig, parentNode) &&
              !itemConfig.hide) {
            item = Factory.create(itemConfig);
            if (item) {
              itemId = itemConfig.type + '-' + itemConfig.action;
              this.toolbarWidgets_[itemId] = item;

              if (itemConfig.subscribe) {
                for (signal in itemConfig.subscribe) {
                  this.registerWidgetSub_(
                      signal,
                      itemConfig.subscribe[signal].bind(item));
                }
              }
              item.appendTo(parentNode);
              // Set aria-label for the non polymer button
              var button = parentNode.children[parentNode.children.length - 1];
              var textToSpeak = VerbalizationHelper.
                  prepareFocusedBtnText_(button);
              button.setAttribute('aria-label', textToSpeak);

              this.mapFormatCodeToItem_(item);
              // We initialise the item to ensure it has a good starting state.
              if (itemConfig.init && TypeUtils.isFunction(itemConfig.init)) {
                itemConfig.init.call(item);
              }
            }
          }
        }
      }
    },

    // TODO(davidshimel) Remove this function once the button container itself
    // is a Polymer element. At that point, all child elements will be declared
    // directly in HTML instead of constructed imperatively in JavaScript.
    /**
     * Construct and append a Polymerized toolbar button.
     * @param {string} buttonName Key identifying the button.
     * @param {Element} parentNode HTML node on which to attach the new button.
     * @return {boolean} Whether a button was successfully constructed.
     * @private
     */
    createAndAppendPolyBtn_: function(buttonName, parentNode) {
      var succeeded = false;
      // Capitalized to fulfill ESLint constructor requirement.
      var QowtPolymerButton = this.polymerButtons_[buttonName];
      if (QowtPolymerButton) {
        var button = new QowtPolymerButton();
        this.mapFormatCodeToItem_(button);
        this.toolbarWidgets_[buttonName] = button;
        if (_.isFunction(button.getGroupMembers)) {
          _.forEach(button.getGroupMembers(), function(member) {
            this.toolbarWidgets_[member.id] = member;
          }.bind(this));
        }

        if (_.isFunction(button.getSignalToCallbackMap)) {
          _.forIn(button.getSignalToCallbackMap(), function(callback, signal) {
            this.registerWidgetSub_(signal, callback);
          }.bind(this));
        }

        parentNode.appendChild(button);
        succeeded = true;
      }
      return succeeded;
    },

    /**
     * Group together all toolbar widgets that require a subscription.
     * @private
     */
    registerWidgetSub_: function(signal, callback) {
      this.widgetSubCallbacks_[signal] = this.widgetSubCallbacks_[signal] || [];
      this.widgetSubCallbacks_[signal].push(callback);
    },

    /**
     * @param {string} signal The name of the event.
     * @param {object} signalData Data associated with the event.
     * @private
     */
    delegateSubCallback_: function(signal, signalData) {
      if (signal && this.widgetSubCallbacks_[signal]) {
        // Ensure that the selection changed handler for the toolbar runs
        // before any of the selection changed handlers of child elements.
        var formatCodesInItemMap = Object.keys(this.formatCodeToItemMap_);
        if (signal === 'qowt:selectionChanged') {
          this.resetItems_(formatCodesInItemMap);
        } else if (signal === 'qowt:formattingChanged') {
          var changedFormatCodes = signalData && signalData.formatting &&
              Object.keys(signalData.formatting);
          this.resetItems_(
              _.intersection(changedFormatCodes, formatCodesInItemMap));
        }
        var delegates = this.widgetSubCallbacks_[signal],
            deli, delt = delegates.length, callback;
        for (deli = 0; deli < delt; deli++) {
          callback = delegates[deli];
          if (TypeUtils.isFunction(callback)) {
            callback(signal, signalData);
          }
        }
        // Once all the child widgets have processed the event, fire a
        // signal to indicate the toolbar has finished processing it.
        PubSub.publish(signal + ':toolbarDone', signalData);
      }
    },

    /**
     * Undoes the actions in the constructToolbar_ function in reverse order.
     * @private
     */
    deconstructToolbar_: function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
      DomListener.removeGroup(this.kListenerID_);
      var subs = Object.keys(this.toolbarSubscriptions_),
          si, st = subs.length,
          signal;
      for (si = 0; si < st; si++) {
        signal = subs[si];
        PubSub.unsubscribe(this.toolbarSubscriptions_[signal]);
      }
      var wids = Object.keys(this.toolbarWidgets_),
          wi, wt = wids.length, widget;
      for (wi = 0; wi < wt; wi++) {
        widget = this.toolbarWidgets_[wids[wi]];
        if (widget && TypeUtils.isFunction(widget.destroy)) {
          widget.destroy();
        }
      }

      this.toolbarWidgets_ = {};
      this.widgetSubCallbacks_ = {};
      this.toolbarSubscriptions_ = {};
      this.formatCodeToItemMap_ = {};
    },

    mapFormatCodeToItem_: function(item) {
      if (item.formatCode) {
        var formatCode = item.formatCode;
        if (this.formatCodeToItemMap_[formatCode]) {
          console.warn('Already have item for format code ' + formatCode);
        }
        this.formatCodeToItemMap_[formatCode] = item;
      }
    },

    resetItems_: function(changedFormatCodes) {
      changedFormatCodes.forEach(function(formatCode) {
        var elements = CustomSelector.findAllInSelectionChain(formatCode);
        if (elements && elements.length > 0) {
          var isAllElementHasSameStyle = false;
          var elementStyle;
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element) {
              var decorations = element.getComputedDecorations();
              if (decorations && formatCode in decorations) {
                if (elementStyle === undefined) {
                  elementStyle = decorations[formatCode];
                  isAllElementHasSameStyle = true;
                } else {
                  isAllElementHasSameStyle =
                      elementStyle === decorations[formatCode];
                  if (!isAllElementHasSameStyle) {
                    break;
                  }
                }
              }
            }
          }
          var item = this.formatCodeToItemMap_[formatCode];
          if (item && item.setActive) {
            if (isAllElementHasSameStyle) {
              item.setActive(elementStyle);
            } else {
              item.setActive(false);
            }
          }
        }
      }.bind(this));
    },

    /**
     * Focuses toolbar when clicked on any area, to handle keyboard navigation.
     * @private
     */
    onClickHandler_: function(event) {
      // Request the focus only if the click was elsewhere on the main-toolbar
      // and not on the buttons.
      if (event && event.bubbles) {
        if (!this.buttonOrMenuClicked_(event)) {
          // TODO(umesh.kadam): This should also publish 'qowt:requestFocus' so
          // that the app knows about the element having the focus, also the
          // elements listening to this event can update their states
          // accordingly.
          // Ex: ms-doc should be non-editable when clicked on main-toolbar.
          this.focus();
        } else {
          this.hideToolTip();
        }
      }
    },

    /**
     * Removes focus from main toolbar when Esc key is pressed.
     * @param evt
     * @private
     */
    onKeyDownHandler_: function(evt) {
      if (evt.keyCode === _kEscapeKeyCode) {
        this.blur();
      }
    },

    onFocusDocTitle_: function(/*event*/) {
      var txt = this.$['qowt-main-title-inner'].getAttribute('aria-label');
      var cvox = window.cvox;
      if (cvox) {
        cvox.Api.speak(txt, 0);
      }
    },

    /**
     * This will show the toolTip for non-polymer elements on main-tool-bar
     *
     * @param {Event} evt - mouse hover event
     */
    showToolTip: function(evt) {
      var button = evt.target;

      function targetIsOpenedDropdown() {

        var openedDropdown = _.find(evt.path, function (node) {
          return _.invoke(node, 'classList.contains', 'qowt-menu-active');
        });
        return openedDropdown ? true : false;
      }
      // Show tooltip only for non-polymer & valid elements from main-toolbar.
      // After migration to ShadyDOM, when we hover over the
      // button we end up hovering on the elements like iron-icon which
      // are moved out because of migration.
      if (button && !isPolymerElement_(button) && isValidButton(button)) {
        var targetIsAppIcon = button.classList.contains('qowt-main-appIcon');
        // reference node w.r.t which the tooltip has to be shown
        var refNode = getRefNode(button, targetIsAppIcon);

        // All actionable buttons except app icon have the id's starting with
        // 'cmd-'. For tooltip we exclude the 'cmd-'.
        var buttonName = targetIsAppIcon ? this.app :
            (refNode && refNode.id.slice(kCmd.length));
        if (buttonName) {
          var config = {
            name: buttonName,
            dimensions: refNode.getBoundingClientRect(),
            shortCut: button.shortCut,
            toolTipAlignment: (targetIsAppIcon ? 'left' : undefined)
          };

          if (!targetIsOpenedDropdown()) {
            this.$.tooltip.show(config);
          }

        }
      }
    },

    /**
     * This will hide the toolTip for all the dropdown and non-polymer buttons.
     */
    hideToolTip: function() {
      this.$.tooltip.hide();
    },

    /**
     * @return {boolean} True if any button in button-bar or menu was clicked,
     *        false otherwise.
     * @private
     */
    buttonOrMenuClicked_: function(event) {
      var button = _.find(event.path, function(node) {
        var role = (node.getAttribute && (node.getAttribute('role'))) || "";
        return (role === 'button' || role === 'menuButton' || role === 'menu' ||
            role === 'listbox');
      });
      return (button ? true : false);
    },

    getButtonBar: function() {
      return this.$['qowt-main-buttonbar'];
    }
  };

  function isPolymerElement_(element) {
    // Most of the polymer elements are QowtElements and some of them are not
    // QowtElement; they do not need to be! Ex. button groups.

    // List of Polymer elements that are not QowtElements.
    var polymerElements = [QowtBorderButtonGroup];
    return !!(element.isQowtElement || polymerElements.find(function(class_) {
      return (element instanceof class_);
    }));
  }

  function getRefNode(element, isAppIcon) {
    var parentNodeId = _.get(element, 'parentNode.id', ''/*default*/);
    var elementId = _.get(element, 'id', ''/*default*/);
    return (isAppIcon || elementId.startsWith(kCmd) ? element :
        parentNodeId.startsWith(kCmd) ? element.parentNode : undefined);
  }

  function isValidButton(element) {
    return !(element.nodeName.toLowerCase() === 'iron-icon' ||
        (element.nodeName.toLowerCase() === 'div' &&
            !isAddShapeDropdown(element)));
  }

  function isAddShapeDropdown(element) {
    var targetIsAppIcon = element.classList.contains('qowt-main-appIcon');
    var refNode = getRefNode(element, targetIsAppIcon);
    return (element.nodeName.toLowerCase() === 'div' &&
        refNode && refNode.id === 'cmd-dropdown_initAddShape');
  }

  window.QowtMainToolbar =
      Polymer(MixinUtils.mergeMixin(QowtElement, mainToolbarProto));

  return {};
});
