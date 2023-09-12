// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview  Return a style dropdown button configuration.
 * TODO(gbiagiotti) Rename optional properties: prepend 'opt_'.
 *
 * @param returns {object} A style button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {boolean} config.label True for a textual dropdown,
 *                False for a graphical dropdown.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {boolean} config.opt_scrollable Optional, when true it
 *                          makes the menu scrollable.
 * @param returns {object} config.subscribe Optional set of signals with
 *                callbacks that give button behaviours.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'common/elements/customSelector',
    'qowtRoot/utils/typeUtils',
    'qowtRoot/widgets/factory'
  ], function(
  CustomSelector,
    TypeUtils,
    WidgetFactory) {

  'use strict';

  var _factory = {
    /**
     * Create a new instance of a Style Dropdown Button widget.
     *
     * @public
     * @param {Function} opt_filter Custom filter to accpet or skip style
               entries from the style manager.
     * @param {Function} opt_sortFunc Custom filter to sort the model array.
     *         When invoked the filter will be passed a single Array argument.
     * @returns {object} A new Style dropdown button widget instance.
     */
    create: function(opt_filter, opt_sortFunc) {

      // use module pattern for instance object
      var _module = function() {
        var _api = {
          /**
           * Initialise the widget with whatever data is available at
           * construction time. We do this to ensure we are initialised
           * fully when constructed - and not assume we'll immediately get
           * module updates.
           * @public
           */
          // DuSk TODO: Need to have dropdown button widget actually
          // call this init().
          init: function() {
            // we just invoke our regular model update function
            _handleStyleList(this);
          },

          type: 'dropdown',
          label: true,
          action: 'style',
          opt_scrollable: true,

          id2Name: function(id) {
            return _getOfficeStyles() && _getOfficeStyles().getName(id);
          },

          preExecuteHook: function(name) {
            return {
              formatting: {
                'paraStyleId':
                    (_getOfficeStyles() && _getOfficeStyles().getId(name))
              }
            };
          },


          subscribe: {
            /*
             * Respond to notifications about style availability.
             * @public
             * @param {string} signal The signal name.
             */
            'qowt:styleListUpdate': function(signal) {
              if (signal === 'qowt:styleListUpdate') {
                // This is the signal that determines that the office document
                // styles element is ready for usage.
                _handleStyleList(this);
              }
            },

            /**
             * Respond to changes in current selection.
             * @public
             * @param {string} signal The signal name.
             * @param {string} signalData Contextual information about
             *                 the selection.
             */
            'qowt:selectionChanged': function(signal, signalData) {
              signal = signal || '';
              if (signalData.newSelection) {
                var node = signalData.newSelection.startContainer;
                _handleSelectionChanged(this, node);
              }
            },


            /**
             * Update the button status as a result of a changed formatting.
             * @param {string} signal The signal name.
             * @param {string} signalData Contextual information about
             *                 formatting.
             */
            'qowt:formattingChanged': function(signal, signalData) {
              signal = signal || '';
              if (_.has(signalData, 'formatting.paraStyleId')) {
                setStyle_(this, signalData.formatting.paraStyleId);
              }
            }
          },
          /**
           * Custom styling function to decorate the contained menu item
           * widgets in the drop down list. Called for each item that is set
           * in the drop down.
           *
           * @public
           * @param {Element} elm The element to decorate
           * @param {string} name The style name to apply to elm.
           */
          /* eslint-disable no-unused-vars */
          styleFunc: function(elm, name) {
            var officeStyles = _getOfficeStyles();
            var styleId =  officeStyles && officeStyles.getId(name);
            if (styleId) {
              // The purpose of adding style class here is to apply the style
              // to each item in the dropdown. However this is not happening
              // as expected on master. This will be tracked in QOC-1740
              // Commenting this code for now to avoid style getting applied
              // to dropdown items in case of shady dom.
              // elm.classList.add(officeStyles.getCssClassName(styleId));
            }
          }
          /* eslint-enable no-unused-vars */
        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

        /**
         * QowtOfficeStyles element that manages all the styles
         * in the Office document.
         * @private
         */
        var _officeStyles;

        function _getOfficeStyles() {
          _officeStyles =
              _officeStyles || document.getElementById('qowtOfficeStyles');

          return _officeStyles;
        }

        /*
         * Update our style list model as the underlying data has been updated.
         * @private
         * @param {object} control The object to update with the style list.
         */
        function _handleStyleList(control) {
          if (_getOfficeStyles() instanceof QowtOfficeStyles) {
            var list = _getOfficeStyles().getStyleNames(opt_filter);
            if (opt_sortFunc && TypeUtils.isFunction(opt_sortFunc)) {
              list = opt_sortFunc(list);
            }
            control.setItems(list, _api.styleFunc);
          }
        }

        /**
         * Update the button status as a result of a changed selection.
         * @private
         * @param {object} control The object to update from the selection.
         * @param {W3C node} node The start container of the selection.
         */
        function _handleSelectionChanged(control, node) {
          var widget, config = {
                'fromNode': node,
                'supportedActions': ['style']
              };

          var style;
          var element = CustomSelector.findInSelectionChain(['paraStyleId']);
          if (element) {
            style = element.paraStyleId;
          } else {
            widget = WidgetFactory.create(config);
            if (widget && widget.getStyleId) {
              style = widget.getStyleId();
            }
          }
          setStyle_(control, style);
        }


        /**
         * Update the button status
         * @private
         * @param {object} control The object to update from the selection.
         * @param {string} style The updated officeStyle
         */
        function setStyle_(control, style) {
          var name, officeStyles = _getOfficeStyles();
          if (officeStyles) {
            name = officeStyles.getName(style) ||
                officeStyles.getDefaultStyleName();
          }
          control.setSelectedItem(name);
        }

        return _api;

      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = _module();
      return instance;
    }
  };

  return _factory;
});
