/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/dcp/pointHandlers/slideMasterHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/dcp/decorators/slideFillDecorator'
], function(PointModel,
            CssManager,
            SlideDecorator,
            SlideMasterHandler,
            ColorUtility,
            PlaceHolderTextStyleManager,
            SlideFillDecorator) {

  'use strict';

  describe('Slide Master handler tests', function() {
    var _SLIDE_ID = '111';
    var _slideHandler;

    var slideDecorator = {
      decorate: function() {
      }
    };

    beforeEach(function() {
      _slideHandler = SlideMasterHandler;


      spyOn(SlideDecorator, 'create').andReturn(slideDecorator);
      spyOn(ColorUtility, 'getHexEquivalentOfSchemeColor').andReturn('#800008');
      CssManager.addRule('slideSize', '',
          ('width:' + 720 + 'pt; height:' + 540 + 'pt;'));
    });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with empty v element', function() {
          expect(_slideHandler.visit(undefined)).toEqual(undefined);

        });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with etp other than sldmt', function() {
          var v = {
            el: {
              etp: 'xxx',
              eid: '111'
            }
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with etp undefined', function() {
          var v = {
            el: {
              eid: _SLIDE_ID
            }
          };
          var slide = _slideHandler.visit(v);
          expect(slide).toEqual(undefined);
        });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with empty el element', function() {
          var v = {
            el: ''
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slide-handler visit is called without ' +
        'sld element', function() {
          var v = {
            el: {
              etp: 'hell',
              eid: _SLIDE_ID
            }
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should cache current PH level and PH text styles', function() {
      var v = {
        el: {
          etp: 'sldmt',
          eid: '1111',
          fill: {},
          txStlArr: ['title', 'body', 'other']
        },
        node: {
          appendChild: function() {
          }
        }
      };

      var decoratorLocalApi = {
        withNewDiv: function() {
        },
        withSlideProperties: function() {
        },
        getDecoratedDiv: function() {
        }
      };
      var expectedCSSSelector = '.slideBackground[masterid="' + v.el.eid + '"]';

      var placeHolderTextStyleManager = PlaceHolderTextStyleManager;
      spyOn(slideDecorator, 'decorate').andReturn(decoratorLocalApi);
      spyOn(decoratorLocalApi, 'withSlideProperties').
          andReturn(decoratorLocalApi);
      spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
      spyOn(SlideFillDecorator, 'setFill');

      PointModel.currentPHLevel = '';

      spyOn(placeHolderTextStyleManager, 'cacheMasterTextStyle');

      _slideHandler.visit(v);

      expect(PointModel.currentPHLevel).toEqual('sldmt');
      expect(placeHolderTextStyleManager.cacheMasterTextStyle).
          toHaveBeenCalledWith(['title', 'body', 'other']);
      expect(SlideFillDecorator.setFill).toHaveBeenCalledWith(
          expectedCSSSelector, v.el);
    });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with etp undefined', function() {
          var v = {
            el: {
              eid: _SLIDE_ID
            }
          };
          var slide = _slideHandler.visit(v);
          expect(slide).toEqual(undefined);
        });

    it('should return undefined when slideMaster-handler visit is called ' +
        'with empty el element', function() {
          var v = {
            el: ''
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slide-handler visit is called without ' +
        'sld element', function() {
          var v = {
            el: {
              etp: 'hell',
              eid: _SLIDE_ID
            }
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

  });
});
