
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/image/image',
  'qowtRoot/fixtures/imageFixture',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture'
], function(UnittestUtils, imageWidget, imageFixture, FormattingFixture) {

  'use strict';

  describe('QOWT/widgets/image-test.js', function() {

    var _config, _fixture, _cropping, _fixture_crop, _rootNode;
    beforeEach(function() {
      _fixture = imageFixture.imageElement(100, 100, 100, 100);
      _cropping = {t: '20', r: '10', b: '5', l: '15'};
      _fixture_crop = imageFixture.imageElement(225, 150, undefined, undefined,
                                                _cropping, undefined, false);

      _rootNode = window.document.createElement('DIV');

      var testAppendArea = UnittestUtils.createTestAppendArea();
      testAppendArea.appendChild(_rootNode);
    });

    afterEach(function() {
      _fixture = undefined;
      _config = undefined;
      UnittestUtils.removeTestAppendArea();
      _rootNode = undefined;
    });

    function createImage(nodeId) {
      var imgNode = window.document.createElement('img');
      imgNode.id = nodeId;
      _rootNode.appendChild(imgNode);
      return imgNode;
    }

    describe('constructFromId', function() {
      it('should give a usable widget for an existing id', function() {
        var nodeId = 'img1';
        var imgNode = createImage(nodeId, _rootNode);
        var widget = imageWidget.create({fromId: imgNode.id});
        widget.appendTo(document.body);
        expect(widget).toBeDefined();
        expect(widget.getWidgetElement().id).toBe(nodeId);
      });
    });

    describe('constructFromElement', function() {
      it('should give a usable widget for an existing element', function() {
        var nodeId = 'img1';
        var imgNode = createImage(nodeId, _rootNode);
        var widget = imageWidget.create({fromNode: imgNode});
        expect(widget).toBeDefined();
        expect(widget.getWidgetElement().id).toBe(nodeId);
      });
    });

    describe('construct new image', function() {
      it('should create a usable new widget', function() {
        _config = {
          newId: 'newimage',
          format: _fixture
        };
        var widget = imageWidget.create(_config, _rootNode);
        expect(widget).toBeDefined();
        expect(widget.getWidgetElement().id).toBe('newimage');
      });
    });

    describe('construct new image and crop', function() {
      it('should crop an image', function() {
        _config = {
          newId: 'newimage',
          format: _fixture_crop
        };
        var widget = imageWidget.create(_config, _rootNode);
        expect(widget).toBeDefined();
        expect(widget.getWidgetElement().id).toBe('newimage');
        var image = widget.getWidgetElement();
        var units = 'px';
        expect(image.style.width).toBe('300' + units);
        expect(image.style.height).toBe('200' + units);
        expect(image.style.maxWidth).toBe('300' + units);
        expect(image.style.top).toBe('-40' + units);
        expect(image.style.left).toBe('-45' + units);
        expect(image.style.position).toBe('absolute');
        expect(image.style.clip).toBe('rect(40' + units + ', 270' + units +
            ', 190' + units + ', 45' + units + ')');
      });
    });

    describe('Image Widget', function() {
      it('Basic functions should be defined', function() {
        var widget = imageWidget.create(_fixture, _rootNode);
        expect(widget.getContentType).toBeDefined();
        expect(widget.setHeight).toBeDefined();
        expect(widget.setWidth).toBeDefined();
        expect(widget.setImageSource).toBeDefined();
      });

      it('should indicate the image content type.', function() {
        var imgNode = createImage('img1');
        var widget = imageWidget.create({fromNode: imgNode}, _rootNode);
        expect(widget.getContentType()).toBe('image');
      });
    });

    describe('getWidgetElement', function() {
      it('should be defined', function() {
        var widget = imageWidget.create(_fixture, _rootNode);
        expect(widget.getWidgetElement).toBeDefined();
      });
      it('should not return undefined.', function() {
        _config = {
          newId: _fixture.eid,
          format: _fixture
        };
        var widget = imageWidget.create(_config, _rootNode);
        expect(widget.getWidgetElement()).not.toBe(undefined);
        var image = widget.getWidgetElement();
        expect(image.id).toBe('' + _fixture.eid);
        expect(image.style.height).toBe('100px');
        expect(image.style.height).toBe('100px');
      });
    });

    describe('construct new image with borders', function() {
      it('should display borders', function() {
        var top = FormattingFixture.borderFormatting('double', 20,
            '#000000');
        var right = FormattingFixture.borderFormatting('dashed', 8,
            '#FFFFFF');
        var bottom = FormattingFixture.borderFormatting('dotted', 44,
            '#0000FF');
        var left = FormattingFixture.borderFormatting('solid', 48,
            '#00FF00');
        var borders = FormattingFixture.bordersFormatting(top, right, bottom,
            left);

        var fixture_borders = imageFixture.imageElement(225, 150, undefined,
            undefined, undefined, undefined, false);
        fixture_borders.borders = borders;
        _config = {
          newId: 'newimage',
          format: fixture_borders
        };

        var widget = imageWidget.create(_config, _rootNode);
        expect(widget.getWidgetElement()).not.toBe(undefined);
        var image = widget.getWidgetElement();

        expect(image.style['border-top-style']).toBe('double');
        // 2.5 pts is the true number, but the decorator rounds
        // up to 3 points to render double borders properly
        expect(image.style['border-top-width']).toBe('3pt');
        expect(image.style['border-top-color']).toBe('rgb(0, 0, 0)');

        expect(image.style['border-right-style']).toBe('dashed');
        expect(image.style['border-right-width']).toBe('1pt');
        expect(image.style['border-right-color']).toBe(
            'rgb(255, 255, 255)');

        expect(image.style['border-bottom-style']).toBe('dotted');
        expect(image.style['border-bottom-width']).toBe('5.5pt');
        expect(image.style['border-bottom-color']).toBe('rgb(0, 0, 255)');

        expect(image.style['border-left-style']).toBe('solid');
        expect(image.style['border-left-width']).toBe('6pt');
        expect(image.style['border-left-color']).toBe('rgb(0, 255, 0)');
      });
    });
  });
});
