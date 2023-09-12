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
  'qowtRoot/dcp/pointHandlers/slideLayoutHandler',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/slideFillDecorator'
], function(PointModel,
            CssManager,
            SlideDecorator,
            SlideLayoutHandler,
            DeprecatedUtils,
            SlideFillDecorator) {

  'use strict';


  describe('Slide Layout handler tests', function() {
    var _SLIDE_ID = '111';
    var _slideLayoutHandler;

    beforeEach(function() {
      _slideLayoutHandler = SlideLayoutHandler;
      CssManager.addRule('slideSize', '',
          ('width:' + 720 + 'pt; height:' + 540 + 'pt;'));
    });

    it('should return undefined when slideLayout-handler visit is called with' +
        ' empty v element', function() {
          expect(_slideLayoutHandler.visit(undefined)).toEqual(undefined);
        });

    it('should return undefined when slideLayout-handler visit is called with' +
        ' etp other than sldlt', function() {
          var v = {
            el: {
              etp: 'xxx',
              eid: '111'
            }
          };

          expect(_slideLayoutHandler.visit(v)).toEqual(undefined);
        });


    it('should call Slide-decorator withSlideProperties method from ' +
        'slideLayout handler with cached slideLayout id', function() {
          var nodeFirstChild = document.createElement('DIV');
          var v = {
            el: {
              etp: 'sldlt',
              eid: '111',
              fill: {}
            },
            node: {
              appendChild: function() {
              },
              firstChild: nodeFirstChild
            }
          };
          var cachedSlide = {
            id: '111cloned',
            style: {},
            classList: {
              add: function() {
              }
            },
            setAttribute: function() {
            }
          };

          var decoratorLocalApi = {
            withNewDiv: function() {
            },
            withSlideProperties: function() {
            },
            getDecoratedDiv: function() {
            },
            withBackgroundDiv: function() {
            }
          };

          var slideDecorator = {
            decorate: function() {
            }
          };

          var expectedCSSSelector = '.slideBackground[masterid="E222"]' +
              '[layoutid="' + v.el.eid + '"]';

          spyOn(SlideDecorator, 'create').andReturn(slideDecorator);

          PointModel.slideLayoutMap['111'] = cachedSlide;
          spyOn(DeprecatedUtils, 'cloneAndAttach');


          spyOn(slideDecorator, 'decorate').andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withSlideProperties').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'getDecoratedDiv').
              andReturn(decoratorLocalApi);
          spyOn(SlideFillDecorator, 'setFill');

          PointModel.MasterSlideId = 'E222';

          _slideLayoutHandler.visit(v);

          expect(decoratorLocalApi.withSlideProperties).toHaveBeenCalled();
          expect(decoratorLocalApi.withNewDiv).toHaveBeenCalled();
          expect(decoratorLocalApi.getDecoratedDiv).toHaveBeenCalled();
          expect(SlideFillDecorator.setFill).toHaveBeenCalledWith(
              expectedCSSSelector, v.el);

          // this element is not added to document.
          nodeFirstChild = undefined;
        });

    it('should return undefined when slideLayout-handler visit is called ' +
        'with etp undefined', function() {
          var v = {
            el: {
              eid: _SLIDE_ID
            }
          };

          expect(_slideLayoutHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slideLayout-handler visit is called ' +
        'with empty el element', function() {
          var v = {
            el: ''
          };

          expect(_slideLayoutHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slide-handler visit is called without ' +
        'sld element', function() {
          var v = {
            el: {
              etp: 'hell',
              eid: _SLIDE_ID
            }
          };

          expect(_slideLayoutHandler.visit(v)).toEqual(undefined);
        });

  });
});
