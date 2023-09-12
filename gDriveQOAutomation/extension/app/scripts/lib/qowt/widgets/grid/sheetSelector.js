// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The sheet selector widget encapsulates the part of the HTML
 * DOM representing a workbook that displays the sequence of tabs containing
 * the sheet names.
 * The user is able to click on these tabs to switch between sheets and
 * double-click on these tabs to rename sheets.
 * The sheet selector widget manages the construction and logic of these tabs.
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/features/utils',
    'qowtRoot/utils/domListener',
    'qowtRoot/utils/device',
    'qowtRoot/models/sheet',
    'qowtRoot/events/errors/sheetLoadError',
    'qowtRoot/selection/sheetSelectionManager'
  ], function(
    PubSub,
    Features,
    DomListener,
    Device,
    SheetModel,
    SheetLoadError,
    SheetSelectionManager) {

  'use strict';

  /**
   * Private constants
   */
  var _kParent_Node = {
    Draggable_Class: 'draggable',
    Active_Scroll: 'scroll-active',
    Inactive_Scroll_Class: 'scroll-inactive'
  },
    _kTab = {
      Tag: 'div',
      Class: 'qowt-sheet-label',
      Active_Class: 'qowt-sheet-active-label',
      Role: 'tab'
    },
    _kSelector_Wrapper = {
      Tag: 'div',
      Class: "qowt-sheet-selector-wrapper",
      Active_Class: 'qowt-sheet-selector-wrapper-active'
    },
    _kSelector_Cntr = {
      Tag: 'div',
      Class: 'qowt-sheet-selector-element',
      Role: 'tablist'
    },
    _kSelector_Shim = {
      Tag: 'div',
      Class: 'qowt-sheet-selector-shim'
    },
    _kScrollBtnCntr = {
      Tag: 'div',
      Class: 'qowt-sheet-scroll-btn-container'
    },
    _kScrollBtn = {
      Tag: 'div',
      Class: 'qowt-sheet-scroll-btn'
    },
    _kScrollBtn_Arrow_Template = "<span class='qowt-sheet-arrow-icon'></span>",
    _kScrollBtn_Left_Class = 'left',
    _kScrollBtn_Right_Class = 'right',
    _kCMD_Stop_Execute = "qowt:cmdStopExecute",
    // offsetWidth rounds down eg. 10.4, so we need to add extra pixel to the
    // selector width
    _kRoundUpSelectorWidth = 1,

    _kSignal_RequestFocus = "qowt:sheet:requestFocus",
    _kSignal_RequestFocusLost = "qowt:sheet:requestFocusLost";

  /**
   * Private DOM storage
   */
  var _DOMNodes = {
    parentNode: null,
    selectorWrapper: null,
    selectorCntr: null,
    selectorShim: null,
    scrollBtnCntr: null,
    scrollBtnLeft: null,
    scrollBtnRight: null,
    scrollBtnArrowIcn: null
  };

  /**
   * Private data
   */
  var _activeTab,
    _dragging = false,
    _dragTimeout, _selectorCntrWidth = 0,
    _scrollLeft = null,
    _scrollBy = 30,
    _sheetTabs = [],
    _x = null,
    _loadSubs,
    _dragSubs,
    _feedbackButtonWidth = 128,
    _scrollBtnCntrWidth = 75,
    _gapToRightEnd = 0,
    _destroyToken,
    _domListenerId = "sheetSelector",
    scrollTimeout_;

  var _api = {

    /**
     * Initialize this singleton - not called during load since we might
     * be running word/point.  This should be called by the layout control
     * aka the workbook
     */
    init: function() {
      _init();
    },

    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {
      _destroy();
    },

    /**
     * Creates a tab with the specified sheet name
     *
     * @param name {String} A sheet name
     */
    createTab: function(name) {
      var _tab;
      if (name !== undefined) {
        _tab = document.createElement(_kTab.Tag);
        _tab.className = _kTab.Class;
        _tab.id = _kTab.Class + "-" + _sheetTabs.length;
        _tab.textContent = "" + name;
        _tab.setAttribute('role',_kTab.Role);
        _tab.setAttribute('aria-selected',false);
        _tab.setAttribute('tabIndex', 0);
        _sheetTabs.push(_tab);
        DomListener.add(_tab.id, _tab, 'mousedown', function(event) {
          startTabSelection_(event, tabSelectionHandler_);
        });
        DomListener.add(_tab.id, _tab, 'dblclick', tabSelectionHandler_);
        if (Device.isTouchDevice()) {
          DomListener.add(_tab.id, _tab, 'touchend', function(event) {
            startTabSelection_(event, tabSelectionHandler_);
          });
        }

        if (_DOMNodes.selectorWrapper !== undefined &&
            _DOMNodes.selectorWrapper !== null &&
            _DOMNodes.selectorCntr !== undefined &&
            _DOMNodes.selectorCntr !== null) {
          _DOMNodes.selectorCntr.appendChild(_tab);
          _selectorCntrWidth += _getTabWidth(_tab);
        }
      }
      return _tab;
    },

    /**
     * Removes a tab with the specified sheet name
     *
     * @param name {String} A sheet name
     */
    removeTab: function(name) {
      if (name !== undefined) {
        if (_sheetTabs !== undefined && _sheetTabs.length > 0) {
          for (var i = 0, sheetLen = _sheetTabs.length; i < sheetLen; i++) {
            if (_sheetTabs[i].textContent.toUpperCase() ===
                name.toUpperCase()) {
              if (_DOMNodes.selectorWrapper !== undefined &&
                  _DOMNodes.selectorCntr !== undefined) {
                _selectorCntrWidth -= _getTabWidth(_sheetTabs[i]);
                DomListener.removeGroup(_sheetTabs[i].id);
                _DOMNodes.selectorCntr.removeChild(_sheetTabs[i]);
              }
              _sheetTabs.splice(i, 1);
              break;
            }
          }
        }
      }
      return _sheetTabs;
    },

    /**
     * Removes all tabs from the Sheet selector
     */
    removeAllTabs: function() {
      if (_sheetTabs !== undefined && _sheetTabs.length > 0) {
        for (var i = 0, sheetLen = _sheetTabs.length; i < sheetLen; i++) {
          if (_DOMNodes.selectorWrapper !== undefined &&
              _DOMNodes.selectorCntr !== undefined) {
            _DOMNodes.selectorCntr.removeChild(_sheetTabs[i]);
          }
        }
        _selectorCntrWidth = 0;
        _sheetTabs = [];
      }
      return _sheetTabs;
    },

    /**
     * Gets the index of the currently active tab
     */
    getActiveTab: function() {
      return _activeTab;
    },

    /**
     * Sets the active tab to be the one with the given index,
     * changing its styling to look different to the other tabs
     *
     * @param {integer} sheetIndex The sheet index of a tab
     */
    setActiveTab: function(sheetIndex) {
      _setActiveTab(sheetIndex);
    },

    /**
     * Changes the active tab to be the one with the given index
     *
     * @param {integer} sheetIndex The sheet index of a tab
     */
    changeActiveTab: function(sheetIndex) {
      _api.setActiveTab(sheetIndex);
    },

    /**
     * Focuses the tab with the given index in
     * order to allow the sheet name to be edited
     *
     * @param {integer} sheetIndex The sheet index of a tab
     */
    focusTab: function(sheetIndex) {
      var tab = _sheetTabs[sheetIndex];
      if(tab) {
        // make the tab content editable
        tab.contentEditable = true;

        // select the entire text
        var range = document.createRange();
        var sel = window.getSelection();
        range.selectNodeContents(tab);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },

    /**
     * Refocus the tab with the given index and the selection information.
     *
     * @param {Number} sheetIndex - The sheet index of a tab
     * @param {Object} selection - selection information having the range/caret
     *    position that was last selected for editing/renaming.
     */
    refocusTab: function(sheetIndex, selection) {
      var tab = _sheetTabs[sheetIndex];
      if (tab && selection) {
        // make the tab content editable
        tab.contentEditable = true;

        //set selection range/caret position.
        var range = document.createRange();
        var sel = window.getSelection();
        //if it is a forward selection of text then start node is anchorNode.
        if (selection.anchorOffset < selection.focusOffset) {
          range.setStart(selection.anchorNode, selection.anchorOffset);
          range.setEnd(selection.focusNode, selection.focusOffset);
        }
        else {
          //address reverse selection(back to front).
          range.setStart(selection.focusNode, selection.focusOffset);
          range.setEnd(selection.anchorNode, selection.anchorOffset);
        }
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },

    /**
     * Blurs the tab with the given index in
     * order to end editing of the sheet name
     *
     * @param {integer} sheetIndex The sheet index of a tab
     * @param {boolean} endEditing - true if we are done with editing, false
     *    in case if error occurs(eg. entering illegal character).
     */
    blurTab: function(sheetIndex, endEditing) {
      var tab = _sheetTabs[sheetIndex];
      if(tab) {
        tab.contentEditable = false;
      }
      //loose the focus only if user is done with editing, not when (s)he has
      //entered erroneous name that still needs to be corrected.
      if (endEditing) {
        looseTheFocusOnTab_();
      }
    },

    /**
     * Gets the name of the sheet with the given index
     *
     * @param {integer} sheetIndex The sheet index
     */
    getSheetName: function(sheetIndex) {
      var name;
      if(sheetIndex >= 0) {
        var tab = _sheetTabs[sheetIndex];
        if(tab) {
          name = tab.textContent;
        }
      }
      return name;
    },

    /**
     * Sets the name of the sheet with the given index
     *
     * @param {integer} sheetIndex The sheet index
     * @param {string} sheetName The sheet name to set
     */
    setSheetName: function(sheetIndex, sheetName) {
      if(sheetIndex >= 0) {
        var tab = _sheetTabs[sheetIndex];
        if(tab) {
          tab.textContent = sheetName;
        }
      }
    },

    /**
     * Gets the node of the tab with the given index
     *
     * @param {integer} sheetIndex The sheet index
     */
    getTab: function(sheetIndex) {
      var node;
      if((sheetIndex >= 0) && (sheetIndex <= _sheetTabs.length - 1)) {
        node = _sheetTabs[sheetIndex];
      }
      return node;
    },

    /**
     * Resize the selector, based on the current sheet name length
     */
    resizeSelector: function(){
        _applySelectorCntrWidth();
        _toggleScrollBtns();
    },
    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a specified
     * node in the HTML DOM.
     *
     * @param node {Object} The HTML node that this widget is to attach
     *                      itself to
     */
    appendTo: function(node) {
      if (node === undefined) {
        throw ("appendTo - missing node parameter!");
      }

      if (node) {
        _DOMNodes.parentNode = node;
        _DOMNodes.parentNode.appendChild(_DOMNodes.selectorWrapper);

        if (Device.isTouchDevice()) {
          _DOMNodes.parentNode.classList.add(_kParent_Node.Draggable_Class);
        }
        //We now have scrollers for touch devices as well.
        _DOMNodes.parentNode.classList.add(
            _kParent_Node.Inactive_Scroll_Class);
        _DOMNodes.parentNode.appendChild(_DOMNodes.scrollBtnCntr);
      }
    },
    /**
     * This is a particularly used to validate the tab contents
     * from the Sheet tab tool. Since duplicate names for the
     * sheet(s) are not permitted.
     *
     * @param sheetIdx Sheet number for which the name is being validated
     *        for duplicacy.
     * @param sheetName Sheet name
     * @return {Boolean} whether it is duplicate of another sheet name.
     */
   isDuplicateTabName : function(sheetIdx, sheetName){
      return _sheetTabs.some(function(tab,index){
          return (index !== sheetIdx &&
            tab.textContent.toUpperCase() === sheetName.toUpperCase());
      });
   },

   getSelectorWrapper: function() {
     return _DOMNodes.selectorWrapper;
   },

    switchToNextSheet: function() {
      var nextTabIndex = _activeTab + 1;
      if (nextTabIndex < _sheetTabs.length) {
        publishChangeSheet_(nextTabIndex);
      }
    },

    switchToPreviousSheet: function() {
      var previousTabIndex = _activeTab - 1;
      if (previousTabIndex >= 0) {
        publishChangeSheet_(previousTabIndex);
      }
    },

    getSheetTabs: function() {
      return _sheetTabs;
    }
  };

  /**
   * Add mouse event listeners on the selector wrapper so that the draggable
   * feature is supported for sheet tabs on the touch devices
   *
   * @private
   */
  var addListenersForMouseEvents_ = function() {
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'mousedown',
        _startDragTabs);
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'mousemove',
        _dragTabs);
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'mouseup',
        _stopDragTabs);
    DomListener.add(_domListenerId, window, 'mouseout', _terminateDrag);
  };

  /**
   * Add touch event listeners on the selector wrapper so that the draggable
   * feature is supported for sheet tabs on the touch devices
   *
   * @private
   */
  var addListenersForTouchEvents_ = function() {
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'touchstart',
        _startDragTabs);
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'touchmove',
        _dragTabs);
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper, 'touchend',
        _stopDragTabs);
    DomListener.add(_domListenerId, window, 'touchleave', _terminateDrag);
  };

  /**
   * Initialisation method that is called on construction of the widget.
   * This method should cause no HTML render tree relayouts to occur.
   * @private
   */
  var _init = function() {
    if (_destroyToken) {
      throw new Error('sheetSelector.init() called multiple times.');
    }
    _DOMNodes.selectorWrapper = document.createElement(_kSelector_Wrapper.Tag);
    _DOMNodes.selectorWrapper.classList.add(_kSelector_Wrapper.Class);
    _DOMNodes.selectorWrapper.id = _kSelector_Wrapper.Class;

    _DOMNodes.selectorCntr = document.createElement(_kSelector_Cntr.Tag);
    _DOMNodes.selectorCntr.classList.add(_kSelector_Cntr.Class);
    _DOMNodes.selectorCntr.setAttribute("role", _kSelector_Cntr.Role);

    _DOMNodes.selectorWrapper.appendChild(_DOMNodes.selectorCntr);
    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper,
        'mousedown', handleMouseDownOnSelectionWrapper_);

    //We now have scrollers for touch devices as well.
    _createScrollBtns();
    DomListener.add(_domListenerId, window, 'resize', _toggleScrollBtns);
    //add mouse event listeners for the navigation buttons.
    DomListener.add(_domListenerId, _DOMNodes.scrollBtnCntr, 'click',
        _scrollTabs);
    DomListener.add(_domListenerId, _DOMNodes.scrollBtnCntr, 'mousedown',
        _scrollTabs);
    DomListener.add(_domListenerId, _DOMNodes.scrollBtnCntr, 'mouseup',
        stopScroll_);

    // Add shortcut for switch to next sheet.
    var switchToNextSheetShortcutElm =
        document.createElement('core-keyboard-shortcut');
    switchToNextSheetShortcutElm.setAttribute('keycombo', 'CTRL+SHIFT+#34');
    switchToNextSheetShortcutElm.setAttribute('keycombo-osx', 'CMD+SHIFT+#34');
    switchToNextSheetShortcutElm.setAttribute('showShortcut', false);
    _DOMNodes.selectorWrapper.appendChild(switchToNextSheetShortcutElm);

    // Add shortcut for switch to previous sheet.
    var switchToPreviousSheetShortcutElm =
        document.createElement('core-keyboard-shortcut');
    switchToPreviousSheetShortcutElm.setAttribute('keycombo', 'CTRL+SHIFT+#33');
    switchToPreviousSheetShortcutElm.setAttribute('keycombo-osx',
        'CMD+SHIFT+#33');
    switchToPreviousSheetShortcutElm.setAttribute('showShortcut', false);

    _DOMNodes.selectorWrapper.appendChild(switchToPreviousSheetShortcutElm);

    DomListener.add(_domListenerId, _DOMNodes.selectorWrapper,
        'keyboard-shortcut', handleKeyboardShortcut_);

    if (Device.isTouchDevice()) {
      _createShim();
      //add touch event listeners for the navigation buttons.
      DomListener.add(_domListenerId, _DOMNodes.scrollBtnCntr, 'touchstart',
          _scrollTabs);
      DomListener.add(_domListenerId, _DOMNodes.scrollBtnCntr, 'touchend',
          stopScroll_);

      //add event listeners for the selectorWrapper, so that we enable the
      //draggable feature with track-pad and touch events
      addListenersForMouseEvents_();
      addListenersForTouchEvents_();
    }

    // In the viewer we want to make sure the "Report an issue" button never
    // covers any tabs and the scroll buttons.
    if (!Features.isEnabled('edit')) {
      _DOMNodes.selectorWrapper.style.marginRight = _feedbackButtonWidth + "px";
      _gapToRightEnd = _feedbackButtonWidth + _scrollBtnCntrWidth;
    }

    _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);

    _registerCommandEvents();
  };

  /**
   * Remove all html elements from their parents and destroy all references.
   * @private
   */
  var _destroy = function() {
    _api.removeAllTabs();
    if (_DOMNodes.parentNode) {
      _DOMNodes.parentNode.removeChild(_DOMNodes.selectorWrapper);
    }
    _DOMNodes.selectorWrapper = undefined;
    _DOMNodes.selectorCntr = undefined;

    if (_destroyToken) {
      DomListener.removeGroup(_domListenerId);
    }
    PubSub.unsubscribe(_destroyToken);

    _DOMNodes.scrollBtnCntr = undefined;
    _DOMNodes.scrollBtnLeft = undefined;
    _DOMNodes.scrollBtnRight = undefined;

    _DOMNodes.parentNode = undefined;
    _activeTab = undefined;
    _destroyToken = undefined;

    _unregisterCommandEvents();
  };

  /**
   * Register Application events for the Sheet Selector
   */
  var _registerCommandEvents = function() {
    _dragSubs=PubSub.subscribe(_kCMD_Stop_Execute, _setDraggableWidth);
    _loadSubs=PubSub.subscribe(_kCMD_Stop_Execute, _loadScrollBtns);
  };

  /**
   * Unregister Application events for the Sheet Selector
   */
  var _unregisterCommandEvents = function() {
    PubSub.unsubscribe(_dragSubs);
    PubSub.unsubscribe(_loadSubs);
  };

  /**
   * Creates a transparent shim (layer) above the selectorCntr to prevent any
   * tab events executing
   */
  var _createShim = function() {
      _DOMNodes.selectorShim = document.createElement(_kSelector_Shim.Tag);
      _DOMNodes.selectorShim.classList.add(_kSelector_Shim.Class);

      _DOMNodes.selectorWrapper.insertBefore(_DOMNodes.selectorShim,
          _DOMNodes.selectorCntr);
  };

  /**
   * Creates the scrollable buttons and appends them a scrollable container
   */
  var _createScrollBtns = function() {
      _DOMNodes.scrollBtnCntr = document.createElement(_kScrollBtnCntr.Tag);
      _DOMNodes.scrollBtnLeft = document.createElement(_kScrollBtn.Tag);
      _DOMNodes.scrollBtnRight = document.createElement(_kScrollBtn.Tag);

      _DOMNodes.scrollBtnCntr.classList.add(_kScrollBtnCntr.Class);
      _DOMNodes.scrollBtnCntr.style.width = _scrollBtnCntrWidth + "px";

      _DOMNodes.scrollBtnLeft.classList.add(_kScrollBtn.Class);
      _DOMNodes.scrollBtnLeft.classList.add(_kScrollBtn_Left_Class);

      _DOMNodes.scrollBtnRight.classList.add(_kScrollBtn.Class);
      _DOMNodes.scrollBtnRight.classList.add(_kScrollBtn_Right_Class);

      _DOMNodes.scrollBtnCntr.appendChild(_DOMNodes.scrollBtnLeft);
      _DOMNodes.scrollBtnCntr.appendChild(_DOMNodes.scrollBtnRight);

      _DOMNodes.scrollBtnLeft.innerHTML = _kScrollBtn_Arrow_Template;
      _DOMNodes.scrollBtnRight.innerHTML = _kScrollBtn_Arrow_Template;
    };

  /**
   * Gets the tabs width plus left and right margins.
   *
   * @param _tab {Node} HTMLElement to calculate width, left and right
   *                    dimensions against
   * @return {Number} A tab width
   */
  var _getTabWidth = function(_tab) {
      if (_tab !== undefined && _tab.nodeType === document.ELEMENT_NODE) {
        var _computedStyle = window.getComputedStyle(_tab, null);
        return _tab.offsetWidth +
            (parseInt(_computedStyle.getPropertyValue('margin-left'), 10) +
                parseInt(_computedStyle.getPropertyValue('margin-right'), 10));
      }
    };

  /**
   * Sets the Draggable Elements' width equal to the sum of all the tabs' width.
   *
   * @param signal {string} The pubSub signal qowt:cmdStopExecute.
   * @param detail {Object} Signal-specific data object.
   */
  var _setDraggableWidth = function(signal, detail) {
    if (signal === _kCMD_Stop_Execute && detail &&
        detail.name === "OpenWorkbookFile") {
      if (_DOMNodes.selectorCntr !== null) {
       _DOMNodes.selectorCntr.style.width =
         _selectorCntrWidth + _kRoundUpSelectorWidth + "px";
      }
    }
  };

  /**
   * A function to set the width of the sheetSelector element.
   * Basically calculates sum of all tabs width and applies it if this is
   * not equal to the current width.
   * @private
   */
  var _applySelectorCntrWidth = function() {
    var _allTabWidth = 0;
     _sheetTabs.forEach(function(_tab) {
        return _allTabWidth += _getTabWidth(_tab);
    });
     if(_selectorCntrWidth !== _allTabWidth) {
       _selectorCntrWidth = _allTabWidth;
         _DOMNodes.selectorCntr.style.width =
          _selectorCntrWidth + _kRoundUpSelectorWidth + "px";
     }
    };

  /**
   * Scrolls the selectorWrapper, either on the left or on the right based on
   * the navigation button that is clicked.
   *
   * @param {Boolean} scrollLeft - to decide whether to move left or right.
   * @private
   */
  var scroll_ = function(scrollLeft) {
    var valueBeforeScrolling = _DOMNodes.selectorWrapper.scrollLeft;

    if (scrollLeft) {
      _DOMNodes.selectorWrapper.scrollLeft -= _scrollBy;
    } else {
      _DOMNodes.selectorWrapper.scrollLeft += _scrollBy;
    }
    //This QOWT signal is only used in E2E's to know if the event is handled. As
    //of now, this signal has no other purpose apart from its usage in E2E's.
    PubSub.publish('qowt:sheetTabScrolled');

    //If user is holding the navigation button even when the right/left end is
    //reached and there is no more room to scroll, in such cases, instead of
    //hogging resources we stop scrolling.
    stopScroll_(_DOMNodes.selectorWrapper.scrollLeft === valueBeforeScrolling);
  };


  /**
   * Scroll Button event handler which "moves" left or right the selectorWrapper
   * via the scrollLeft property by the _scrollBy variable
   *
   * @param event {Object} The event object click and mousedown
   */
  var _scrollTabs = function(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      //scroll left if left navigation button is clicked, scroll right otherwise
      //Do the same if user clicks on the left/right navigation icon within the
      //button.
      var scrollLeft;
      scrollLeft = event.target.classList.contains(_kScrollBtn_Left_Class) ||
          event.target.parentNode.classList.contains(_kScrollBtn_Left_Class);

      if (event.type === 'click') {
        //on click we just need to move a bit.
        scroll_(scrollLeft);
      }
      else {
        //keep scrolling till the mouse is down.
        scrollTimeout_ = window.setInterval(scroll_, 100, scrollLeft);
      }
    }
  };


  /**
   * This function stops the scrolling of selectorWrapper that was initiated on
   * mousedown event.
   *
   * @param {Object,Boolean} event - The event object 'mouseup' OR a boolean to
   *    indicate whether to stop scrolling or not.
   * @private
   */
  var stopScroll_ = function(event) {
    if (event) {
      _scrollLeft = undefined;
      if (typeof scrollTimeout_ === 'number') {
        window.clearInterval(scrollTimeout_);
        scrollTimeout_ = undefined;
      }
    }
  };


  /**
   * Toggles the scrollBtnCntr into view by toggling
   * _kParent_Node.Inactive_Scroll_Class and _kParent_Node.Active_Scroll_Class
   * class on the parentNode
   */
  var _toggleScrollBtns = function() {
    if (_selectorCntrWidth && _DOMNodes.parentNode !== null) {
      if (_selectorCntrWidth + _gapToRightEnd >
          _DOMNodes.parentNode.scrollWidth) {
        if (!_DOMNodes.parentNode.classList.contains(
            _kParent_Node.Active_Scroll)) {
          _DOMNodes.parentNode.classList.toggle(
              _kParent_Node.Inactive_Scroll_Class);
          _DOMNodes.parentNode.classList.toggle(
              _kParent_Node.Active_Scroll);
        }
      } else {
        if (_DOMNodes.parentNode.classList.contains(
            _kParent_Node.Active_Scroll)) {
          _DOMNodes.parentNode.classList.toggle(_kParent_Node.Active_Scroll);
          _DOMNodes.parentNode.classList.toggle(
              _kParent_Node.Inactive_Scroll_Class);
        }
      }
    }
  };

  /**
   * Wraps the _toggleScrollBtns method and executes it when
   * "qowt:cmdStopExecute" is signalled
   *
   * @param signal {string} The pubSub signal qowt:cmdStopExecute.
   * @param detail {Object} A signal-specific data object.
   */
  var _loadScrollBtns = function(signal, detail) {
    if (signal === _kCMD_Stop_Execute &&
        detail && detail.name === "OpenWorkbookFile") {
      _toggleScrollBtns();
    }
  };

  /**
   * Start dragging the Sheet selector
   *
   * @param {Object} event - The event object onmousedown or ontouchstart
   */
  var _startDragTabs = function(event) {
      if (event !== undefined) {
        event.preventDefault();
        event.stopPropagation();

        if (!_dragging &&
            (_selectorCntrWidth + _gapToRightEnd >
                _DOMNodes.parentNode.scrollWidth)) {
          var x, scrollLeft;

          x = event.changedTouches ? event.changedTouches[0].clientX :
            event.clientX;
          scrollLeft = this.scrollLeft;
          _dragging = true;
          _dragTimeout = window.setTimeout(function() {
            _x = x;
            _scrollLeft = scrollLeft;
            _DOMNodes.selectorWrapper.classList.add(
                _kSelector_Wrapper.Active_Class);
          }, 150);
        }
      }
    };

  /**
   * Drags the element from left to right, only the x axis is manipulated
   *
   * @param event {Object} The event object onmousemove
   */
  var _dragTabs = function(event) {
      if (event !== undefined && _dragging &&
          _scrollLeft !== null && _x !== null) {

        var newX = event.changedTouches ? event.changedTouches[0].clientX :
          event.clientX;
        this.scrollLeft = _scrollLeft + _x - newX;
      }
    };

  /**
   * Stop dragging the Sheet selector
   *
   * @param event {Object} The event object onmouseup
   */
  var _stopDragTabs = function(event) {
      if (event !== undefined && _dragging) {
        if (typeof _dragTimeout === 'number') {
          window.clearTimeout(_dragTimeout);
        }
        _x = null;
        _scrollLeft = null;
        _dragging = false;
        _DOMNodes.selectorWrapper.classList.remove(
            _kSelector_Wrapper.Active_Class);
      }
    };

  /**
   * Terminates the dragging if a mouseout has occurred from a parent element
   * of the _parentNode and it's children
   *
   * @param event {Object} The event object onmouseout
   */
  var _terminateDrag = function(event) {
      if (event !== undefined) {
        var relatedTarget = event.targetTouches ? event.targetTouches[0] :
          ((event.relatedTarget) ? event.relatedTarget : event.toElement);

        while (relatedTarget && relatedTarget.tagName !== 'BODY') {
          if (relatedTarget.id === _DOMNodes.parentNode.id) {
            return;
          }
          relatedTarget = relatedTarget.parentNode;
        }
        _stopDragTabs(event);
      }
    };

  /**
   * Called when the user selects a tab, either by clicking on it or by
   * double-clicking on it
   *
   * @param {object} evt The event that has selected a tab
   */
  var tabSelectionHandler_ = function(evt) {
    //Plus 1 for the delimiter
    var classLength = _kTab.Class.length + 1;
    var sheetIndex = Number(evt.target.id.substring(classLength));

    if (sheetIndex >= 0 && isMeantToSwitchOrRenameTab_(sheetIndex, evt)) {
      requestFocusOnTab_(sheetIndex, evt);
    }
  };

  /**
   * Publishes a 'qowt:sheet:requestFocus' signal for
   * the given tab in response to the tab being selected
   *
   * @param {integer} sheetIndex The sheet index of a tab
   * @param {object} evt The event that has selected the tab
   */
  var requestFocusOnTab_ = function(sheetIndex, evt) {
    var obj = {
      sheetIndex: sheetIndex,
      selectionEvent: evt,
      contentType: 'sheetTab'
    };
    PubSub.publish(_kSignal_RequestFocus, obj);
  };


  /**
   * Publishes a 'qowt:sheet:requestFocusLost' signal
   * for a tab in response to the end of the processing
   * of it being selected.
   */
  var looseTheFocusOnTab_ = function() {
    PubSub.publish(_kSignal_RequestFocusLost);
  };


  /**
   * @param {Number} selectedSheetIndex - sheet index that has been clicked.
   * @param {Object} event - The event that has selected the tab
   *
   * @return {Boolean} True if we are meant to change or rename the sheet tab,
   *                   false otherwise.
   * @private
   */
  var isMeantToSwitchOrRenameTab_ = function(selectedSheetIndex, event) {
    if (!event) {
      return false;
    }

    var meantToSwitchTab = false;
    var meantToRenameTab = false;

    if (selectedSheetIndex !== SheetModel.activeSheetIndex) {
      meantToSwitchTab = true;

      //However we have slightly different notion for touch device. Lets ensure.
      if (event.type === 'touchend') {
        //threshold to handle quiver in the finger on Touch Device
        var THRESHOLD_FOR_POS_CHANGE = 5;
        var differenceInPos =
            _x ? Math.abs(event.changedTouches[0].clientX - _x) : 0;

        if (differenceInPos > THRESHOLD_FOR_POS_CHANGE) {
          meantToSwitchTab = false;
        }
      }
    } else if (event.type === 'dblclick') {
      meantToRenameTab = true;
    }

    return (meantToSwitchTab || meantToRenameTab);
  };


  /**
   * Sets the active tab to be the one with the given index
   *
   * @param {integer} sheetIndex The sheet index of a tab
   */
  var _setActiveTab = function(sheetIndex) {
      try {
        _applyActiveTabStyling(sheetIndex);
      }
      catch(ex) {
        var error = SheetLoadError.create();
        error.fatal = false;
        PubSub.publish('qowt:error', error);
      }
    };

  /**
   * Applies styling to the given tab to
   * indicate that this tab is the active tab
   *
   * @param {integer} index The sheet index of a tab
   */
  var _applyActiveTabStyling = function(index) {
      if ((index === undefined) || (index < 0) ||
          (index > _sheetTabs.length - 1)) {
        throw new Error("SheetSelector - tab index is out of range: " + index);
      }

      var label;
      if (_activeTab !== undefined) {
        label = _sheetTabs[_activeTab];
        if (label !== undefined) {
          label.classList.remove(_kTab.Active_Class);
          label.setAttribute('aria-selected',false);
          label.blur();
        }
      }
      _activeTab = index;
      label = _sheetTabs[_activeTab];
      if (label !== undefined) {
        label.classList.add(_kTab.Active_Class);
        label.scrollIntoView(false);
        label.setAttribute('aria-selected',true);
        label.focus();
      }
    };

  var startTabSelection_ = function(event, tabSelectionFun) {
    var currentSelection = SheetSelectionManager.getCurrentSelection();

    if (currentSelection && currentSelection.textWidget) {
      PubSub.subscribe('qowt:cmdCompleteCellEditStop', function() {
        // start tab selection once editor text commit is completed.
        tabSelectionFun(event);
      },
      {once: true, after: false});

      // commit editor text before tab selection starts.
      publishCommitChanges_(event);
    } else {
      tabSelectionFun(event);
    }
  };

  var publishCommitChanges_ = function(event) {
    // commit editor text before tab selection starts.
    PubSub.publish('qowt:sheet:commitChanges', {
      commitEvent: event
    });
  };


  var handleMouseDownOnSelectionWrapper_ = function(event) {
    var currentSelection = SheetSelectionManager.getCurrentSelection();
    if (currentSelection && currentSelection.textWidget) {
      // commit editor text.
      publishCommitChanges_(event);
    }
  };

  var handleKeyboardShortcut_ = function(event) {
    if (isSwitchToNextSheetShortCut_(event)) {
      startTabSelection_(event, _api.switchToNextSheet);
    } else if (isSwitchToPreviousSheetShortCut_(event)) {
      startTabSelection_(event, _api.switchToPreviousSheet);
    }
  };

  var publishChangeSheet_ = function(sheetIndex) {
    _api.setActiveTab(sheetIndex);
    PubSub.publish('qowt:doAction', {
      'action': 'changeSheet',
      'context': {
        contentType: 'sheet',
        newSheetIndex: sheetIndex
      }
    });
  };

  var isSwitchToNextSheetShortCut_ = function(event) {
    var result;
    if (event && event.detail && event.detail.item) {
      var keyCode = event.detail.item.keyCode_;

      if (keyCode === 34) {
        result = true;
      }
    }
    return result;
  };

  var isSwitchToPreviousSheetShortCut_ = function(event) {
    var result;
    if (event && event.detail && event.detail.item) {
      var keyCode = event.detail.item.keyCode_;

      if (keyCode === 33) {
        result = true;
      }
    }
    return result;
  };

  return _api;

});
