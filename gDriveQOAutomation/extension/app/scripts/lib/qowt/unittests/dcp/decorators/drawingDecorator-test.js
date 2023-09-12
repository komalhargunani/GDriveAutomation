// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for Drawing decorator
 * @author alok.guha@quickoffice.com (Alok Guha)
 */

define([
  'qowtRoot/dcp/decorators/drawingDecorator',
  'qowtRoot/unittests/__unittest-util'
], function(drawingDecorator,
            UnittestUtils) {

  'use strict';

  var _testAppendArea, _rootNode, _drawingElement;

  beforeEach(function() {
    _testAppendArea = UnittestUtils.createTestAppendArea();
    _rootNode = document.createElement('DIV');
    _rootNode.setAttribute('qowt-divType', 'page');
    _rootNode.id = 'qowt-msdoc';
    _testAppendArea.appendChild(_rootNode);

  });

  afterEach(function() {
    _testAppendArea.clear();
    _testAppendArea = undefined;
    _rootNode = undefined;
  });


  describe('DrawingDecorator', function() {
    it('should be defined', function() {
      expect(drawingDecorator.decorate).toBeDefined();
    });
  });

  describe('DrawingDecorator Div Expand test if rotation present',
      function() {
        var _config;
        beforeEach(function() {
          _config = {
            'eid': 'DRW3',
            'elm': [
              {
                'eid': 'PIC5',
                'elm': [
                  {
                    'eid': 'IMG6',
                    'etp': 'img',
                    'frmt': 'jpg',
                    'src': '/qo/.qwtemp/1_1'
                  }
                ],
                'etp': 'pic',
                'spPr': {
                  'xfrm': {
                    'ext': {
                      'cx': 952500,
                      'cy': 952500
                    },
                    'rot': 45
                  }
                }
              }
            ],
            'etp': 'drw'
          };
        });

        afterEach(function() {
          _config = undefined;
        });

        it('should increase the size of div to accomodate rotated image',
            function() {
              _drawingElement = window.document.createElement('div');
              drawingDecorator.decorate(_drawingElement, _config.elm[0].spPr);

              expect(parseFloat(_drawingElement.style.height)).toBeCloseTo(
                  141.4213562, 0);
              expect(_drawingElement.style.height.substr(-2)).toBe('px');

              expect(parseFloat(_drawingElement.style.width)).toBeCloseTo(
                  141.4213562, 0);
              expect(_drawingElement.style.width.substr(-2)).toBe('px');
            });

        it('should not change size of div id shapeProperties are absent',
            function() {
              _drawingElement = window.document.createElement('div');
              _config.elm[0].spPr = undefined;
              drawingDecorator.decorate(_drawingElement, _config.elm[0].spPr);
              expect(_drawingElement.style.height).toBe('');
              expect(_drawingElement.style.width).toBe('');
            });

        it('should not change size of div id rotation property is absent',
            function() {
              _drawingElement = window.document.createElement('div');
              _config.elm[0].spPr.xfrm.rot = undefined;
              drawingDecorator.decorate(_drawingElement, _config.elm[0].spPr);
              expect(_drawingElement.style.height).toBe('');
              expect(_drawingElement.style.width).toBe('');
            });
      });
});
