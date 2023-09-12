define([
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/drawing/theme/themeStyleRefManager'
], function(
    GeometryManager,
    ThemeStyleRefManager) {

  'use strict';

  describe('Outline mixin', function() {

    var testEl;

    beforeEach(function() {
      this.stampOutTempl('outline-test-template');
      testEl = this.getTestDiv().querySelector('#outline-test-element');
      testEl.cascadeProperties_ = function() {
        return {
          xfrm: {}
        };
      };
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations, 'should have ' +
          'getComputedDecorations function');
    });

    it('Should support outline', function() {
      assert(testEl.supports('ln'), 'element supports outline property');
    });

    it('Should decorate outline style', function() {

      var outlineProps = {
        ln: {
          prstDash: 'dash',
          w: 76200,
          fill: {
            type: 'solidFill',
            color: {
              clr: '#ff0000',
              type: 'srgbClr'
            }
          }
        }
      };

      var dummyOutlineRenderBean = {
        outlineFill: {
          lineWidth: 8,
          type: 'solidFill',
          data: {
            color: {
              clr: '#ff0000',
              type: 'srgbClr'
            }
          }
        },
        prstDash: 'dash'
      };

      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
          return dummyOutlineRenderBean;
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      testEl.decorate(outlineProps, true);
      var decs = testEl.getComputedDecorations().ln;

      assert.deepEqual(decs.fill, outlineProps.ln.fill, 'fill after decorate');
      assert.deepEqual(decs.w, outlineProps.ln.w, 'width after decorate');
      assert.deepEqual(decs.prstDash, outlineProps.ln.prstDash, 'style after ' +
          'decorate');

      GeometryManager.initialize.restore();
    });

    it('Should set preset dash solid when it is undefined', function() {

      var outlineProps = {
        ln: {
          prstDash: undefined
        }
      };

      var dummyOutlineRenderBean = {
        outlineFill: {
          type: 'solidFill',
          data: {
            color: {
              clr: '#ff0000',
              type: 'srgbClr'
            }
          }
        },
        prstDash: 'solid'
      };

      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
          return dummyOutlineRenderBean;
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      testEl.decorate(outlineProps, true);
      var decs = testEl.getComputedDecorations().ln;

      assert.strictEqual(
          GeometryManager.initialize.getCall(0).args[0].fill.type, 'noFill',
          'GeometryManager initialized with fill as noFill');
      assert.deepEqual(decs.prstDash, dummyOutlineRenderBean.prstDash,
          'default preset dash solid');

      GeometryManager.initialize.restore();
    });

    it('Should be possible to decorate fill with noFill value', function() {

      var outlineProps = {
        ln: {
          fill: {
            type: 'noFill'
          }
        }
      };

      var dummyOutlineRenderBean = {
        outlineFill: {
          type: undefined,
          data: undefined
        },
        prstDash: 'solid'
      };

      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
          return dummyOutlineRenderBean;
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      testEl.decorate(outlineProps, true);
      var decs = testEl.getComputedDecorations().ln;

      assert.strictEqual(decs.fill.type,
          dummyOutlineRenderBean.outlineFill.type, 'fill as noFill');

      GeometryManager.initialize.restore();
    });

    it('Should cascade the fill if fill is undefined', function() {

      var outlineProps = {
        ln: {
          fill: undefined
        }
      };

      var dummyOutlineRenderBean = {
        outlineFill: {
          type: 'solidFill',
          data: {
            color: {
              scheme: 'accent1',
              type: 'schemeClr'
            }
          }
        },
        prstDash: 'solid'
      };

      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
          return dummyOutlineRenderBean;
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      testEl.decorate(outlineProps, true);
      var decs = testEl.getComputedDecorations().ln;

      assert.strictEqual(decs.fill.type,
          dummyOutlineRenderBean.outlineFill.type, 'cascaded fill type');
      assert.deepEqual(decs.fill.color,
          dummyOutlineRenderBean.outlineFill.data.color, 'cascaded fill color' +
              ' value');

      GeometryManager.initialize.restore();
    });

    it('Should cache and reset shape styles', function() {
      sinon.stub(ThemeStyleRefManager, 'cacheShapeStyle');
      sinon.stub(ThemeStyleRefManager, 'resetShapeStyle');
      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      var style = 'some style';
      testEl.model.style = style;
      var outlineProps = {
        ln: {
          fill: {
            type: 'noFill'
          }
        }
      };
      testEl.decorate(outlineProps, true);

      assert.isTrue(ThemeStyleRefManager.cacheShapeStyle.calledWith(style),
          'cache ThemeStyleRefManager called');
      assert.isTrue(ThemeStyleRefManager.resetShapeStyle.calledOnce, 'reset ' +
          'ThemeStyleRefManager called');

      ThemeStyleRefManager.cacheShapeStyle.restore();
      ThemeStyleRefManager.resetShapeStyle.restore();
      GeometryManager.initialize.restore();
    });

    it('Should cache shape styles while computing decorations', function() {
      sinon.stub(ThemeStyleRefManager, 'cacheShapeStyle');
      sinon.stub(ThemeStyleRefManager, 'resetShapeStyle');
      sinon.stub(GeometryManager, 'initialize').returns({
        generateFillColorBean: function() {
          return {
            outlineFill: {}
          };
        },
        generateEffectsBean: function() {
        },
        drawCanvas: function() {
        }
      });

      var style = 'some style';
      testEl.model.style = style;

      testEl.getComputedDecorations();

      assert.isTrue(ThemeStyleRefManager.cacheShapeStyle.calledWith(style),
          'cache ThemeStyleRefManager called');
      assert.isTrue(ThemeStyleRefManager.resetShapeStyle.calledOnce, 'reset ' +
          'ThemeStyleRefManager called');

      ThemeStyleRefManager.cacheShapeStyle.restore();
      ThemeStyleRefManager.resetShapeStyle.restore();
      GeometryManager.initialize.restore();
    });
  });
  return {};
});
