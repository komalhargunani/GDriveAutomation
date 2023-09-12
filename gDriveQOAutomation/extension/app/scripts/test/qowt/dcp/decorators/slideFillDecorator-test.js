define([
  'qowtRoot/dcp/decorators/slideFillDecorator',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/utils/cssManager',
  'qowtRoot/drawing/theme/themeManager',
  'third_party/lo-dash/lo-dash.min'
], function(SlideFillDecorator, FillHandler, CSSManager, ThemeManager) {

  'use strict';

  describe('SlideFillDecorator', function() {

    beforeEach(function() {
      sinon.stub(CSSManager, 'addRule');
      sinon.stub(ThemeManager, 'getColorTheme', function() {
        return {
          lt2: '#eeece1'
        };
      });
      sinon.stub(ThemeManager, 'getFillStyle');
      sinon.stub(FillHandler, 'getFillStyle');
    });

    afterEach(function() {
      CSSManager.addRule.restore();
      ThemeManager.getColorTheme.restore();
      ThemeManager.getFillStyle.restore();
      FillHandler.getFillStyle.restore();
    });

    describe('setFill API', function() {
      it('should not fill when there in no fill information', function() {
        var slide = {};

        SlideFillDecorator.setFill('.slideBackground[masterid="E111"]', slide);

        assert.strictEqual(FillHandler.getFillStyle.callCount, 0);
        assert.strictEqual(CSSManager.addRule.callCount, 0);
      });

      it('should set fill when explicit fill is provided', function() {
        var slideLayout = {
          eid: 'E79',
          elm: [],
          etp: 'sldlt',
          fill: {
            type: 'solidFill',
            color: {
              scheme: 'lt2',
              type: 'schemeClr'
            }
          }
        };
        var cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
            slideLayout.eid + '"]';

        FillHandler.getFillStyle.withArgs(slideLayout.fill, cssSelector).
            returns('background:rgba(238,236,225,1);');

        SlideFillDecorator.setFill(cssSelector, slideLayout);

        assert.isTrue(FillHandler.getFillStyle.calledOnce);
        assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
            slideLayout.fill);
        assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
            cssSelector);

        assert.isTrue(CSSManager.addRule.calledOnce);
        assert.deepEqual(CSSManager.addRule.firstCall.args[0], cssSelector);

        // 'lt2' scheme color is resolved to a hex color (#eeece1 as per the
        // mocking provided above) by ColorUtility, which is equivalent to
        // (238, 236, 225) in RGB format.
        assert.deepEqual(CSSManager.addRule.firstCall.args[1],
            'background:rgba(238,236,225,1);');
      });

      it('should set fill when explicit fill is provided with a color map ' +
          'override', function() {
            var slideLayout = {
              eid: 'E79',
              elm: [],
              etp: 'sldlt',
              fill: {
                type: 'solidFill',
                color: {
                  scheme: 'bg2',
                  type: 'schemeClr'
                }
              },
              clrMapOvr: [{
                name: 'bg2',
                value: 'lt2'
              }]
            };
            var expectedFill = _.cloneDeep(slideLayout.fill),
                cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                    slideLayout.eid + '"]';

            expectedFill.color.scheme = 'lt2';
            FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
                returns('background:rgba(238,236,225,1);');

            SlideFillDecorator.setFill(cssSelector, slideLayout);

            assert.isTrue(FillHandler.getFillStyle.calledOnce);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
                expectedFill);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
                cssSelector);

            assert.isTrue(CSSManager.addRule.calledOnce);
            assert.deepEqual(CSSManager.addRule.firstCall.args[0], cssSelector);

            // 'lt2' scheme color is resolved to a hex color (#eeece1 as per the
            // mocking provided above) by ColorUtility, which is equivalent to
            // (238, 236, 225) in RGB format.
            assert.deepEqual(CSSManager.addRule.firstCall.args[1],
                'background:rgba(238,236,225,1);');
          });

      it('should set fill when implicit fill is provided', function() {
        var slideLayout = {
          eid: 'E79',
          elm: [],
          etp: 'sldlt',
          bgFillRef: {
            color: {
              scheme: 'lt2',
              type: 'schemeClr'
            },
            idx: '1001'
          }
        };
        var fill = {
          color: {
            scheme: 'phClr',
            type: 'schemeClr'
          },
          type: 'solidFill'
        };
        var expectedFill = _.cloneDeep(fill),
            cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                slideLayout.eid + '"]';

        expectedFill.color.scheme = 'lt2';
        FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
            returns('background:rgba(238,236,225,1);');
        ThemeManager.getFillStyle.withArgs(slideLayout.bgFillRef.idx).returns(
            fill);

        SlideFillDecorator.setFill(cssSelector, slideLayout);

        assert.isTrue(FillHandler.getFillStyle.calledOnce);
        assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
            expectedFill);
        assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
            cssSelector);

        assert.isTrue(CSSManager.addRule.calledOnce);
        assert.deepEqual(CSSManager.addRule.firstCall.args[0], cssSelector);

        // 'lt2' scheme color is resolved to a hex color (#eeece1 as per the
        // mocking provided above) by ColorUtility, which is equivalent to
        // (238, 236, 225) in RGB format.
        assert.deepEqual(CSSManager.addRule.firstCall.args[1],
            'background:rgba(238,236,225,1);');
      });

      it('should set fill when implicit fill is provided with a color map' +
          ' override', function() {
            var slideLayout = {
              eid: 'E79',
              elm: [],
              etp: 'sldlt',
              bgFillRef: {
                color: {
                  scheme: 'bg2',
                  type: 'schemeClr'
                },
                idx: '1001'
              },
              clrMapOvr: [{
                name: 'bg2',
                value: 'lt2'
              }]
            };
            var fill = {
              color: {
                scheme: 'phClr',
                type: 'schemeClr'
              },
              type: 'solidFill'
            };
            var expectedFill = _.cloneDeep(fill),
                cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                    slideLayout.eid + '"]';

            expectedFill.color.scheme = 'lt2';
            FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
                returns('background:rgba(238,236,225,1);');
            ThemeManager.getFillStyle.withArgs(slideLayout.bgFillRef.idx).
                returns(fill);

            SlideFillDecorator.setFill(cssSelector, slideLayout);

            assert.isTrue(FillHandler.getFillStyle.calledOnce);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
                expectedFill);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
                cssSelector);

            assert.isTrue(CSSManager.addRule.calledOnce);
            assert.deepEqual(CSSManager.addRule.firstCall.args[0], cssSelector);

            // 'lt2' scheme color is resolved to a hex color (#eeece1 as per the
            // mocking provided above) by ColorUtility, which is equivalent to
            // (238, 236, 225) in RGB format.
            assert.deepEqual(CSSManager.addRule.firstCall.args[1],
                'background:rgba(238,236,225,1);');
          });

      it('should set blip fill when implicit blip fill is provided',
          function() {
            var slideLayout = {
              eid: 'E79',
              elm: [],
              etp: 'sldlt',
              bgFillRef: {
                color: {
                  scheme: 'bg2',
                  type: 'schemeClr'
                },
                idx: '1003'
              }
            };
            var themeBlipFill = {
              blip: {
                effects: [{
                  color1: {
                    effects: [],
                    scheme: 'phClr',
                    type: 'schemeClr'
                  },
                  color2: {
                    effects: [],
                    scheme: 'phClr',
                    type: 'schemeClr'
                  },
                  type: 'duotone'
                }],
                etp: 'img',
                src: '/point_data_0002'
              },
              fillMode: {
                type: 'stretchFill'
              },
              type: 'blipFill'
            };

            var expectedFill = _.cloneDeep(themeBlipFill),
                cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                    slideLayout.eid + '"]';

            ThemeManager.getFillStyle.withArgs(slideLayout.bgFillRef.idx).
                returns(themeBlipFill);
            FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
                returns('');

            var expectedDuotoneEffect = expectedFill.blip.effects[0];
            expectedDuotoneEffect.color1.scheme = 'bg2';
            expectedDuotoneEffect.color2.scheme = 'bg2';

            SlideFillDecorator.setFill(cssSelector, slideLayout);

            assert.isTrue(FillHandler.getFillStyle.calledOnce);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
                expectedFill);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
                cssSelector);
          });
      it('should set blip fill when implicit blip fill is provided with a ' +
          'color map override', function() {
            var slideLayout = {
              eid: 'E79',
              elm: [],
              etp: 'sldlt',
              bgFillRef: {
                color: {
                  scheme: 'bg2',
                  type: 'schemeClr'
                },
                idx: '1003'
              },
              clrMapOvr: [{
                name: 'bg2',
                value: 'lt2'
              }]
            };
            var themeBlipFill = {
              blip: {
                effects: [{
                  color1: {
                    effects: [],
                    scheme: 'phClr',
                    type: 'schemeClr'
                  },
                  color2: {
                    effects: [],
                    scheme: 'phClr',
                    type: 'schemeClr'
                  },
                  type: 'duotone'
                }],
                etp: 'img',
                src: '/point_data_0002'
              },
              fillMode: {
                type: 'stretchFill'
              },
              type: 'blipFill'
            };

            var expectedFill = _.cloneDeep(themeBlipFill),
                cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                    slideLayout.eid + '"]';

            ThemeManager.getFillStyle.withArgs(slideLayout.bgFillRef.idx).
                returns(themeBlipFill);
            FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
                returns('');

            var expectedDuotoneEffect = expectedFill.blip.effects[0];
            expectedDuotoneEffect.color1.scheme = 'lt2';
            expectedDuotoneEffect.color2.scheme = 'lt2';

            SlideFillDecorator.setFill(cssSelector, slideLayout);

            assert.isTrue(FillHandler.getFillStyle.calledOnce);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
                expectedFill);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
                cssSelector);
          });
      it('should set blip fill when explicit blip fill is provided with a ' +
          'color map override', function() {
            var slideLayout = {
              eid: 'E79',
              elm: [],
              etp: 'sldlt',
              fill: {
                blip: {
                  effects: [{
                    color1: {
                      effects: [],
                      scheme: 'bg2',
                      type: 'schemeClr'
                    },
                    color2: {
                      effects: [],
                      scheme: 'dk1',
                      type: 'schemeClr'
                    },
                    type: 'duotone'
                  }],
                  etp: 'img',
                  src: '/point_data_0002'
                },
                fillMode: {
                  type: 'stretchFill'
                },
                type: 'blipFill'
              },
              clrMapOvr: [{
                name: 'bg2',
                value: 'lt2'
              }]
            };

            var expectedFill = _.cloneDeep(slideLayout.fill),
                cssSelector = '.slideBackground[masterid="E111"][layoutid="' +
                    slideLayout.eid + '"]';

            FillHandler.getFillStyle.withArgs(expectedFill, cssSelector).
                returns('');

            var expectedDuotoneEffect = expectedFill.blip.effects[0];
            expectedDuotoneEffect.color1.scheme = 'lt2';

            SlideFillDecorator.setFill(cssSelector, slideLayout);

            assert.isTrue(FillHandler.getFillStyle.calledOnce);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[0],
                expectedFill);
            assert.deepEqual(FillHandler.getFillStyle.firstCall.args[1],
                cssSelector);
          });
    });
  });
});
