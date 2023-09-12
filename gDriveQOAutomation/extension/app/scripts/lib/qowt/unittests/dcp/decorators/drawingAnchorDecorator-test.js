// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/dcp/decorators/drawingAnchorDecorator',
  'qowtRoot/unittests/__unittest-util'
], function(DrawingAnchorDecorator,
            UnittestUtils) {

  'use strict';

  var _testAppendArea, _rootNode, _drawElement, _parentPara;

  beforeEach(function() {
    _testAppendArea = UnittestUtils.createTestAppendArea();
    _rootNode = document.createElement('DIV');
    _rootNode.setAttribute('qowt-divType', 'page');
    _rootNode.id = 'qowt-msdoc';

    _testAppendArea.appendChild(_rootNode);

    _drawElement = window.document.createElement('div');
    _parentPara = window.document.createElement('p');
  });

  afterEach(function() {
    _testAppendArea.clear();
    _testAppendArea = undefined;
    _rootNode = undefined;
    _parentPara = undefined;
    _drawElement = undefined;
  });

  describe('drawingAnchorDecorator', function() {
    it('should be defined', function() {
      expect(DrawingAnchorDecorator.decorate).toBeDefined();
    });

    it('should position image at proper place and sets correct relative ' +
        'Z order', function() {
          var _dcp = {
           el: {
             wst: 'ftx',
             acr: {
               hrf: 'lce',
               vrf: 'tre',
               rzo: 678,
               rec: {
                 'lft': 450647,
                 'top': 0
               }
             }
           },
           node: _parentPara
         };
          DrawingAnchorDecorator.decorate(_drawElement, _dcp, _parentPara);
          expect(_drawElement.style.top).toBe('0px');
          expect(parseFloat(_drawElement.style.left)).toBeCloseTo(
              47.31202099, 0);
          expect(_drawElement.style.left.substr(-2)).toBe('px');
          expect(_drawElement.style.zIndex).toBe('678');
          expect(_drawElement.style.position).toBe('absolute');
        });

    it('should position image at proper place and sets correct negative ' +
        'relative Z order', function() {
          var _dcp = {
            el: {
              wst: 'btx',
              acr: {
                hrf: 'lce',
                vrf: 'tre',
                rzo: -100,
                rec: {
                  'lft': 450647,
                  'top': 69621
                }
              }
            },
            node: _parentPara
          };
          DrawingAnchorDecorator.decorate(_drawElement, _dcp, _parentPara);
          expect(parseFloat(_drawElement.style.top)).toBeCloseTo(
              7.30929133, 0);
          expect(_drawElement.style.top.substr(-2)).toBe('px');

          expect(parseFloat(_drawElement.style.left)).toBeCloseTo(
              47.31202099, 0);
          expect(_drawElement.style.left.substr(-2)).toBe('px');

          expect(_drawElement.style.zIndex).toBe('-100');
          expect(_drawElement.style.position).toBe('absolute');
        });
  });
});
