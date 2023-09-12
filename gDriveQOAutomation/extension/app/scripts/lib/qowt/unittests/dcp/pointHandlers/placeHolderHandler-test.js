/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/**
 * Place Holder handler Test
 */

define([
  'qowtRoot/dcp/pointHandlers/placeHolderHandler',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/placeHolderDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/models/point',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager'
], function(PlaceHolder,
    CssManager,
    PlaceHolderDecorator,
    PlaceHolderManager,
    ThemeStyleRefManager,
    PointModel,
    TestUtil,
    PlaceHolderPropertiesManager) {

  'use strict';


  describe('Place Holder handler Test', function() {
    var kPLACEHOLDER_ID = '123';
    var _placeHolderHandler = PlaceHolder;
    var _parentDiv, v;
    var _testUtils = TestUtil;
    var _testAppendArea = _testUtils.createTestAppendArea();
    var _placeHolderManager = PlaceHolderManager;
    var _themeStyleRefManager = ThemeStyleRefManager;
    var phDecorator = {
      decorate: function() {
      }
    };

    beforeEach(function() {
      spyOn(CssManager, 'addRule');
      PointModel.MasterSlideId = '102';
      PointModel.currentPHLevel = 'sldmt';

      _parentDiv = _testAppendArea;
      v =
          {
            node: _parentDiv,
            el: {
              etp: 'ph',
              nvSpPr: {
                phIdx: '11',
                phTyp: 'title',
                frm: 'sldmt',
                cntrId: 'someLayoutId'
              },
              eid: kPLACEHOLDER_ID,
              spPr: {}
            }
          };

      spyOn(PlaceHolderDecorator, 'create').andReturn(phDecorator);

    });

    afterEach(function() {
      _testUtils.flushTestAppendArea();
      PointModel.MasterSlideId = undefined;
      PointModel.currentPHLevel = undefined;
    });

    it('should not create css class and should not cache shape style for ' +
        'placeholder div when PlaceHolder JSON is undefined', function() {
          v = undefined;
          spyOn(_themeStyleRefManager, 'cacheShapeStyle');

          _placeHolderHandler.visit(v);
          expect(CssManager.addRule).not.toHaveBeenCalled();
          expect(_themeStyleRefManager.cacheShapeStyle).not.toHaveBeenCalled();
        });

    it('should not create css class and should not cache shape style for ' +
        'placeholder div when element in shape JSON is undefined',
        function() {
          v = {
            el: undefined
          };

          spyOn(_themeStyleRefManager, 'cacheShapeStyle');

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
          expect(_themeStyleRefManager.cacheShapeStyle).
              not.toHaveBeenCalled();
        });

    it('should not create css class and should not cache shape style for ' +
        'placeholder div when element-type in shape JSON is undefined',
        function() {
          v.el.etp = undefined;

          spyOn(_themeStyleRefManager, 'cacheShapeStyle');

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
          expect(_themeStyleRefManager.cacheShapeStyle).
              not.toHaveBeenCalled();
        });

    it('should not create css class for placeholder div when element-type ' +
        'in shape JSON is not -ph-', function() {
          v.el.etp = 'xxx';
          _placeHolderHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

    it('should not create css class and should not cache shape style for ' +
        'placeholder div when nvSpPr in shape JSON is undefined', function() {
          v.el.nvSpPr = undefined;

          spyOn(_themeStyleRefManager, 'cacheShapeStyle');

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
          expect(_themeStyleRefManager.cacheShapeStyle).not.toHaveBeenCalled();
        });

    it('should not create css class for placeholder div when place holder ' +
        'type in shape JSON is undefined', function() {
          v.el.nvSpPr.phTyp = undefined;
          _placeHolderHandler.visit(v);

          expect(CssManager.addRule).not.toHaveBeenCalled();
        });

    it('should add rule to css with generated class-prefix for shape and ' +
        'shape fill', function() {
          v.el = {
            'etp': 'ph',
            'nvSpPr': {
              'phTyp': 'body',
              'phIdx': 0
            },
            'spPr': 'some shape properties'
          };

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
            withShapeFill: function() {
            },
            withShapeOutline: function() {
            }
          };

          PointModel.currentPHLevel = 'sldlt';
          PointModel.SlideLayoutId = 'E123';
          var expectedRule = 'div[sldlt="E123"] [placeholder-type="body"]' +
              '[placeholder-index="0"] div[qowt-divtype="shape-fill"]';

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(decoratorLocalApi, 'withShapeTransform').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeFill').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeOutline').
              andReturn(decoratorLocalApi);
          spyOn(_placeHolderManager, 'getClassPrefix').
              andReturn('someClassPrefix');

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule.calls[0].args).
              toEqual(['.someClassPrefix_shapeStyle', '', 100]);
          expect(CssManager.addRule.calls[1].args).toEqual(
              [expectedRule, '', 100]);
          expect(CssManager.addRule.callCount).toEqual(2);
        });

    it('should add rule to css if current ph level is master', function() {
      v.el.nvSpPr.phTyp = 'ftr';

      var expectedRule = 'div[sldmt="102"] [placeholder-type="ftr"]' +
          ' div[qowt-divtype="shape-fill"]';

      _placeHolderHandler.visit(v);

      expect(CssManager.addRule.calls[1].args).toEqual([expectedRule, '', 100]);
    });

    it('should add rule to css for ctrTitle if current ph level is master ' +
        'and phType is title', function() {
          var expectedRule = 'div[sldmt="102"] [placeholder-type="title"] ' +
              'div[qowt-divtype="shape-fill"], div[sldmt="102"] ' +
              '[placeholder-type="ctrTitle"] div[qowt-divtype="shape-fill"]';

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule.calls[1].args).toEqual(
              [expectedRule, '', 100]);
        });

    it('should add rule to css for subTitle, pic if current ph level is ' +
        'master and phType is body', function() {
          v.el.nvSpPr.phTyp = 'body';
          var expectedRule = 'div[sldmt="102"] [placeholder-type="body"] ' +
              'div[qowt-divtype="shape-fill"], div[sldmt="102"] ' +
              '[placeholder-type="subTitle"] ' +
              'div[qowt-divtype="shape-fill"], div[sldmt="102"] ' +
              '[placeholder-type="pic"] div[qowt-divtype="shape-fill"]';

          _placeHolderHandler.visit(v);

          expect(CssManager.addRule.calls[1].args).toEqual(
              [expectedRule, '', 100]);
        });

    it('should not decorate place holder div, when spPr is undefined',
       function() {
         v.el = {
           'etp': 'ph',
           'nvSpPr': {
             'phTyp': 'body'
           },
           'spPr': undefined
         };

         var decoratorLocalApi =
         {
           withShapeTransform: function() {
           },
           withShapeFill: function() {
           },
           withShapeOutline: function() {
           }
         };

         spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

         spyOn(decoratorLocalApi, 'withShapeTransform').
             andReturn(decoratorLocalApi);
         spyOn(decoratorLocalApi, 'withShapeFill').
             andReturn(decoratorLocalApi);
         spyOn(decoratorLocalApi, 'withShapeOutline').
             andReturn(decoratorLocalApi);

         _placeHolderHandler.visit(v);

         expect(decoratorLocalApi.withShapeTransform).not.toHaveBeenCalled();
         expect(decoratorLocalApi.withShapeOutline).not.toHaveBeenCalled();
         expect(decoratorLocalApi.withShapeFill).not.toHaveBeenCalled();
       });

    it('should not decorate place holder div, when phTyp is graphicFrame ' +
        'element (chart, table and smart art)', function() {
          v.el = {
            'etp': 'ph',
            'nvSpPr': {
              'phTyp': 'chart'
            },
            'spPr': undefined
          };

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
           withShapeFill: function() {
            },
           withShapeOutline: function() {
            }
          };

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(decoratorLocalApi, 'withShapeTransform').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeFill').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeOutline').
              andReturn(decoratorLocalApi);

          _placeHolderHandler.visit(v);

          expect(decoratorLocalApi.withShapeTransform).not.toHaveBeenCalled();
          expect(decoratorLocalApi.withShapeOutline).not.toHaveBeenCalled();
          expect(decoratorLocalApi.withShapeFill).not.toHaveBeenCalled();
        });

    it('should call getClassPrefix with proper container ID when ' +
        'currentPHLevel is sldmt', function() {
          v.el = {
            'etp': 'ph',
            'nvSpPr': {
              'phTyp': 'body'
            },
            'spPr': undefined
          };

          PointModel.currentPHLevel = 'sldmt';
          PointModel.MasterSlideId = 'master';
          PointModel.SlideLayoutId = 'layout';

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
            withShapeFill: function() {
            },
            withShapeOutline: function() {
            }
          };

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(_placeHolderManager, 'getClassPrefix');

          _placeHolderHandler.visit(v);

          expect(_placeHolderManager.getClassPrefix).
              toHaveBeenCalledWith(v.el.nvSpPr.phTyp, v.el.nvSpPr.phIdx,
                  PointModel.currentPHLevel, PointModel.MasterSlideId);
        });

    it('should call getClassPrefix with proper container ID when ' +
        'currentPHLevel is not sldmt', function() {
          v.el = {
            'etp': 'ph',
            'nvSpPr': {
              'phTyp': 'body'
            },
            'spPr': undefined
          };

          PointModel.currentPHLevel = undefined;
          PointModel.MasterSlideId = 'master';
          PointModel.SlideLayoutId = 'layout';

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
            withShapeFill: function() {
            },
            withShapeOutline: function() {
            }
          };

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(_placeHolderManager, 'getClassPrefix');

          _placeHolderHandler.visit(v);

          expect(_placeHolderManager.getClassPrefix).
              toHaveBeenCalledWith(v.el.nvSpPr.phTyp, v.el.nvSpPr.phIdx,
                  PointModel.currentPHLevel, PointModel.SlideLayoutId);
        });

    it('should updateCurrentPlaceHolderForLayouts in point model',
       function() {
         v.el = {
           'etp': 'ph',
           'nvSpPr': {
             'phTyp': 'body',
             phIdx: '11'
           },
           'spPr': undefined
         };

         PointModel.currentPHLevel = undefined;
         PointModel.MasterSlideId = 'master';
         PointModel.SlideLayoutId = 'layout';

         var decoratorLocalApi = {
           withShapeTransform: function() {
           },
           withShapeFill: function() {
           },
           withShapeOutline: function() {
           }
         };

         spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

         _placeHolderHandler.visit(v);

         expect(PointModel.CurrentPlaceHolderAtLayouts.phTyp).
             toEqual(v.el.nvSpPr.phTyp);
         expect(PointModel.CurrentPlaceHolderAtLayouts.phIdx).
             toEqual(v.el.nvSpPr.phIdx);
       });

    it('should cacheMasterShapeProperties when placeholder is at sldmt',
       function() {
         v.el = {
           'etp': 'ph',
           'nvSpPr': {
             'phTyp': 'body',
             phIdx: '11'
           },
           'spPr': 'some shape property'
         };

         PointModel.currentPHLevel = 'sldmt';

         spyOn(PlaceHolderPropertiesManager, 'cacheMasterShapeProperties');

         _placeHolderHandler.visit(v);

         expect(PlaceHolderPropertiesManager.cacheMasterShapeProperties).
             toHaveBeenCalledWith(v.el.nvSpPr.phTyp, v.el.spPr);
       });

    it('should cacheLayoutShapeProperties when placeholder is at sldlt',
       function() {
         v.el = {
           'etp': 'ph',
           'nvSpPr': {
             'phTyp': 'body',
             phIdx: '11'
           },
           'spPr': 'some shape property'
         };

         PointModel.currentPHLevel = 'sldlt';

         spyOn(PlaceHolderPropertiesManager, 'cacheLayoutShapeProperties');

         _placeHolderHandler.visit(v);

         expect(PlaceHolderPropertiesManager.cacheLayoutShapeProperties).
             toHaveBeenCalledWith(v.el.nvSpPr.phTyp, v.el.nvSpPr.phIdx,
                 v.el.spPr);
       });

    it('should not decorate place holder div with shadow when shadow is ' +
        'undefined in shape properties', function() {
          v.el.spPr = {
            efstlst: {
              outSdwEff: undefined
            }
          };

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
            withShapeFill: function() {
            },
            withShapeOutline: function() {
            },
            withLowLevelEffects: function() {
            }
          };

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(decoratorLocalApi, 'withShapeTransform').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeFill').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeOutline').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withLowLevelEffects').
              andReturn(decoratorLocalApi);

          _placeHolderHandler.visit(v);

          expect(decoratorLocalApi.withLowLevelEffects).not.toHaveBeenCalled();
        });

    it('should not decorate place holder div with shadow when effect list ' +
        'is undefined in shape properties', function() {
          v.el.spPr = {
            efstlst: undefined
          };

          var decoratorLocalApi = {
            withShapeTransform: function() {
            },
            withShapeFill: function() {
            },
            withShapeOutline: function() {
            },
            withLowLevelEffects: function() {
            }
          };

          spyOn(phDecorator, 'decorate').andReturn(decoratorLocalApi);

          spyOn(decoratorLocalApi, 'withShapeTransform').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeFill').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withShapeOutline').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withLowLevelEffects').
              andReturn(decoratorLocalApi);

          _placeHolderHandler.visit(v);

          expect(decoratorLocalApi.withLowLevelEffects).not.toHaveBeenCalled();
        });
  });
});
