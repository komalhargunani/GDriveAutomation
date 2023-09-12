define([
  'qowtRoot/dcp/pointHandlers/slideContentHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(SlideContentHandler,
            ColorUtility,
            LayoutsManager,
            CssManager,
            ThumbnailStrip) {

  'use strict';

  describe('Slide Content handler tests', function() {
    var v_, sandbox_;

    beforeEach(function() {
      v_ = {
        el: {
          etp: 'sld',
          eid: '11',
          clrMapOvr: {}
        },
        node: {
          appendChild: function() {
          }
        }
      };

      var mockedSlideWidget = {
        setHiddenInSlideShow: function() {}
      };

      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(ThumbnailStrip, 'thumbnail').returns(mockedSlideWidget);
      sandbox_.stub(mockedSlideWidget, 'setHiddenInSlideShow');
      sandbox_.stub(LayoutsManager, 'isReRenderingCurrentSlide').returns(true);
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
          var expectedLinkRuleName = '#11 span[link], #t-11 span[link]';

          SlideContentHandler.visit(v_);

          assert.isTrue(ColorUtility.getHexEquivalentOfSchemeColor.calledOnce,
              'hex color evaluated once by colorUtility');
          assert.isTrue(CssManager.addRule.calledOnce,
              'one rules added to css manager');

          assert.strictEqual(CssManager.addRule.getCall(0).args[0],
              expectedLinkRuleName, 'link rule added with correct selector');
          assert.strictEqual(ColorUtility.getHexEquivalentOfSchemeColor.
              getCall(0).args[0], 'hlink',
              'colorUtility called with correct scheme color');
        });

    it('should not create rules for hyperlink and followed link if it does ' +
        ' not have a color map override', function() {
          v_.el.clrMapOvr = undefined;
          SlideContentHandler.visit(v_);

          assert.isTrue(CssManager.addRule.notCalled,
              'no rules added to css manager');
        });
  });
});
