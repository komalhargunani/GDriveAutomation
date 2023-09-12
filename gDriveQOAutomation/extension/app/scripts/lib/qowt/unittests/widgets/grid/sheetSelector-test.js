// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test suite for the sheet selector widget
 */

define([
  'qowtRoot/utils/device',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/sheetSelector',
  'qowtRoot/models/sheet'
], function(
    Device,
    PubSub,
    SheetSelector,
    SheetModel) {

  'use strict';

  describe('A workbook sheet selector', function() {
    var _widget, _selectorElement, _scrollableContainer, _scrollableButtons,
        _sheetSelector;

    var subscriptions;

    beforeEach(function() {
      _sheetSelector = document.createElement('div');
      _sheetSelector.classList.add('qowt-sheet-selector');
      _sheetSelector.style.position = 'absolute';
      document.body.appendChild(_sheetSelector);

      subscriptions = [];
      _widget = SheetSelector;
      _widget.init();
    });

    afterEach(function() {
      _widget = undefined;
      _selectorElement = undefined;
      _scrollableContainer = undefined;
      _scrollableButtons = undefined;

      document.body.removeChild(_sheetSelector);
      _sheetSelector = undefined;

      if (subscriptions && subscriptions.length > 0) {
        for (var ix = 0; ix < subscriptions.length; ix++) {
          PubSub.unsubscribe(subscriptions[ix]);
        }
      }
    });

    it('should be in an initialised state after construction', function() {
      expect(_widget).toBeDefined();
    });

    it('should not create a tab if no name is given as a string parameter to' +
        ' createTab', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab();
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          expect(_selectorElement.childNodes.length).toBe(0);
        });

    it('should create proper roles to sheet selector element and tabs created',
       function() {
         _widget.appendTo(_sheetSelector);
         _widget.createTab('Sheet 1');
         _selectorElement = document.getElementsByClassName(
             'qowt-sheet-selector-element')[0];
         expect(_selectorElement.getAttribute('role')).toBe('tablist');
         expect(_selectorElement.childNodes.length).toBeGreaterThan(0);
         var tabElement = _selectorElement.childNodes[0];
         expect(tabElement.getAttribute('role')).toBe('tab');
       });

    it('should create a tab if a name is supplied as a string parameter to' +
        ' createTab ', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab('Sheet 1');
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          expect(_selectorElement.childNodes.length).toBeGreaterThan(0);
        });

    it('should not remove a tab if no name is supplied as a string parameter' +
        ' to removeTab', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab('Sheet 1');
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          _widget.removeTab();
          expect(_selectorElement.childNodes.length).toBe(1);
        });

    it('should remove a tab if a name is supplied as a string parameter to' +
        ' removeTab', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab('Sheet 1');
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          _widget.removeTab('Sheet 1');
          expect(_selectorElement.childNodes.length).toBe(0);
        });

    it('should remove all tabs if removeAllTabs is called', function() {
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _widget.createTab('Sheet 2');
      _widget.createTab('Sheet 3');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      expect(_selectorElement.childNodes.length).toBe(3);
      _widget.removeAllTabs();
      expect(_selectorElement.childNodes.length).toBe(0);
    });

    it('should set a tab as active', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      expect(_selectorElement.childNodes[0].classList.contains(
          'qowt-sheet-active-label')).toBeTruthy();
      expect(PubSub.publish).not.toHaveBeenCalled();
    });

    it('should set an active tab as inactive', function() {
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _widget.createTab('Sheet 2');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(1);
      expect(_selectorElement.childNodes[0].classList.contains(
          'qowt-sheet-active-label')).toBeFalsy();
    });

    it('should change the active tab', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.changeActiveTab(0);
      expect(_selectorElement.childNodes[0].classList.contains(
          'qowt-sheet-active-label')).toBeTruthy();
      expect(SheetSelector.getActiveTab()).toBe(0);
    });

    it('should focus a tab', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      expect(_selectorElement.childNodes[0].contentEditable).not.toBe('true');
      _widget.focusTab(0);
      expect(_selectorElement.childNodes[0].contentEditable).toBe('true');
      expect(PubSub.publish).not.toHaveBeenCalled();
    });

    it('should blur a tab', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      expect(_selectorElement.childNodes[0].contentEditable).not.toBe('true');
      _widget.focusTab(0);
      expect(_selectorElement.childNodes[0].contentEditable).toBe('true');
      _widget.blurTab(0, true);
      expect(_selectorElement.childNodes[0].contentEditable).toBe('false');
      expect(PubSub.publish).toHaveBeenCalledWith(
          'qowt:sheet:requestFocusLost');
    });

    it('should set the sheet name', function() {
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      _widget.setSheetName(0, 'hello');
      expect(_selectorElement.childNodes[0].textContent).toBe('hello');
      _widget.setSheetName(0, 'world');
      expect(_selectorElement.childNodes[0].textContent).toBe('world');
    });

    it('should get the sheet name', function() {
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _selectorElement = document.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      expect(_widget.getSheetName(0)).toBe('Sheet 1');
      _widget.setSheetName(0, 'another name');
      expect(_widget.getSheetName(0)).toBe('another name');
    });

    it('should create a scrollable buttons if not touch-enabled.', function() {
      spyOn(Device, 'isTouchDevice').andCallFake(function() {
        return false;
      });
      _widget.appendTo(_sheetSelector);
      expect(_sheetSelector.classList.contains('scroll-inactive')).toBe(true);
      _selectorElement = _sheetSelector.getElementsByClassName(
          'qowt-sheet-selector-element')[0];
      expect(_selectorElement).toBeDefined();
      _scrollableContainer = _sheetSelector.getElementsByClassName(
          'qowt-sheet-scroll-btn-container')[0];
      expect(_scrollableContainer).toBeDefined();
      _scrollableButtons = Array.prototype.slice.call(_scrollableContainer.
          getElementsByClassName('qowt-sheet-scroll-btn'), 0);
      expect(_scrollableButtons.length).toBe(2);
      expect(_scrollableButtons[0].classList.contains('left')).toBeTruthy();
      expect(_scrollableButtons[1].classList.contains('right')).toBeTruthy();
    });

    it('should publish a "qowt:sheet:requestFocus" signal if the user ' +
        'clicks on a tab that is not active', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab('Sheet 1');
          _widget.createTab('Sheet 2');
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          _widget.setActiveTab(0);
          SheetModel.activeSheetIndex = 0;

          spyOn(PubSub, 'publish').andCallThrough();
          var evt = document.createEvent('Event');
          evt.initEvent('mousedown');
          _selectorElement.childNodes[1].dispatchEvent(evt);

          expect(PubSub.publish).toHaveBeenCalledWith('qowt:sheet:requestFocus',
              {
                sheetIndex: 1,
                selectionEvent: evt,
                contentType: 'sheetTab'
              });
        });

    it('should not publish a "qowt:sheet:requestFocus" signal if the user ' +
        'clicks on a tab that is already active', function() {
          _widget.appendTo(_sheetSelector);
          _widget.createTab('Sheet 1');
          _widget.createTab('Sheet 2');
          _selectorElement = document.getElementsByClassName(
              'qowt-sheet-selector-element')[0];
          _widget.setActiveTab(0);
          SheetModel.activeSheetIndex = 0;

          spyOn(PubSub, 'publish').andCallThrough();
          var evt = document.createEvent('Event');
          evt.initEvent('mousedown');
          _selectorElement.childNodes[0].dispatchEvent(evt);

          expect(PubSub.publish).not.toHaveBeenCalled();
        });

    it('should throw if sheetSelector.init() called multiple times',
       function() {
         expect(SheetSelector.init).toThrow(
             'sheetSelector.init() called multiple times.');
       });

    it("should publish a 'qowt:sheet:requestFocus' signal if the user " +
      "double-clicks on a tab that is not being edited", function() {
      _widget.appendTo(_sheetSelector);
      _widget.createTab('Sheet 1');
      _widget.createTab('Sheet 2');
      _selectorElement = document.getElementsByClassName(
        'qowt-sheet-selector-element')[0];
      _widget.setActiveTab(0);
      SheetModel.activeSheetIndex = 0;

      spyOn(PubSub, 'publish').andCallThrough();
      var evt = document.createEvent("Event");
      evt.initEvent('mousedown');
      evt.dblClick = true;
      _selectorElement.childNodes[1].dispatchEvent(evt);

      expect(PubSub.publish).toHaveBeenCalledWith('qowt:sheet:requestFocus',
        {
          sheetIndex: 1,
          selectionEvent: evt,
          contentType: 'sheetTab'
        });
    });
  });
});
