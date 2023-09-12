// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview The menu item widget encapsulates the part of the HTML DOM
 * representing an item that appears in a menu.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/utils/platform',
  'qowtRoot/features/utils',
  'qowtRoot/utils/domListener',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/env',
  'qowtRoot/utils/i18n',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/widgets/behaviours/shortcutKeys',
  'qowtRoot/messageBus/messageBus'], function(
  Platform,
  Features,
  DomListener,
  PubSub,
  Env,
  I18n,
  SelectionManager,
  WidgetFactory,
  ArrayUtils,
  TypeUtils,
  ShortcutKeys,
  MessageBus) {

  'use strict';

    //constants
    var _kDivType = 'qowt-menuitem';

    var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'MenuItem Widget Factory',

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
      if (config && config.type && config.type === 'menuItem') {
        score = 100;
      }
      return score;
    },

    /**
     * Create a new menu item instance.
     *
     * @param {object} config Widget configuration for new instance.
     * @param {string} config.stringId A string id to display as the item label.
     * @param {string} config.string Non-localisable string for the item label.
     * @param {string} config.action The action associated with this menu item.
     * @param {undefined|string|object} config.context May be undefined.
     *        A string is interpreted as a contentType. An object should contain
     *        at least a contentType property along with other necessary data.
     * @param {string} config.iconClass Classname for icon styling.
     * @param {string} config.shortcut Shortcut key identifier.
     * @param {Function} config.formatter A custom function to style the
     *        items being created. eg to apply a specific font.
     * @param {function} config.setOnSelect Function that returns true or false.
     *        Used by menu items that need to send context.set = [true | false].
     */
    create: function(config) {
      if (! (config || config.type || config.type === 'menuItem')) {
        throw new Error('spacer widget create with bad config');
      }

      // We need to support debug-only menu items. We have to evaluate this at
      // runtime since the menu configs are loaded directly in qowt.js prior to
      // it updating the its feature overrides. ie, defining debug-only in the
      // config does not work. This patch will do for now since the menu
      // framework is being rewritten for accessibility.
      if (config.debugOnly && !Features.isDebug()) {
        return;
      }

      // TODO DuSk: Remove _myContentType and have all uses go through a
      // requestAction flow - do away with doAction. Need to chase down
      // paneManager use of context menus to do this. Also a few app-specific
      // menuItemConfigs.
      /**
       * @private
       * There's a risk that this config object will be modified
       * during its lifetime and its contentType will be changed and thus
       * impact future code paths. So keep a clean reference for now.
       */
      var _myContentType = config.contentType ||
          (config.context && config.context.contentType);

      // use module pattern for instance object
      var module = function() {

        /**
         * A map of the html elements making up our menu item.
         * @private
         */
        var _domNodes = {};

        var _api = {

          name: 'MenuItem Widget Instance',

          /**
           * Gets the menu item html node.
           *
           * @return {object} The menu item node.
           */
          getNode: function() {
            return _domNodes.item;
          },

          handleKey: function() {
            _handleClickEvent();
          },

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to
           * a specified node in the HTML DOM.
           *
           * @param {element} node The HTML node we are going to append to.
           */
          appendTo: function(node) {
            if (node === undefined) {
              console.error("MenuItem.appendTo() - missing node parameter!");
            }

            if (_domNodes.item !== undefined) {
              node.appendChild(_domNodes.item);
            }
          },

          /**
           * Removes the HTML elements of the widget from
           * a specified node in the HTML DOM.
           *
           * @param {Node} node The HTML node to be removed from.
           */
          removeFrom: function(node) {
            if (node === undefined) {
              console.error("MenuItem.removeFrom() - missing node parameter!");
            }

            if (_domNodes.item !== undefined) {
              node.removeChild(_domNodes.item);
            }
          },

          /**
           * Trigger the required action.
           * Can be called by eg, menu configs so they can locally determine
           * the 'value' and pass it in here.
           *
           * @param {boolean|undefined} set True/False
           */
          // TODO DuSk:  Remove the doAction contentType flow, and remove
          // the use of the cached _myContentType. See above. Need to change
          // paneManager's use of context menu first.
          set: function(set) {
            var signal;
            var actionContext;

            // TODO: dtilley@ this is a temporary hack until the
            // polymer menu lands and the configs go away.
            // Some configs provide a string instead of a context,
            // need to guard against this otherwise when setting
            // an arbitrary value on a string becomes illegal
            // this will create an uncaught exception.
            if (TypeUtils.isString(config.context)) {
              actionContext = {contentType: config.context};
            } else {
              actionContext = config.context || {};
            }

            if (config.preExecuteHook) {
              actionContext =
                  _.merge(actionContext, config.preExecuteHook(set));
            }

            signal = (actionContext.contentType) ?
              'qowt:doAction' :
              'qowt:requestAction';
              // we have no context, so *request* the action
              // which the tool will pick up and it will *added* to
              // the context (likely based on the selection)

            PubSub.publish(signal, {
                'action': config.action,
                'context': actionContext
            });

            // Force a restore of our original contenType prior to use.
            actionContext.contentType = _myContentType;
          },

          /**
           * Select or deselect a menu item.
           *
           * @param {boolean} select True/False
           */
          toggleSelectedItem: function(select) {
            if (select) {
              _domNodes.item.classList.add('selected');
            } else {
              _domNodes.item.classList.remove('selected');
            }
          },

          toggleNavigatedItem: function(select) {
            if (select) {
              _domNodes.item.classList.add('navigated');
            } else {
              _domNodes.item.classList.remove('navigated');
            }
          },

          /**
           * Set this menu item to be enabled or disabled.
           *
           * @param {boolean} state Enable if true, disable if false.
           */
          setEnabled: function(state) {
            state = (state === undefined) ?
                true :
                !!state;
            if (state === true) {
              _domNodes.item.classList.remove('qowt-menuitem-disabled');
            } else {
              _domNodes.item.classList.add('qowt-menuitem-disabled');
            }
          },

          /**
           * Query if the menu item is enabled or not.
           *
           * @return {boolean} true if the menu item is enabled, else false.
           */
           isEnabled: function() {
            return !(_domNodes.item.classList.contains(
                  'qowt-menuitem-disabled'));
           },

          /**
           * Shows this menu item.
           */
           show: function() {
             _domNodes.item.style.display = 'block';
           },

          /**
           * Hides this menu item.
           */
           hide: function() {
             _domNodes.item.style.display = 'none';
           },

           /**
            * Return the 'id' attribute of menuItem DOM element
            *
            * @return {string} - 'id' attribute of menuItem
            */
           getId: function() {
             return _api.getNode().id;
           },

           focus: function() {
             _api.getNode().classList.add('qowt-menuPane-focused');
             _api.getNode().focus();
           },

           removeFocus: function() {
             _api.getNode().classList.remove('qowt-menuPane-focused');
             _api.getNode().blur();
           },

           select: function() {
             _handleClickEvent();
           },

           // This function is used for testing purposes only.
           // Should not be called in the app.
           setEmbedded: function(flag) {
             Env.embedded = flag;
           }
         };

        // vvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        /**
         * The different symbols for modifier keys.
         * For use in presentation of shortcuts in menu items.
         */
        var _kSYMBOLS = Platform.isOsx ? {
          CTRL: '\u2303',
          CMD: '\u2318',
          ALT: '\u2325',
          SHIFT: '\u21E7',
          '#38': '↑',
          '#40': '↓'
        } : {
          CTRL: 'Ctrl+',
          CMD: 'Cmd+',
          ALT: 'Alt+',
          SHIFT: 'Shift+',
          '#38': '↑',
          '#40': '↓'
        };

        /**
         * Initialise the shortcut for this menu item if there is one.
         */
        function _initShortcutKey() {
          if (config.shortcut) {
            var setupShortcut;
            if (config.shortcut[Platform.name]) {
              setupShortcut = Platform.name;
            } else if (config.shortcut.DEFAULT) {
              setupShortcut = 'DEFAULT';
            }
            if (setupShortcut) {

              var shortcutConfig = config.shortcut[setupShortcut].toUpperCase();

              _domNodes.shortcut = document.createElement('span');
              _domNodes.shortcut.className = 'qowt-shortcut';

              var label = '';

              var keys = shortcutConfig.split('+');
              var ix = 0;
              for (; ix < keys.length; ix++) {
                var k = keys[ix];
                var symbol = _kSYMBOLS[k] || '';
                if (symbol === '') {
                  symbol = k;
                }
                label += symbol;
              }
              _domNodes.shortcut.textContent=label;
              _domNodes.item.content.appendChild(_domNodes.shortcut);

              // extend ourselves with shortcut capabilities.
              ShortcutKeys.addBehaviour(_api);
              _api.addShortcut(shortcutConfig, _handleClickEvent.bake(_api));
            }
          }
        }

        /**
         * Trigger this menu item's action.
         *
         * @param {event} opt_event The triggering event.
         *                          Undefined if invoked via keyboard shortcut.
         */
        var _handleClickEvent = function(opt_event) {
          function isNotAllowedMenuItem(itemId) {
            return ["cut", "copy", "paste"].indexOf(itemId) !== -1;
          }
          function click() {
            if (_api.isEnabled()) {
              if (Env.embedded && opt_event &&
                  isNotAllowedMenuItem(config.action)) {
                PubSub.publish('qowt:iframed:copyCutPasteNotAllowed');
              } else {
                // With 'content formatting' menu items we need to know whether
                // to apply or remove the formatting.
                if (config.onSelect &&
                    typeof config.onSelect === 'function') {
                  config.onSelect.call(_api, SelectionManager.getSelection());
                } else {
                  _api.set();
                }

                // Check if we track the interaction within Analytics.
                // The message must specify at least an Analytics category and
                // the action itself.
                MessageBus.pushMessage({
                  id: 'recordEvent',
                  category: (opt_event) ? 'menu' : 'shortcut',
                  action: config.action});
              }
              if (opt_event && opt_event.type === 'click') {
                PubSub.publish('qowt:buttonbar:button:actionPerformed', {});
                if (document.activeElement.tagName === 'QOWT-TOOLBAR') {
                  document.activeElement.blur();
                }
              }
            }
          }
          // We need to trigger the required action in a different 'turn'
          // because  we want to ensure our parent first reacts to the bubbled
          // event (in its own handler) and closes the menu before we run.
          window.setTimeout(click, 0);
        };

        /**
         * Initialise a new menuItem widget.
         * @private
         */
        var _init = function() {
          // create the main container
          _domNodes.item = document.createElement('div');
          _domNodes.item.id = 'menuitem-' + (config.actionId || config.action);
          _domNodes.item.setAttribute('qowt-divtype', _kDivType);
          _domNodes.item.className = _kDivType;

          // TODO: Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _domNodes.item.classList.add('qowt-main-toolbar');

          // create the text content
          _domNodes.item.content = document.createElement('div');
          _domNodes.item.content.className = 'qowt-menuitem-content';
          _domNodes.item.content.classList.add('qowt-main-toolbar');
          _domNodes.item.setAttribute('role','menuitem');
          _domNodes.item.setAttribute('tabindex', -1);

          if (config.stringId) {
            _domNodes.item.content.textContent = I18n.getMessage(config.
                stringId);
          }
          else if (config.string) {
            _domNodes.item.content.textContent = config.string;
          }

          if (config.formatter && TypeUtils.isFunction(config.formatter)) {
            config.formatter.call(this, _domNodes.item.content, config.string);
          }

          _domNodes.item.appendChild(_domNodes.item.content);

          var ariaLabel = _domNodes.item.content.textContent;

          // For verbalization purpose, aria-label of outline style items like
          // 'lgDash' or 'lgDashDot' should be modified with a sensible text.
          // Replacing 'lg' with 'long' as per GDocs.

          if (_domNodes.item.id === 'menuitem-modifyShapeOutlineStyle' &&
              config.string) {
            ariaLabel = config.string.replace(/lg/i, 'long');
          }

          _domNodes.item.setAttribute('aria-label', ariaLabel);

          // create the icon if present
          if (config.iconClass && config.iconClass !== '') {
            _domNodes.icon = document.createElement('div');
            _domNodes.icon.className = 'qowt-menuitem-icon';
            _domNodes.icon.classList.add("icon-" + config.iconClass);
            _domNodes.icon.classList.add('qowt-main-toolbar');
            _domNodes.item.content.appendChild(_domNodes.icon);
          }

          // handle config subscriptions if present
          if (config.subscribe) {
            for (var signal in config.subscribe) {
              var callback = config.subscribe[signal];
              if (typeof callback === 'function') {
                PubSub.subscribe(signal, callback.bake(_api));
              }
            }
          }
          _initShortcutKey();

          if (config.init && TypeUtils.isFunction(config.init)) {
            config.init.call(_api);
          }
          DomListener.addListener(_domNodes.item, 'click', _handleClickEvent);
        };

        function _verifyInternals() {
          return _domNodes &&
              _domNodes.item.classList &&
              _domNodes.item.classList.contains(_kDivType) &&
              _domNodes.item.getAttribute &&
              _domNodes.item.getAttribute('qowt-divtype') === _kDivType;
        }

        _init();
        return _verifyInternals() ? _api : undefined;
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
