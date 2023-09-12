define([
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/drawing/theme/themeFillStyleManager',
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeManager'
], function(SlideDecorator,
            UnittestUtils,
            CssManager,
            FillHandler,
            ThemeFillStyleManager,
            PointModel,
            ThemeManager) {

  'use strict';

  describe('Slide Decorator tests', function() {
    var _SLIDE_ID = '111',
        _MASTER_ID = '222',
        _LAYOUT_ID = '333',
        _testAppendArea,
        _slideDecorator;

    beforeEach(function() {
      _slideDecorator = SlideDecorator.create();
      _testAppendArea = UnittestUtils.createTestAppendArea();

      CssManager.addRuleNow('.slideSize', ('width:' + 720 + 'pt; height:' +
          540 + 'pt;'));

      PointModel.MasterSlideId = _MASTER_ID;
      PointModel.SlideLayoutId = _LAYOUT_ID;
      PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
        refDiv: 'slideDiv'
      };
      PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
        refDiv: 'slideDiv'
      };
    });

    afterEach(function() {
      var slideDiv = _testAppendArea.getElementById(_SLIDE_ID);
      if (slideDiv) {
        _testAppendArea.removeChild(slideDiv);
      }

      var backgroundDiv = _testAppendArea.getElementsByClassName(
          'slideBackground')[0];
      if (backgroundDiv) {
        _testAppendArea.removeChild(backgroundDiv);
      }
    });

    it('should return Slide div, contained inside parent div with ' +
        'qowt-divType as -slide-', function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'sld',
              eid: _SLIDE_ID
            }
          };

          var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
          var slide = decorateSlide.withSlideProperties().getDecoratedDiv();
          v.node.appendChild(slide);
          expect(_testAppendArea.getElementById(_SLIDE_ID)).toEqual(slide);

          expect(slide.getAttribute('qowt-divType')).toEqual('slide');
        });

    it('should create background div contained inside parent div for slide',
        function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'sld',
              eid: _SLIDE_ID,
              fill: {
                type: 'solidFill',
                color: {
                  type: 'srgbClr',
                  clr: '#FFFFFF'
                },
                alpha: 1
              }
            }
          };

          spyOn(ThemeFillStyleManager, 'getFillStyle').andReturn(v.el.fill);

          _slideDecorator.decorate(v).withBackgroundDiv();

          var sldBackgroundDiv = v.node.childNodes[0];
          expect(sldBackgroundDiv.className).toEqual('slideBackground ' +
              'slideSize printSlide');
          expect(sldBackgroundDiv.getAttribute('masterid')).toEqual(PointModel.
              MasterSlideId);
          expect(sldBackgroundDiv.getAttribute('layoutid')).toEqual(PointModel.
              SlideLayoutId);
          expect(sldBackgroundDiv.getAttribute('slideid')).toEqual(v.el.eid);
        });

    it('should create background div contained inside parent div for ' +
        'slide if fill is undefined', function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'sld',
              eid: _SLIDE_ID,
              fill: undefined,
              bgFillRef: {
                idx: '1001',
                color: {
                  type: 'schemeClr',
                  scheme: 'accent1'
                }
              }
            }
          },
              themeFill = {
                type: 'solidFill',
                color: {
                  type: 'schemeClr',
                  scheme: 'phClr'
                },
                alpha: 1
              },
              cssSelector = '.slideBackground[masterid="' + PointModel.
                  MasterSlideId + '"][layoutid="' + PointModel.SlideLayoutId +
                  '"][slideid="' + v.el.eid + '"]',
              expectedFillObject = {
                type: 'solidFill',
                color: {
                  type: 'schemeClr',
                  scheme: 'accent1'
                },
                alpha: 1
              };

          spyOn(ThemeFillStyleManager, 'getFillStyle').andReturn(themeFill);
          spyOn(ThemeManager, 'getColorTheme').andReturn('#FFFFFF');
          spyOn(FillHandler, 'getFillStyle').andCallThrough();

          _slideDecorator.decorate(v).withBackgroundDiv();
          var sldBackgroundDiv = v.node.childNodes[0];
          expect(sldBackgroundDiv.id).toEqual('backgroundDiv' + _SLIDE_ID);

          expect(sldBackgroundDiv.getAttribute('masterid')).toEqual(PointModel.
              MasterSlideId);
          expect(sldBackgroundDiv.getAttribute('layoutid')).toEqual(PointModel.
              SlideLayoutId);
          expect(sldBackgroundDiv.getAttribute('slideid')).toEqual(v.el.eid);

          expect(FillHandler.getFillStyle).toHaveBeenCalledWith(
              expectedFillObject, cssSelector);
        });

    it('should create background div contained inside parent div for slide ' +
        'if bgFillRef and fill are undefined', function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'sld',
              eid: _SLIDE_ID,
              fill: undefined,
              bgFillRef: undefined
            }
          };
          spyOn(FillHandler, 'getFillStyle');

          _slideDecorator.decorate(v).withBackgroundDiv();

          var sldBackgroundDiv = v.node.childNodes[0];
          expect(sldBackgroundDiv.id).toEqual('backgroundDiv' + _SLIDE_ID);
          expect(sldBackgroundDiv.className).toEqual('slideBackground ' +
              'slideSize printSlide');
          expect(sldBackgroundDiv.getAttribute('masterid')).toEqual(PointModel.
              MasterSlideId);
          expect(sldBackgroundDiv.getAttribute('layoutid')).toEqual(PointModel.
              SlideLayoutId);
          expect(sldBackgroundDiv.getAttribute('slideid')).toEqual(v.el.eid);

          expect(FillHandler.getFillStyle).not.toHaveBeenCalled();
        });

    it('should set proper z-order for slideLayout', function() {
      var v = {
        node: _testAppendArea,
        el: {
          etp: 'sldlt',
          eid: _SLIDE_ID
        }
      };

      var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
      var slide = decorateSlide.withSlideProperties().getDecoratedDiv();
      expect(slide.getAttribute('qowt-divType')).toEqual('slideLayout');
      expect(slide.style['z-index']).toEqual('2');
    });

    it('should set proper z-order for slideMaster', function() {
      var v = {
        node: _testAppendArea,
        el: {
          etp: 'sldmt',
          eid: _SLIDE_ID
        }
      };

      var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
      var slide = decorateSlide.withSlideProperties().getDecoratedDiv();
      expect(slide.getAttribute('qowt-divType')).toEqual('slideMaster');
      expect(slide.style['z-index']).toEqual('1');
    });

    it('should set proper z-order for slideContent', function() {
      var v = {
        node: _testAppendArea,
        el: {
          etp: 'sld',
          eid: _SLIDE_ID
        }
      };

      var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
      var slide = decorateSlide.withSlideProperties().getDecoratedDiv();
      expect(slide.getAttribute('qowt-divType')).toEqual('slide');
      expect(slide.style['z-index']).toEqual('3');
    });

    it('should not create background div contained inside parent div for ' +
        'slideLayout', function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'gsldLt',
              eid: _SLIDE_ID
            }
          };

          _slideDecorator.decorate(v).withNewDiv().getDecoratedDiv();
          var sldbackgroundDiv = _testAppendArea.getElementsByClassName(
              'slideBackground')[0];
          expect(sldbackgroundDiv).toBe(undefined);
        });

    it('should not create background div contained inside parent div for ' +
        'slideMaster', function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'gSldMt',
              eid: _SLIDE_ID
            }
          };

          _slideDecorator.decorate(v).withNewDiv().getDecoratedDiv();
          var sldbackgroundDiv = _testAppendArea.getElementsByClassName(
              'slideBackground')[0];
          expect(sldbackgroundDiv).toBe(undefined);
        });

    it('should fill the slide', function() {
      var v = {
        node: _testAppendArea,
        el: {
          etp: 'sld',
          eid: _SLIDE_ID,
          fill: {
            type: 'solidFill',
            color: {
              type: 'srgbClr',
              clr: '#FFFFFF'
            }
          }
        }
      },
          cssSelector = '.slideBackground[masterid="' + PointModel.
              MasterSlideId + '"][layoutid="' + PointModel.SlideLayoutId +
              '"][slideid="' + v.el.eid + '"]';

      spyOn(FillHandler, 'getFillStyle').andCallThrough();

      var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
      decorateSlide.withSlideProperties().getDecoratedDiv();

      decorateSlide.withBackgroundDiv();

      var expectedFilledInDiv = _testAppendArea.getElementsByClassName(
          'slideBackground')[0];
      expect(FillHandler.getFillStyle).toHaveBeenCalledWith(v.el.fill,
          cssSelector);
      expect(expectedFilledInDiv.className).toEqual('slideBackground ' +
          'slideSize printSlide');
      expect(expectedFilledInDiv.getAttribute('masterid')).toEqual(PointModel.
          MasterSlideId);
      expect(expectedFilledInDiv.getAttribute('layoutid')).toEqual(PointModel.
          SlideLayoutId);
      expect(expectedFilledInDiv.getAttribute('slideid')).toEqual(v.el.eid);
    });

    it('should append no div to the Slide div, when no slide data present',
        function() {
          var v = {
            node: _testAppendArea,
            el: {
              etp: 'sld',
              eid: _SLIDE_ID
            }
          };

          var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
          var slideDiv = decorateSlide.withSlideProperties().getDecoratedDiv();
          expect(slideDiv.getElementsByTagName('div').length).toEqual(0);
          expect(slideDiv.getAttribute('qowt-divType')).toEqual('slide');
        });
  });
});
