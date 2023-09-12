// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The shape item pan widget encapsulates the part of HTML DOM
 * representing an shapeItem widgets that appears in this shape pane.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */


define([
  'common/mixins/ui/cvoxSpeak',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/shapeItem',
  'qowtRoot/widgets/ui/spacer'
], function(
    CvoxSpeak,
    PubSub,
    DomListener,
    I18n,
    ShapeItem,
    SpacerWidget) {

  'use strict';

  var _factory = {

    /**
     * Create a new shape pane widget populated with a grid of shape
     * squares.
     *
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kShapeItemsPane = {
          className: 'qowt-shape-pane qowt-menuPane',
          node: 'div'
        };
        /**
         * A map of the shape item widget making up our shape pane.
         * @private
         */
        var _shapeItems = {};
        /**
         * A map of the html elements making up our color picker.
         * @private
         */
        var _domNodes = {};
        var subMenuActive_ = false;
        var shapePaneItems_ = [], arrowPaneItems_ = [], calloutPaneItems_ = [],
            equationPaneItems_ = [];
        var shape1stPaneItems = [], shape2ndPaneItems = [],
            shape3rdPaneItems = [];
        var selectedItemRow_ = -1;
        var selectedItemColumn_ = -1;
        var maxColumns_ = 12;
        var selectedShapePaneRow_ = -1;
        var shapes_ = I18n.getMessage('menu_item_shapes');
        var arrows_ = I18n.getMessage('menu_item_arrows');
        var callouts_ = I18n.getMessage('menu_item_callouts');
        var equation_ = I18n.getMessage('menu_item_equation');
        var closePane_ = hidePane_.bind(this);
        var selectFirstItem_ = selectFirstMenuItem_.bind(this);

        var _api = {

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           *
           * @param {Node} node The HTML node that this widget is to append
           *                    itself to.
           */
          appendTo: function(node) {
            if (node !== undefined) {
              node.appendChild(_domNodes.shapeItemsPane);
              _initShapeItems(config.items);
            }
          },

          /**
           * Query the shapeItemsPane HTML element.
           * Use by container widgets.
           * @return {element} the shape items pane element.
           */
          getElement: function() {
            return _domNodes.shapeItemsPane;
          },

          /**
           * Adds the given item to the shape items pane.
           * @param {object} widget A widget, that can be a shape or a spacer
           */
          addItem: function(widget) {
            widget.appendTo(_domNodes.shapeItemsPane);
          },

          /**
           * Sets the position of shape items pane.
           * @param {Number} left - left position.
           * @param {Number} top - top position.
           */
          setPosition: function(left, top) {
            _domNodes.shapeItemsPane.style.left = left;
            _domNodes.shapeItemsPane.style.top = top;
          },

          /**
           * Show the shape items pane by setting its display to block.
           */
          show: function() {
            if (!subMenuActive_) {
              _domNodes.shapeItemsPane.style.display = 'block';
              _domNodes.shapeItemsPane.style.opacity = '1';
              subMenuActive_ = true;
              selectedItemRow_ = -1;
              selectedItemColumn_ = -1;
              selectedShapePaneRow_ = -1;
              //Publish signal to inform respective menu to be selected
              PubSub.publish('qowt:shapeSubPaneOpened');
            }
          },

          /**
           * Gets all menu items within a menu pane.
           *
           * @return {object} menu items of a menu pane
           */
          getItems: function() {
            return _shapeItems;
          },

          /**
           * Hide the shape items pane by setting its display to none.
           */
          hide: function() {
            if (subMenuActive_) {
              _api.deselectItem();

              _domNodes.shapeItemsPane.style.display = 'none';
              // Setting opacity to '0' fixes a bug (272974) on Chromebook Pixel
              // where the scrollbars are still visible when the menu is hidden
              _domNodes.shapeItemsPane.style.opacity = '0';
              subMenuActive_ = false;
              //Publish signal to inform respective menu to blur
              PubSub.publish('qowt:shapeSubPaneClosed');
              if(_domNodes.shapeItemsPane.parentElement) {
                _domNodes.shapeItemsPane.parentElement.focus();
              }
            }
          },

          deselectItem: function() {
            var activePaneItems = _api.getActivePaneItems();
            if (_api.isShapesSubPaneOpened()) {
              activePaneItems = getShapeSubPaneItems(selectedShapePaneRow_);
            }
            var item = getSelectedPaneItem(activePaneItems);
            if (item) {
              item.getNode().classList.remove('selected');
              item.getNode().setAttribute('aria-selected', false);
              item.getNode().blur();
            }
            selectedItemRow_ = -1;
            selectedItemColumn_ = -1;
            selectedShapePaneRow_ = -1;
          },

          isSubMenuPaneOpened: function() {
            return subMenuActive_;
          },

          handleKey_: function(key) {
            handleKeyDown_(key);
          },

          getFocusedCell: function() {
            return {
              shapePaneRow: selectedShapePaneRow_,
              gridRow: selectedItemRow_,
              gridCol: selectedItemColumn_
            };
          },

          isFirstRowCellFocused: function() {
            return selectedItemRow_ === 0;
          },


          isFirstColumnCellFocused: function() {
            return selectedItemColumn_ === 0;
          },


          isLastColumnCellFocused: function(items) {
            return selectedItemColumn_ === maxColumns_ - 1 ||
                (selectedItemRow_ === getTotalRows_(items) - 1 &&
                (selectedItemColumn_ === (items.length % maxColumns_) - 1));
          },

          isLastRowCellFocused: function(items) {
            return selectedItemRow_ === getTotalRows_(items) - 1;
          },

          isShapesSubPaneOpened: function() {
            return _domNodes.shapeItemsPane.id === 'Shapes';
          },

          //This is specifically to be used in E2E tests.
          getShapesActivePaneIdx: function() {
            return selectedShapePaneRow_;
          },

          //This is specifically to be used in E2E tests.
          getShapePaneItems: function(idx) {
            return getShapeSubPaneItems(idx);
          },

          /**
           * Returns array of items for respective menu.
           * @return {Array}
           */
          getActivePaneItems: function() {
            var activePaneItems;
            if (subMenuActive_) {
              var activePaneId = _domNodes.shapeItemsPane.id;
              switch (activePaneId) {
                case shapes_:
                  activePaneItems = shapePaneItems_;
                  break;
                case arrows_:
                  activePaneItems = arrowPaneItems_;
                  break;
                case callouts_:
                  activePaneItems = calloutPaneItems_;
                  break;
                case equation_:
                  activePaneItems = equationPaneItems_;
                  break;
              }
            }
            return activePaneItems;
          }

        };

        var _initShapeItems = function(items) {
          var widget;
          items.forEach(function(item) {
            if (item.type === 'spacer') {
              widget = SpacerWidget.create(item);
            } else {
              widget = ShapeItem.create({
                value: item,
                action: 'initAddShape'
              });
              _shapeItems[item] = widget;
            }
            populateItemsInArray_(item);
            populateShapeSubPaneItems_();
            _api.addItem(widget);
          });
        };

        /**
         * Segregate items in an array based on their menu. Menus are- Shapes,
         * Arrows, Callouts & Equation.
         *
         * @param {dom nodes} item - menu item to be added in array.
         * @private
         */
        var populateItemsInArray_ = function(item) {

          var menu = _domNodes.shapeItemsPane.id;
          switch (menu) {
            case shapes_:
              shapePaneItems_.push(item);
              break;
            case arrows_:
              arrowPaneItems_.push(item);
              break;
            case callouts_:
              calloutPaneItems_.push(item);
              break;
            case equation_:
              equationPaneItems_.push(item);
              break;
          }
        };

        var populateShapeSubPaneItems_ = function() {

          var spacerIdx = _.findIndex(shapePaneItems_, { type: 'spacer' });
          var spacerIdx2 = _.findLastIndex(shapePaneItems_, { type: 'spacer'});

          shape1stPaneItems = shapePaneItems_.slice(0, spacerIdx);
          shape2ndPaneItems = shapePaneItems_.slice(spacerIdx + 1, spacerIdx2);
          shape3rdPaneItems = shapePaneItems_.slice(spacerIdx2 + 1);
        };

        var setActiveShapeSubPaneId_ = function(subPaneIdx) {
          selectedShapePaneRow_ = subPaneIdx;
        };

        /**
         * Trigger this shape item's pane action on mouse over.
         *
         * @param {event=} opt_event The triggering event.
         *                          Undefined if invoked via keyboard shortcut.
         *
         * @private
         */
        var _handleMouseOverEvent = function(/* opt_event */) {
          _api.show();
        };

        /**
         *  Handles key down action on pane.
         *
         * @param {String} key - key pressed (left/right/up/down)
         * @private
         */
        var handleKeyDown_ = function(key) {
          var action = key;
          var itemToFocus;
          var activePaneItems = _api.getActivePaneItems();
          var currentSelectedItem;

          if (_api.isShapesSubPaneOpened()) {
            activePaneItems = getShapeSubPaneItems(selectedShapePaneRow_);
          }
          currentSelectedItem = anyPaneItemFocused() &&
              getSelectedPaneItem(activePaneItems);


          switch (action) {

            case 'enter':
              if (currentSelectedItem) {
                currentSelectedItem.set();
              }
              break;

            case 'up':

              itemToFocus = handleUpKey_(currentSelectedItem, activePaneItems);
              break;

            case 'down':

              itemToFocus =
                  handleDownKey_(currentSelectedItem, activePaneItems);

              break;

            case 'right':

              itemToFocus =
                  handleRightKey_(currentSelectedItem, activePaneItems);
              break;

            case 'left':

              itemToFocus =
                  handleLeftKey_(currentSelectedItem, activePaneItems);

              break;
          }

          if (currentSelectedItem) {
            currentSelectedItem.getNode().classList.remove('selected');
            currentSelectedItem.getNode().setAttribute('aria-selected', false);
          }

          if (itemToFocus) {
            itemToFocus.getNode().classList.add('selected');
            itemToFocus.getNode().setAttribute('aria-selected', true);
            itemToFocus.getNode().focus();
            //CvoxSpeak.speakShapeSubMenuItem(itemToFocus.getNode());
            PubSub.publish('qowt:shapeItem:selected');
          }

        };


        var handleUpKey_ = function(currentSelectedItem, activePaneItems) {
          if (currentSelectedItem) {
            // Do nothing on up key when selection is at first row
            if (!_api.isFirstRowCellFocused()) {
              if (selectedItemRow_ > 0 && selectedItemColumn_ >= 0) {
                selectedItemRow_--;
              }
            } else if (_api.isShapesSubPaneOpened() &&
                _api.isFirstRowCellFocused()) {

              selectedShapePaneRow_--;
              if (selectedShapePaneRow_ === 0) {
                selectedShapePaneRow_ = 3;
              }
              activePaneItems = getShapeSubPaneItems(selectedShapePaneRow_);
              setRowColForLastCell_(activePaneItems);
            }
          } else {
            // Select first item on up key when nothing is selected
            setRowColForFirstCell_();
          }
          return getSelectedPaneItem(activePaneItems);
        };


        var handleDownKey_ = function(currentSelectedItem, activePaneItems) {
          if (currentSelectedItem) {
            // Do nothing on down key when selection is at last row
            if (!_api.isLastRowCellFocused(activePaneItems)) {
              var isIndexOutOfBound = indexOutOfBound(selectedItemRow_ + 1,
                  selectedItemColumn_, activePaneItems);
              if (selectedItemRow_ >= 0 && selectedItemColumn_ >= 0 &&
                  !isIndexOutOfBound) {
                selectedItemRow_++;
              }
            } else if (_api.isShapesSubPaneOpened() &&
                _api.isLastRowCellFocused(activePaneItems)) {
              selectedShapePaneRow_++;
              if (selectedShapePaneRow_ > 3) {
                selectedShapePaneRow_ = 1;
              }
              setRowColForFirstCell_();
              activePaneItems = getShapeSubPaneItems(selectedShapePaneRow_);
            }

          } else {
            // Select first item on down key when nothing is selected
            setRowColForFirstCell_();
          }
          return getSelectedPaneItem(activePaneItems);
        };


        var handleLeftKey_ = function(currentSelectedItem, activePaneItems) {
          if (currentSelectedItem) {
            if (_api.isFirstColumnCellFocused()) {
              selectedItemColumn_ = maxColumns_ - 1;
              if (_api.isFirstRowCellFocused()) {
                selectedItemRow_ = getTotalRows_(activePaneItems) - 1;
                var remainder = (activePaneItems.length % maxColumns_);
                if (remainder !== 0) {
                  selectedItemColumn_ = remainder - 1;
                }
              } else {
                selectedItemRow_--;
              }
            } else {
              selectedItemColumn_--;
            }
          }
          else {
            setRowColForLastCell_(activePaneItems);
          }
          return getSelectedPaneItem(activePaneItems);
        };


        var handleRightKey_ = function(currentSelectedItem, activePaneItems) {
          if (currentSelectedItem) {
            if (_api.isLastColumnCellFocused(activePaneItems)) {
              selectedItemColumn_ = 0;
              if (_api.isLastRowCellFocused(activePaneItems)) {
                selectedItemRow_ = 0;
              } else {
                selectedItemRow_++;
              }
            } else {
              selectedItemColumn_++;
            }
          }
          else {
            setRowColForFirstCell_();
          }
          return getSelectedPaneItem(activePaneItems);
        };


        function anyPaneItemFocused() {
          return (selectedItemRow_ !== -1 && selectedItemColumn_ !== -1);
        }


        function getSelectedPaneItem(items) {

          var key = items[selectedItemRow_ * maxColumns_ + selectedItemColumn_];

          if (_domNodes.shapeItemsPane.id === 'Shapes') {
            var subPaneIdx = getShapeSubPaneIdx(key);
            setActiveShapeSubPaneId_(subPaneIdx);
          }
          return _shapeItems[key];
        }

        function getShapeSubPaneIdx(key) {
          var paneIdx = 0;
          if (_.indexOf(shape1stPaneItems, key) !== -1) {
            paneIdx = 1;
          } else if (_.indexOf(shape2ndPaneItems, key) !== -1) {
            paneIdx = 2;
          } else if (_.indexOf(shape3rdPaneItems, key) !== -1) {
            paneIdx = 3;
          }
          return paneIdx;
        }

        function getShapeSubPaneItems(paneIdx) {
          var items = shape1stPaneItems;
          if (paneIdx === 2) {
            items = shape2ndPaneItems;
          } else if (paneIdx === 3) {
            items = shape3rdPaneItems;
          }
          return items;
        }


        function getTotalRows_(items) {
          return Math.ceil(items.length / maxColumns_);
        }

        function indexOutOfBound(selectedRow, selectedColumn, totalItems) {
          return (selectedRow * maxColumns_ + selectedColumn) >=
              totalItems.length;
        }

        var setRowColForFirstCell_ = function() {
          selectedItemRow_ = 0;
          selectedItemColumn_ = 0;
        };

        var setRowColForLastCell_ = function(items) {
          selectedItemRow_ = getTotalRows_(items) - 1;
          var remainder = (items.length % maxColumns_);
          if (remainder !== 0) {
            selectedItemColumn_ = remainder - 1;
          } else {
            selectedItemColumn_ = maxColumns_ - 1;
          }
        };

        /**
         * Trigger this shape item's pane action on mouse out.
         *
         * @param {event=} opt_event The triggering event.
         *                          Undefined if invoked via keyboard shortcut.
         * @private
         */
        var _handleMouseOutEvent = function(/* opt_event */) {
          _api.hide();
        };

        function hidePane_() {
          _api.hide();
        }

        function selectFirstMenuItem_() {
          var activePaneItems = _api.getActivePaneItems();
          if (activePaneItems) {
            var firstItemOfPane = activePaneItems[0];
            setRowColForFirstCell_();
            var itemToFocus = _shapeItems[firstItemOfPane].getNode();
            itemToFocus.classList.add('selected');
            selectedShapePaneRow_ = 1;
            itemToFocus.setAttribute('aria-selected', true);
            CvoxSpeak.speakShapeSubMenuItem(itemToFocus);
          }
        }


        /**
         * @private
         */
        function _init() {
          _domNodes.shapeItemsPane = document.createElement(
              _kShapeItemsPane.node);
          _domNodes.shapeItemsPane.className = _kShapeItemsPane.className;
          _domNodes.shapeItemsPane.classList.add('qowt-main-toolbar');
          _domNodes.shapeItemsPane.id = config.string;
          _domNodes.shapeItemsPane.setAttribute('tabindex', '-1');
          _domNodes.shapeItemsPane.setAttribute('aria-label', config.string);
          subMenuActive_ = true;
          _api.hide();
          DomListener.addListener(_domNodes.shapeItemsPane, 'mouseover',
              _handleMouseOverEvent);
          DomListener.addListener(_domNodes.shapeItemsPane, 'mouseout',
              _handleMouseOutEvent);
          DomListener.addListener(_domNodes.shapeItemsPane, 'click',
              _handleMouseOutEvent);
          PubSub.subscribe('qowt:shapeSelectedMenuChanged', closePane_);
          PubSub.subscribe('qowt:dropdown:closed', closePane_);
          PubSub.subscribe('qowt:shapeSubmenuPane:opened', selectFirstItem_);

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
  return _factory;
});
