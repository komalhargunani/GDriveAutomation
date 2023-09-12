/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/**
 * Place Holder Text Body handler Test
 */

define([
  'qowtRoot/dcp/pointHandlers/placeHolderTextBodyHandler',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/placeHolderDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/features/utils'
], function(PlaceHolderTextBodyHandler,
    CssManager,
    PlaceHolderDecorator,
    PlaceHolderManager,
    PointModel,
    PlaceHolderTextStyleManager,
    TestUtil,
    ShapeTextBodyHandler,
    Features) {

  'use strict';


  describe('verifying Place Holder Text Body handler input', function() {
    var _placeHolderTextBodyHandler = PlaceHolderTextBodyHandler;
    var _parentDiv, v;
    var _testUtils = TestUtil;
    var _testAppendArea = _testUtils.createTestAppendArea();

    beforeEach(function() {
      _parentDiv = _testAppendArea;

      v =
          {
            node: _parentDiv,
            el: {
              etp: 'phTxBody'
            }
          };

      spyOn(CssManager, 'addRule');
    });

    it('should not create css class for placeholder div, when Place Holder ' +
        'Text body JSON is undefined', function() {
          v = undefined;
          _placeHolderTextBodyHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

    it('should not create css class for placeholder div, when element in ' +
        'Place Holder Text body JSON is undefined', function() {
          v.el = undefined;
          _placeHolderTextBodyHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

    it('should not create css class for placeholder div, when element type ' +
        'in Place Holder Text body JSON is undefined', function() {
          v.el.etp = undefined;
          _placeHolderTextBodyHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

    it('should not create css class for placeholder div, when element type ' +
        'in Place Holder Text body is not -phTxBody-', function() {
          v.el.etp = 'xxx';
          _placeHolderTextBodyHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

  });

  describe('Place Holder Text Body handler Test', function() {
    var _placeHolderTextBodyHandler = PlaceHolderTextBodyHandler;
    var _parentDiv, v;
    var _testUtils = TestUtil;
    var _testAppendArea = _testUtils.createTestAppendArea();
    var _placeHolderManager = PlaceHolderManager;
    var _placeHolderTextStyleManager = PlaceHolderTextStyleManager;
    var _phDecorator = {
      decorate: function() {
      }
    };

    var _txStlDecorator = {
      decorate: function() {
      },
      decorateWithListStyle: function() {
      }
    };

    beforeEach(function() {
      PointModel.MasterSlideId = '102';

      _parentDiv = _testAppendArea;
      v =
          {
            node: _parentDiv,
            el: {
              etp: 'phTxBody'
            }
          };

      spyOn(CssManager, 'addRule');
      spyOn(PlaceHolderDecorator, 'create').andReturn(_phDecorator);
    });

    afterEach(function() {
      _testUtils.flushTestAppendArea();
      PointModel.MasterSlideId = undefined;
    });

    it('should not decorate text run div and paragraph div, when txStl is ' +
        'undefined  and current place holder is in slide-layout', function() {
          PointModel.currentPHLevel = 'sldlt';
          PointModel.SlideLayoutId = '111';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': undefined
          };

          spyOn(_txStlDecorator, 'decorate');

          _placeHolderTextBodyHandler.visit(v);

          expect(_txStlDecorator.decorate).not.toHaveBeenCalled();

          PointModel.currentPHLevel = undefined;
          PointModel.SlideLayoutId = undefined;
        });

    it('should not decorate text run div and paragraph div with list ' +
        'style, when txStl is undefined and current place holder is in ' +
        'master-layout', function() {
          PointModel.currentPHLevel = 'sldmt';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': undefined
          };

          spyOn(_txStlDecorator, 'decorateWithListStyle');

          _placeHolderTextBodyHandler.visit(v);

          expect(_txStlDecorator.decorateWithListStyle).not.toHaveBeenCalled();

          PointModel.currentPHLevel = undefined;
        });

    it('should cache master list style, when txStl is present and current ' +
        'place holder is in master-layout', function() {
          PointModel.currentPHLevel = 'sldmt';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': {
              'pPrArr': [
                {
                  pPrName: 'defPPr',
                  pPrValue: {
                    'defRPr': {
                      'udl': true
                    }
                  }
                }
              ]
            }
          };

          spyOn(_placeHolderTextStyleManager, 'cacheMasterListStyle');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheMasterListStyle).
              toHaveBeenCalledWith('body', v.el.txStl);

          PointModel.currentPHLevel = undefined;
        });

    it('should not cache master list style, when txStl is undefined and ' +
        'current place holder is in master-layout', function() {
          PointModel.currentPHLevel = 'sldmt';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': undefined
          };

          spyOn(_placeHolderTextStyleManager, 'cacheMasterListStyle');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheMasterListStyle).
              not.toHaveBeenCalled();

          PointModel.currentPHLevel = undefined;
        });

    it('should cache layout text style, when txStl is present and current ' +
        'place holder is in slide-layout', function() {
          PointModel.currentPHLevel = 'sldlt';
          PointModel.SlideLayoutId = '111';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': {
              'pPrArr': [
                {
                  pPrName: 'defPPr',
                  pPrValue: {
                    'defRPr': {
                      'udl': true
                    }
                  }
                }
              ]
            }
          };

          spyOn(_placeHolderTextStyleManager, 'cacheLayoutTextStyle');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheLayoutTextStyle).
              toHaveBeenCalledWith('body', '9', v.el.txStl);

          PointModel.currentPHLevel = undefined;
          PointModel.SlideLayoutId = undefined;
        });

    it('should not cache layout text style, when txStl is undefined and ' +
        'current place holder is in slide-layout', function() {
          PointModel.currentPHLevel = 'sldlt';
          PointModel.SlideLayoutId = '111';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': undefined
          };

          spyOn(_placeHolderTextStyleManager, 'cacheLayoutTextStyle');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheLayoutTextStyle).
              not.toHaveBeenCalled();

          PointModel.currentPHLevel = undefined;
          PointModel.SlideLayoutId = undefined;
        });

    it('should cache master body properties, when current place holder is ' +
        'in master-layout', function() {
          PointModel.currentPHLevel = 'sldmt';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': {
              'pPrArr': []
            }
          };

          spyOn(_placeHolderTextStyleManager, 'cacheMasterBodyProperties');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheMasterBodyProperties).
              toHaveBeenCalledWith('body', v.el.bodyPr);

          PointModel.currentPHLevel = undefined;
        });

    it('should cache layout body properties, when current place holder is ' +
        'in slide-layout', function() {
          PointModel.currentPHLevel = 'sldlt';
          PointModel.SlideLayoutId = '111';
          _placeHolderManager.updateCurrentPlaceHolderForLayouts('body', '9');

          v.el = {
            'etp': 'phTxBody',
            'bodyPr': 'some body properties',
            'txStl': {
              'pPrArr': []
            }
          };

          spyOn(_placeHolderTextStyleManager, 'cacheLayoutTextStyle');
          spyOn(_placeHolderTextStyleManager, 'cacheLayoutBodyProperties');

          _placeHolderTextBodyHandler.visit(v);

          expect(_placeHolderTextStyleManager.cacheLayoutBodyProperties).
              toHaveBeenCalledWith('body', '9', v.el.bodyPr);

          PointModel.currentPHLevel = undefined;
          PointModel.SlideLayoutId = undefined;
        });

    it('should call resetCurrentPlaceHolderForLayouts', function() {
      PointModel.currentPHLevel = 'sldlt';
      PointModel.SlideLayoutId = '111';

      v.el = {
        'etp': 'phTxBody',
        'bodyPr': 'some body properties',
        'txStl': {
          'pPrArr': []
        }
      };

      spyOn(_placeHolderTextStyleManager, 'cacheLayoutTextStyle');
      spyOn(_placeHolderManager, 'resetCurrentPlaceHolderForLayouts');

      _placeHolderTextBodyHandler.visit(v);

      expect(_placeHolderManager.resetCurrentPlaceHolderForLayouts).
          toHaveBeenCalled();

      PointModel.currentPHLevel = undefined;
      PointModel.SlideLayoutId = undefined;
    });

    it('should change isSlideView flag to false', function() {
      PointModel.isExplicitTextBody = true;

      _placeHolderTextBodyHandler.visit(v);

      expect(PointModel.isExplicitTextBody).toBe(false);
    });

    it('should create placeholder text body node', function() {
      spyOn(Features, 'isEnabled').andReturn(true);
      spyOn(ShapeTextBodyHandler, 'createShapeTextBodyDiv').
          andReturn(_testAppendArea);

      _placeHolderTextBodyHandler.visit(v);

      expect(ShapeTextBodyHandler.createShapeTextBodyDiv).toHaveBeenCalled();
      expect(_testAppendArea.classList.contains(
            'placeholder-text-body')).toBe(true);
      expect(_testAppendArea.style.zIndex).toBe('3');
    });
  });
});

