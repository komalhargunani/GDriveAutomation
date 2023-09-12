define([
  'qowtRoot/dcp/pointHandlers/slideMasterHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/cssManager'
], function(SlideMasterHandler,
            ColorUtility,
            CssManager) {

  'use strict';

  describe('Slide Master handler tests', function() {
    it('should create rules for hyperlink and followed link', function() {
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

      var expectedLinkRuleName = 'div[sldmt="1111"] span[link]';

      var sandbox_ = sinon.sandbox.create();

      sandbox_.stub(ColorUtility, 'getHexEquivalentOfSchemeColor').
          returns('#800008');
      sandbox_.stub(CssManager, 'addRule');

      SlideMasterHandler.visit(v);

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
      assert.strictEqual(firstEvaluation.args[1], 'master',
          'colorUtility called with correct level');
      sandbox_.restore();
    });
  });
});
