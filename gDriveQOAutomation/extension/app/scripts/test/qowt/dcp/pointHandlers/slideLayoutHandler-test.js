define([
  'qowtRoot/dcp/pointHandlers/slideLayoutHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/cssManager'
], function(SlideLayoutHandler,
            ColorUtility,
            CssManager) {

  'use strict';

  describe('Slide Layout handler tests', function() {
    var v_;
    var sandbox_;

    beforeEach(function() {
      v_ = {
        el: {
          etp: 'sldlt',
          eid: '111',
          clrMapOvr: {}
        },
        node: {
          appendChild: function() {
          }
        }
      };

      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(ColorUtility, 'getHexEquivalentOfSchemeColor').
          returns('#800008');
      sandbox_.stub(CssManager, 'addRule');
    });

    afterEach(function() {
      sandbox_.restore();
      sandbox_ = undefined;
      v_ = undefined;
    });

    it('should create rules for hyperlink and followed link if it has a color' +
        ' map override', function() {
          var expectedLinkRuleName = 'div[sldlt="111"] span[link]';

          SlideLayoutHandler.visit(v_);

          assert.isTrue(ColorUtility.getHexEquivalentOfSchemeColor.calledOnce,
              'hex color evaluated once by colorUtility');
          assert.isTrue(CssManager.addRule.calledOnce,
              'one rules added to css manager');

          assert.strictEqual(CssManager.addRule.getCall(0).args[0],
              expectedLinkRuleName, 'link rule added with correct selector');
          var firstEvaluation = ColorUtility.getHexEquivalentOfSchemeColor.
              getCall(0);
          assert.strictEqual(firstEvaluation.args[0], 'hlink',
              'colorUtility called with correct scheme color');
          assert.strictEqual(firstEvaluation.args[1], 'layout',
              'colorUtility called with correct level');
        });

    it('should not create rules for hyperlink and followed link if it does ' +
        ' not have a color map override', function() {
          v_.el.clrMapOvr = undefined;
          SlideLayoutHandler.visit(v_);

          assert.isTrue(CssManager.addRule.notCalled,
              'no rules added to css manager');
        });
  });
});
