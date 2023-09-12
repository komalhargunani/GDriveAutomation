define([
  'qowtRoot/dcp/pointHandlers/common/blipFillHandler',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(
    BlipFillHandler,
    UnitConversionUtils) {

  'use strict';

  describe('Blip Fill Handler Test', function() {

    var sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox_.restore();
      sandbox_ = undefined;
    });

    it('should apply default tile properties to canvas when tile properties' +
        ' are not available', function() {
          var canvasDimensions = {
                width: 50,
                height: 18
              },
              image = {
                width: 100,
                height: 75
              },
              context = {
                drawImage: function() {},
                restore: function() {}
              },
              fillData = {
                fillMode: {
                  type: 'tileFill',
                  tileProps: undefined
                }
              };

          sandbox_.stub(context, 'drawImage');
          sandbox_.stub(context, 'restore');
          sandbox_.stub(UnitConversionUtils, 'convertEmuToPixel');

          BlipFillHandler.fillCanvasContext(canvasDimensions, context,
              fillData, 'lighten', image);

          assert.isTrue(context.drawImage.called,
              'context.drawImage is called');
          assert.isTrue(context.restore.called, 'context.restore is called');
        });

    it('should apply default tile properties to rectangle when tile ' +
        'properties are not available', function() {
          var shapeFillDiv = {
                id: '16',
                style: {}
              },
              fillData = {
                blip: {
                  'etp': 'img',
                  'src': 'image source data'
                },
                fillMode: {
                  type: 'tileFill',
                  tileProps: undefined
                },
                alpha: 1
              },
              image = {
                addEventListener: function() {}
              };

          sandbox_.stub(document, 'createElement').returns(image);
          sandbox_.stub(image, 'addEventListener');

          BlipFillHandler.handleUsingHTML(fillData, shapeFillDiv);

          assert.strictEqual(
              shapeFillDiv.style['background-repeat'], 'repeat');
          assert.strictEqual(
              shapeFillDiv.style['background-position'], 'top left');
          assert.isTrue(image.addEventListener.called,
              'image.addEventListener is called');
        });
  });
});
