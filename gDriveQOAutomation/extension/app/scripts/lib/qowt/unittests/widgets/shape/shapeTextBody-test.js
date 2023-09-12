/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test cases for shape text body widget
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/widgets/shape/shapeTextBody'
], function(
    UnitTestUtils,
    PubSub,
    DomTextSelection,
    ShapeTextBodyWidget) {

  'use strict';

  describe('Shape widget Tests', function() {
    var _shapeTextBodyWidget, _shapeTextBodyNode;

    beforeEach(function() {
      _shapeTextBodyNode = UnitTestUtils.createTestAppendArea();
      _shapeTextBodyNode.setAttribute('qowt-divtype', 'textBox');

      _shapeTextBodyWidget = ShapeTextBodyWidget.create(
        {fromNode:_shapeTextBodyNode});
    });

    afterEach(function() {
      UnitTestUtils.removeTestAppendArea();
      _shapeTextBodyNode = undefined;
      _shapeTextBodyWidget = undefined;
    });

    it('should activate text body widget', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(DomTextSelection, 'getRange').andReturn({});
      var expectedContext = {
        contentType: 'text',
        scope: _shapeTextBodyNode
      };
      _shapeTextBodyWidget.activate();
      expect(_shapeTextBodyNode.classList.contains('qowt-editable')).toBe(true);
      expect(_shapeTextBodyNode.getAttribute('spellcheck')).toBe('true');
      expect(_shapeTextBodyNode.getAttribute('contentEditable')).toBe('true');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:requestFocus',
          expectedContext);
    });

    it('should deactivate text body widget', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _shapeTextBodyWidget.activate();
      _shapeTextBodyWidget.deactivate();
      expect(_shapeTextBodyNode.classList.contains(
            'qowt-editable')).toEqual(false);
      expect(_shapeTextBodyNode.getAttribute('spellcheck')).toEqual('false');
      expect(_shapeTextBodyNode.getAttribute('contentEditable')).toEqual(null);
      expect(PubSub.publish.mostRecentCall.args[0]).
          toBe('qowt:requestFocusLost');
      expect(PubSub.publish.mostRecentCall.args[1].contentType).toBe('text');
    });

    it('should return shape text body node', function() {
      expect(_shapeTextBodyWidget.getWidgetElement()).toBe(_shapeTextBodyNode);
    });

    it('should hide placeholder text body', function() {
      var placeholderTextBodyNode = window.document.createElement('div');
      placeholderTextBodyNode.classList.add('placeholder-text-body');
      placeholderTextBodyNode.style.display = 'block';

      _shapeTextBodyNode.parentNode.appendChild(placeholderTextBodyNode);

      _shapeTextBodyWidget = ShapeTextBodyWidget.create(
          {fromNode: _shapeTextBodyNode});

      _shapeTextBodyWidget.activate();
      expect(placeholderTextBodyNode.style.display).toBe('none');
      UnitTestUtils.removeTestHTMLElement(placeholderTextBodyNode);
    });

    it('should show placeholder text body when no text is entered', function() {
      var placeholderTextBodyNode = window.document.createElement('div');
      placeholderTextBodyNode.classList.add('placeholder-text-body');
      placeholderTextBodyNode.style.display = 'block';
      _shapeTextBodyNode.parentNode.appendChild(placeholderTextBodyNode);

      _shapeTextBodyWidget = ShapeTextBodyWidget.create(
          {fromNode: _shapeTextBodyNode});
      _shapeTextBodyWidget.activate();
      _shapeTextBodyWidget.deactivate();

      expect(placeholderTextBodyNode.style.display).toBe('block');
      UnitTestUtils.removeTestHTMLElement(placeholderTextBodyNode);
    });

    it('should return correct paragraph count', function() {
      var oldParaCount = _shapeTextBodyWidget.getParagraphCount();

      _shapeTextBodyNode.appendChild(new QowtPointPara());

      var newParaCount = _shapeTextBodyWidget.getParagraphCount();
      expect(oldParaCount).toEqual(0);
      expect(newParaCount).toEqual(1);
    });

    it('should return correct paragraph node at given index', function() {
      var tempDiv = new QowtPointPara();
      _shapeTextBodyNode.appendChild(tempDiv);

      var anotherTempDiv = new QowtPointPara();
      _shapeTextBodyNode.appendChild(anotherTempDiv);

      expect(_shapeTextBodyWidget.getParagraphNode(0)).toEqual(tempDiv);
      expect(_shapeTextBodyWidget.getParagraphNode(1)).toEqual(anotherTempDiv);
    });

  });
});
