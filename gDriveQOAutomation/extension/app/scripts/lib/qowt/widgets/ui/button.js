// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview Encapsulates the HTML representing a UI button, and asscociated
 * button behaviours. It includes supporting button relationships like radio
 * buttons.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/utils/platform',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/i18n',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/utils/typeUtils'], function(
  EnvModel,
  Platform,
  PubSub,
  WidgetFactory,
  ArrayUtils,
  I18n,
  MessageBus,
  TypeUtils) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Button Widget Factory',

    supportedActions: [],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param config {object} Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {integer} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions &&
            !ArrayUtils.subset(
              config.supportedActions,
              _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.type && config.type === 'button') {
        score = 100;
      }
      return score;
    },


    /**
     * Create a new instance of a button widget.
     * @param {object} config The button configuration.
     * @param {'button'} config.type Defines this as a button widget.
     * @param {string} config.action The action for this button when activated.
     * @param {boolean} config.sticky If true this button latches when pressed.
     * @param {string} config.groupId If true defines this button to participate
     *                 in a radio-button relationship with other buttons.
     * @param {object} config.subscribe Defines button-specific behaviour to
     *                 invoke for different signals of interest.
     * @param {Function} config.preExecuteHook A pre-execute function which gets
     *                   executed at the very start of button onclick handler.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _buttonNode,
            _cmdId,
            _groupId,
            _latched = false,
            _buttonGroupChangeToken,
            _destroyToken;

        var _api = {

          name: 'Button Widget Instance',

          appendTo: function(parentNode) {
            parentNode.appendChild(_buttonNode);
          },

          setActive: function(isActive) {
            _latched = (isActive) ? true : false;
            _handleStateChange();
          },

          isActive: function() {
            return _latched;
          },

          getWidgetElement: function() {
            return _buttonNode;
          },

          /**
           * Set this button to be enabled or disabled.
           *
           * @param {boolean} state Enable if true, disable if false.
           */
          setEnabled: function(state) {
            function setState() {
              state = (state === undefined) ?
                true :
                !!state;
              _buttonNode.disabled = !state;
            }
            if (_buttonNode.id === 'cmd-zoomIn' ||
                _buttonNode.id === 'cmd-zoomOut') {
              setTimeout(function() { setState(); }, 0);
            } else {
              setState();
            }
          },

          /**
           * Query if the menu item is enabled or not.
           *
           * @return {boolean} true if the menu item is enabled, else false.
           */
           isEnabled: function() {
            return (_buttonNode.disabled !== true);
           },

          /**
           * Trigger the required action.
           * Called when we need to programmatically action a button.
           */
           set: function() {
             _onCmd();
           },

          /**
           * Return the 'id' attribute of buttonItem DOM element
           *
           * @return {string} - 'id' attribute of buttonItem
           */
          getId: function() {
            return _buttonNode.id;
          },

          /**
           * Return the buttonItem DOM element present inside top menuButton.
           *
           * @return {HTML Element} - DOM element of button Item.
           */
          getNode: function() {
            return _buttonNode;
          },

          /**
           * Invoked during testing to clean up event subscriptions.
           */
          destroy: function() {
            PubSub.unsubscribe(_buttonGroupChangeToken);
            PubSub.unsubscribe(_destroyToken);
          }
        };

        /**
         * Implements the button behavior when actioned.
         * @param {Event} event object from underlying event.
         */
        function _onCmd(event) {
          var actionContext, buttonStateChanged;

          // If we have an action, then publish it.
          // But not if we're a radio button and already set: user cannot unset.
          if (config.action &&
              _api.isEnabled() &&
              !(config.groupId && _latched)) {

            actionContext = {};

            actionContext.contentType = config.contentType;
            buttonStateChanged = _toggle();

            if (config.preExecuteHook &&
                TypeUtils.isFunction(config.preExecuteHook)) {
              actionContext =
                  _.merge(actionContext, config.preExecuteHook(_latched));
            }
            if (EnvModel.app !== 'word') {
              if (config.sticky) {
                // 'Latched' is contextual data that is specific to the widget.
                // The logical presnetation of the data is 'set' {boolean}.
                actionContext.set = _latched;
              }
            }

            if (_groupId && buttonStateChanged) {
              PubSub.publish('qowt:buttonGroupChange', {
                'groupId': _groupId,
                'cmdId': _cmdId
              });
            }

            var action = (config.contentType) ?
                'qowt:doAction' :
                'qowt:requestAction';
            PubSub.publish(action, {
              'action': config.action,
              'context': actionContext
            });

            // Check if we track the interaction within Analytics.
            // The message must specify at least an Analytics category and
            // the action itself.
            MessageBus.pushMessage({
              id: 'recordEvent',
              category: (event) ? 'button-bar' : 'shortcut',
              action: config.action});
          }
          if (event && (event.type === 'click' || event.type === 'tap')) {
            PubSub.publish('qowt:buttonbar:button:actionPerformed', {});
            if (document.activeElement.tagName === 'QOWT-TOOLBAR') {
              document.activeElement.blur();
            }
          }
        }

        /**
         * Called on a grouped button when actioned.
         *
         * @param {string} evt The published signal.
         * @param {object} evtData Contextual data of the published signal.
         */
        function _handleGroupSelection(evt, evtData) {
          evt = evt || {};
          if (evtData.groupId === _groupId &&
              evtData.cmdId !== _cmdId &&
              _latched) {
            _api.setActive(false);
          }
        }

        /**
         * Set the visual button state for a sticky button correctly.
         * Queries internal state to do this.
         * @param {boolean} isActive True to 'stick' the button, False to not.
         */
        function _handleStateChange() {
          if (_latched) {
            _buttonNode.classList.add('latched');
          } else {
            _buttonNode.classList.remove('latched');
          }
          _buttonNode.setAttribute("aria-pressed", _latched);
        }

        function handleActionOnFocusedBtn_(event){
          if (event.detail.key === 'enter') {
            _onCmd(event);
            event.preventDefault();
          }
        }

        /**
         * Toggle the button state. Called either directly by a user gesture
         * on this button, or by a signal to update a related group button.
         * For a direct user gesture check if the button is deselectable first.
         *
         * @param name {boolean} userGesture True is called from a user gesture,
         *                       False is called as a button group update.
         */
        function _toggle(/* userGesture */) {
          var origState,
              changed = false;

          if (config.sticky) {
            origState = _latched;
            _latched = (_latched) ? false : true;
            _handleStateChange();
            changed = origState !== _latched;
          }
        return changed;
        }

        function _init() {
          _buttonNode = document.createElement('button');

          // TODO(Upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _buttonNode.classList.add('qowt-main-toolbar');


          //Setting ARIA attribute to button.
          _buttonNode.setAttribute('role', 'button');
          _buttonNode.setAttribute('tabIndex', -1);

          // JELTE TODO: buttons should not be labels; fix this
          if (config.type === 'label') {
            _buttonNode.classList.add('label');
          }

          if (config.groupId) {
            _groupId = config.groupId;
            _buttonGroupChangeToken =
              PubSub.subscribe('qowt:buttonGroupChange', _handleGroupSelection);
          }

          // JELTE TODO: need to give buttons at least SOME text to ensure
          // they end up on the same height as peer buttons with text.
          // we really should not need to do this; figure out why this is the
          // case. For now add a non breaking space, and override if the
          // config has actual text
          _buttonNode.innerHTML = "&nbsp;";
          if (config.stringId) {
            _buttonNode.textContent = I18n.getMessage(config.stringId);
          }
          if (config.action) {
            _cmdId = config.cmdId || 'cmd-' + config.action;
            _buttonNode.id = _cmdId;
            if (config.shortCut) {
              _buttonNode.shortCut = config.shortCut;
            }
            var buttonName = _buttonNode.id;
            if (buttonName && buttonName.startsWith('cmd')) {
              buttonName = buttonName.slice(4);
              var keyName = buttonName.replace(/([A-Z])/g, '_$1');
              _buttonNode.setAttribute('label',
                I18n.getMessage('tooltip_' + keyName.toLowerCase()));
            }
            //Setting wai-aria attribute for button label.
            var buttonStr = config.action + '_aria_spoken_word';
            _buttonNode.setAttribute('aria-label',
                I18n.getMessage(buttonStr.toLowerCase()));

            // a css class is used to show the correct icon,
            // so that the icon can be redrawn elsewhere (like on menu items).
            _buttonNode.classList.add('icon-' + (config.css || config.action));
          }
          _buttonNode.addEventListener("click", _onCmd, false);

          // Adding the shortcut config at runtime as an imperative
          // core-keyboard-shortcut. So we only care about setting the keycombo
          // relevant to this running platform.
          var keycombo, platformKey;
          if (config.shortcut) {
            platformKey = (config.shortcut[Platform.name]) ?
                Platform.name : 'DEFAULT';
          }
          if (platformKey) {
            keycombo = config.shortcut[platformKey];

            var shortCut = (platformKey === 'OSX') ?
                keycombo.replace('CMD', '⌘') : keycombo.replace('CTRL', 'Ctrl');

            // We need to show tooltip as '⌘+' for Zoom in and and '⌘-'
            // for Zoom out
            shortCut = shortCut.replace('+#187', '+');
            shortCut = shortCut.replace('+#189', '−');
            var shortcutElm = document.createElement('core-keyboard-shortcut');
            var keycomboProperty = (platformKey === 'DEFAULT') ?
                'keycombo' : 'keycombo-' + platformKey.toLowerCase();
            _buttonNode.addEventListener('keyboard-shortcut', _onCmd, true);
            // mainToolbar.js expects button to have "shortCut" as per polymer
            // implementation.Adding the same property to _buttonNode to make
            // the non-polymer button code in-sync with polymer one for tooltip.
            _buttonNode.shortCut = shortCut;
            shortcutElm.setAttribute(keycomboProperty, keycombo);
            shortcutElm.showShortcut = false;
            _buttonNode.appendChild(shortcutElm);
          }

          if (_buttonNode.shortCut && config.group) {
            _buttonNode.setAttribute('group', config.group);
          }
          _buttonNode.addEventListener('keydown', handleActionOnFocusedBtn_);

          _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
        }

        _init();
        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});
