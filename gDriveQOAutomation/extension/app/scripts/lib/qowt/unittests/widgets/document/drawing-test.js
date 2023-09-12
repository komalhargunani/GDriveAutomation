/**
 * @fileoverview Unit Test cases for drawing widget
 * @author alok.guha@quickoffice.com (Alok Guha)
 */


define([
  'qowtRoot/widgets/document/drawing',
  'qowtRoot/fixtures/drawingFixture'
], function(drawingWidget, drawingFixture) {

  'use strict';

  describe('QOWT/widgets/drawing-test', function() {

    var _config, _fixture;
    beforeEach(function() {
      _fixture = drawingFixture.drawingElement();
    });

    afterEach(function() {
      _fixture = undefined;
      _config = undefined;
    });

    describe('Drawing Widget', function() {
      it('Basic functions should be defined', function() {
        var widget = drawingWidget.create(_fixture);
        expect(widget.getContentType).toBeDefined();
      });

      it('should indicate the image content type.', function() {
        var widget = drawingWidget.create(_config);
        expect(widget.getContentType()).toBe('drawing');
      });
    });


    describe('getWidgetElement', function() {
      it('should be defined', function() {
        var widget = drawingWidget.create(_fixture);
        expect(widget.getWidgetElement).toBeDefined();

      });
      it('should not return undefined.', function() {
        var widget = drawingWidget.create(_fixture);
        expect(widget.getWidgetElement()).not.toBe(undefined);
        var drawingElement = widget.getWidgetElement();
        expect(drawingElement.id).toBe('' + _fixture.eid);
        expect(drawingElement.className).toBe('qowt-drawing');
      });
    });

  });
});
