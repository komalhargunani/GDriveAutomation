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
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/pointHandlers/slideContentHandler',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/slide',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/models/point'
], function(
    SlideDecorator,
    CssManager,
    SlideContentHandler,
    LayoutsManager,
    ThumbnailStrip,
    SlideWidget,
    UnitTestUtils,
    PointModel) {

  'use strict';

  describe('Slide Content handler tests', function() {
    var _SLIDE_ID = '111';
    var _slideHandler, _parentNode;

    beforeEach(function() {
      _slideHandler = SlideContentHandler;
      _parentNode = UnitTestUtils.createTestAppendArea();

      CssManager.addRuleNow('.slideSize',
          ('width:' + 720 + 'pt; height:' + 540 + 'pt;'));
    });

    afterEach(function() {
      _parentNode = undefined;
      UnitTestUtils.removeTestAppendArea();
    });

    it('should return undefined when slideContent-handler visit is called ' +
        'with empty v element', function() {
          expect(_slideHandler.visit(undefined)).toEqual(undefined);
        });

    it('should call Slide-decorator, Thumbnail strip, and slide widget' +
        ' methods from slideContent handler and set currentSlideEId',
        function() {
          var v = {
            el: {
              etp: 'sld',
              eid: '1111'
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
            },
            withBackgroundDiv: function() {
            },
            setAttribute: function() {
            }
          };

          var slideDecorator = {
            decorate: function() {
            }
          };

          var decoratedDiv = {
            setAttribute: function() {
            }
          };

          PointModel.SlideId = 1;
          PointModel.SlideLayoutId = 'E111';
          PointModel.MasterSlideId = 'E123';
          var slideWidgetMock = SlideWidget.create(0, _parentNode);

          spyOn(ThumbnailStrip, 'thumbnail').andReturn(slideWidgetMock);
          spyOn(slideWidgetMock, 'setHiddenInSlideShow');

          spyOn(SlideDecorator, 'create').andReturn(slideDecorator);
          spyOn(slideDecorator, 'decorate').andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withSlideProperties').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'withBackgroundDiv').
              andReturn(decoratorLocalApi);
          spyOn(decoratorLocalApi, 'getDecoratedDiv').
              andReturn(decoratedDiv);
          spyOn(decoratedDiv, 'setAttribute');

          _slideHandler.visit(v);

          expect(decoratorLocalApi.withNewDiv).toHaveBeenCalled();
          expect(decoratorLocalApi.withSlideProperties).toHaveBeenCalled();
          expect(decoratorLocalApi.withBackgroundDiv).toHaveBeenCalled();
          expect(decoratorLocalApi.getDecoratedDiv).toHaveBeenCalled();
          expect(decoratedDiv.setAttribute.calls[0].args).toEqual(['sldlt',
            'E111']);
          expect(decoratedDiv.setAttribute.calls[1].args).toEqual(['sldmt',
            'E123']);

          expect(ThumbnailStrip.thumbnail).toHaveBeenCalledWith(
              (PointModel.SlideId) - 1);
          expect(slideWidgetMock.setHiddenInSlideShow).toHaveBeenCalled();
        });

    it('should return undefined when slideContent-handler visit is called ' +
        'with etp other than sld', function() {
          var v = {
            el: {
              etp: 'xxx',
              eid: '111'
            }
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slideContent-handler visit is called ' +
        'with etp undefined', function() {
          var v = {
            el: {
              eid: _SLIDE_ID
            }
          };

          expect(_slideHandler.visit(v)).toEqual(undefined);
        });

    it('should return undefined when slideContent-handler visit is called ' +
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

    describe('test postTraverse', function() {

      beforeEach(function() {
        spyOn(LayoutsManager, 'setSlideReRenderingFlag');
      });

      it('should set slide re-render flag as false, in postTraverse',
          function() {
            var v = {
              el: {
                etp: 'sld',
                eid: _SLIDE_ID,
                elm: [
                  {
                    etp: 'sp'
                  }
                ]
              }
            };

            _slideHandler.postTraverse(v);

            expect(LayoutsManager.setSlideReRenderingFlag).
                toHaveBeenCalledWith(false);
          });

      it('should not set slide re-render flag, in postTraverse, when -elm- ' +
          'array is empty', function() {
            var v = {
              el: {
                etp: 'sld',
                eid: _SLIDE_ID,
                elm: []
              }
            };

            _slideHandler.postTraverse(v);

            expect(LayoutsManager.setSlideReRenderingFlag).not.
                toHaveBeenCalled();
          });

      it('should set slide re-render flag as false, in postTraverse, when ' +
          '-elm- array is undefined', function() {
            var v = {
              el: {
                etp: 'sld',
                eid: _SLIDE_ID,
                elm: undefined
              }
            };

            _slideHandler.postTraverse(v);

            expect(LayoutsManager.setSlideReRenderingFlag).
                toHaveBeenCalledWith(false);
          });
    });
  });
});
