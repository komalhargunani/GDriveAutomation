define([
  'qowtRoot/dcp/decorators/graphicFrameDecorator'
], function(GraphicFrameDecorator) {

  'use strict';

  describe('GraphicFrameDecorator', function() {
    var graphicFrameDecorator_;

    beforeEach(function() {
      graphicFrameDecorator_ = GraphicFrameDecorator.create().decorate();
    });
    afterEach(function() {
      graphicFrameDecorator_ = undefined;
    });

    describe('forSmartArt API', function() {
      it('should add \'smart-art\' class to the graphicFrame div', function() {
        var graphicDiv = document.createElement('DIV');

        graphicFrameDecorator_.forSmartArt(graphicDiv);

        assert.isTrue(graphicDiv.classList.contains('smart-art'));
      });
    });

    describe('forOleObject API', function() {
      it('should add \'oleObject\' class to the graphicFrame div', function() {
        var graphicDiv = document.createElement('div');

        graphicFrameDecorator_.forOleObject(graphicDiv);

        assert.isTrue(graphicDiv.classList.contains('oleObject'));
      });
    });
  });
});
