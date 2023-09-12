/**
 * Tests for HyperlinkDecorator
 *
 * General usage --
 * var _hlDecorator = HyperlinkDecorator.create();
 * anchorElement = _hlDecorator.decorate(element).withLink(lnk);
 *
 */

define([
  'qowtRoot/dcp/decorators/hyperlinkDecorator',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/features/utils',
  'qowtRoot/models/point'
], function(HyperlinkDecorator,
            ColorUtility,
            QOWTMarkerUtils,
            Features,
            PointModel) {

  'use strict';

  describe('Test hyperlink decorator ', function() {
    var hyperlinkDecorator = HyperlinkDecorator.create();
    var _colorUtility = ColorUtility;

    /**
     * Fake method that enables 'edit' and 'pointEdit' flags, to be called when
     * faking through spyOn(Features,'isEnabled').
     *
     * @param {string} feature  the feature flag to check for
     * @returns {boolean|string} flag value
     * @private
     */
    var fakeFeaturesWithPointEditAndEditEnabled_ = function(feature) {
      switch(feature) {
        case 'pointEdit':  // fall through intentional
        case 'edit':
          return true;
        default:
          return this.isEnabled.originalValue(feature);
      }
    };

    /**
     * Fake method that disables 'edit' and 'pointEdit' flags, to be called when
     * faking through spyOn(Features,'isEnabled').
     *
     * @param {string} feature  the feature flag to check for
     * @returns {boolean|string} flag value
     * @private
     */
    var fakeFeaturesWithPointEditAndEditDisabled_ = function(feature) {
      switch(feature) {
        case 'pointEdit': // fall through intentional
        case 'edit':
          return false;
        default:
          return this.isEnabled.originalValue(feature);
      }
    };

    /**
     * Tests that a hyperlink span created in a certain environment setting
     * (viewer or editor build) doesn't get created with an anchor inside it.
     *
     * @param {boolean} isEditorBuild  True, if the testing is to be done for
     *     editor build, false for viewer build
     * @private
     */
    var testSpanForAbsenceOfAnchorInIt_ = function(isEditorBuild) {
      var fakeFeatures = isEditorBuild ?
          fakeFeaturesWithPointEditAndEditEnabled_ :
          fakeFeaturesWithPointEditAndEditDisabled_;
      spyOn(Features,'isEnabled').andCallFake(fakeFeatures);

      var spanElement = document.createElement('SPAN'),
          spanText = 'hyperlinked text';
      spanElement.textContent = spanText;

      var link = 'http://www.samplelink.com/';

      spyOn(QOWTMarkerUtils, 'fetchQOWTMarker').andReturn(link);

      hyperlinkDecorator.decorate(spanElement).withLinkForText();

      expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalledWith(
          spanElement, 'textHyperlink');
      expect(spanElement.childNodes.length).toEqual(1);
      expect(spanElement.childNodes[0].nodeType).toEqual(Node.TEXT_NODE);
      expect(spanElement.childNodes[0].textContent).toEqual(spanText);

      spanElement = undefined;
    };

    describe('for text hyperlink ', function() {
      var event_, textRunSpanElement_;

      beforeEach(function() {
        textRunSpanElement_ = document.createElement('span');
        textRunSpanElement_.textContent = 'hyperlinked text';

        event_ = document.createEvent('Event');
        event_.initEvent('click', true, false);

        spyOn(window, 'open');
      });

      afterEach(function() {
        textRunSpanElement_ = undefined;
        event_ = undefined;
      });

      it('should *not* wrap anchor node in span node for viewer build',
        function() {
          testSpanForAbsenceOfAnchorInIt_(false);
        });

      it('should move htmlnode text into anchor element text ', function() {
        var divElement = document.createElement('DIV');
        var divParentElement = document.createElement('DIV');
        divParentElement.appendChild(divElement);
        var text = 'some text';
        divElement.textContent = text;
        var link = 'mailto:xyz.com';
        QOWTMarkerUtils.addQOWTMarker(divElement, 'textHyperlink', link);

        spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
            'color');

        hyperlinkDecorator.decorate(divElement).withLinkForText();

        expect(divElement.childNodes[0].textContent).toEqual(text);
      });

      it('should not decorate element when html node is undefined',
          function() {
            var divElement;

            hyperlinkDecorator.decorate(divElement).withLinkForText();

            expect(divElement).toEqual(undefined);
          });

      it('should return undefined when link is undefined', function() {
        var divElement = document.createElement('DIV');

        hyperlinkDecorator.decorate(divElement).withLinkForText();

        expect(divElement.hasChildNodes()).toEqual(false);
      });

      it('should return undefined when link and element are undefined',
          function() {
            var divElement;

            hyperlinkDecorator.decorate(divElement).withLinkForText();

            expect(divElement).toEqual(undefined);
          });

      it('span with hyperlink should listen to click event', function() {
        var divElement = document.createElement('span');

        spyOn(divElement, 'addEventListener');
        hyperlinkDecorator.decorate(divElement).withLinkForShape();

        expect(divElement.addEventListener).toHaveBeenCalled();
      });

      it('should *not* wrap anchor node in span node in editor build',
          function() {
            testSpanForAbsenceOfAnchorInIt_(true);
          });

      it('should open email urls in a new window/tab in slideshow mode when ' +
          'clicked on the link text', function() {
            spyOn(PointModel,'slideShowMode').andReturn(true);
            spyOn(Features,'isEnabled').andCallFake(
                fakeFeaturesWithPointEditAndEditEnabled_);

            var mailLink = 'mailto:xyz.com';
            QOWTMarkerUtils.addQOWTMarker(textRunSpanElement_, 'textHyperlink',
                mailLink);

            spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
                'color');

            hyperlinkDecorator.decorate(textRunSpanElement_).withLinkForText();
            textRunSpanElement_.dispatchEvent(event_);

            expect(window.open).toHaveBeenCalledWith(mailLink, '_blank');
          });

      it('should *not* open targeted link in normal view for Editor build ' +
          'when clicked', function() {
            spyOn(Features,'isEnabled').andCallFake(
                fakeFeaturesWithPointEditAndEditEnabled_);
            hyperlinkDecorator.decorate(textRunSpanElement_).withLinkForText();
            textRunSpanElement_.dispatchEvent(event_);

            expect(window.open).not.toHaveBeenCalled();
          });

      it('should open targeted link in normal view for Viewer build when ' +
          'clicked', function() {
            spyOn(Features,'isEnabled').andCallFake(
                fakeFeaturesWithPointEditAndEditDisabled_);
            var link = 'http://www.samplelink.com/';
            spyOn(QOWTMarkerUtils, 'fetchQOWTMarker').andReturn(link);

            hyperlinkDecorator.decorate(textRunSpanElement_).withLinkForText();
            textRunSpanElement_.dispatchEvent(event_);

            expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith(link, '_blank');
          });

      it('should open targeted link in slide show mode in Viewer build when ' +
          'clicked', function() {
            var link = 'http://www.samplelink.com/';

            spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
                'color');
            spyOn(PointModel,'slideShowMode').andReturn(true);
            spyOn(Features,'isEnabled').andCallFake(
                fakeFeaturesWithPointEditAndEditDisabled_);
            spyOn(QOWTMarkerUtils, 'fetchQOWTMarker').andReturn(link);

            hyperlinkDecorator.decorate(textRunSpanElement_).withLinkForText();
            textRunSpanElement_.dispatchEvent(event_);

            expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith(link, '_blank');
          });

      it('should open targeted link in slide show mode in Editor build when ' +
          'clicked', function() {
            var link = 'http://www.samplelink.com/';
            spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
                'color');
            spyOn(PointModel,'slideShowMode').andReturn(true);
            spyOn(Features,'isEnabled').andCallFake(
                fakeFeaturesWithPointEditAndEditEnabled_);
            spyOn(QOWTMarkerUtils, 'fetchQOWTMarker').andReturn(link);

            hyperlinkDecorator.decorate(textRunSpanElement_).withLinkForText();
            textRunSpanElement_.dispatchEvent(event_);

            expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith(link, '_blank');
          });
    });

    describe('for shape hyperlink', function() {
      var _event, _shapeDivElement, _parentDivElement;

      beforeEach(function() {
        _shapeDivElement = document.createElement('div');
        _parentDivElement = document.createElement('div');
        _parentDivElement.appendChild(_shapeDivElement);

        _event = document.createEvent('Event');
        _event.initEvent('click', true, false);

        spyOn(QOWTMarkerUtils, 'fetchQOWTMarker');
        spyOn(window, 'open');
      });

      afterEach(function() {
        _shapeDivElement = undefined;
        _parentDivElement = undefined;
        _event = undefined;
      });

      it('should not add css class html node is undefined', function() {
        var divElement;

        hyperlinkDecorator.decorate(divElement).withLinkForShape();

        expect(divElement).toEqual(undefined);
      });

      it('shape with hyperlink should listen to click event', function() {
        var divElement = document.createElement('div');

        spyOn(divElement, 'addEventListener');
        hyperlinkDecorator.decorate(divElement).withLinkForShape();

        expect(divElement.addEventListener).toHaveBeenCalled();
      });

      it('shape add appropriate css class for a shape with hyperlink ' +
          '**qowt-point-shapeLink**', function() {
            var divElement = document.createElement('div');

            hyperlinkDecorator.decorate(divElement).withLinkForShape();

            expect(divElement.classList.contains(
                  'qowt-point-shapeLink')).toEqual(true);
         });

      it('should not open targeted link in normal view for editor', function() {
        spyOn(Features,'isEnabled').andCallFake(
            fakeFeaturesWithPointEditAndEditEnabled_);
        hyperlinkDecorator.decorate(_shapeDivElement).withLinkForShape();
        _shapeDivElement.dispatchEvent(_event);

        expect(QOWTMarkerUtils.fetchQOWTMarker).not.toHaveBeenCalled();
        expect(window.open).not.toHaveBeenCalled();
      });

      it('should open targeted link in normal view for viewer', function() {
        spyOn(Features,'isEnabled').andCallFake(
            fakeFeaturesWithPointEditAndEditDisabled_);
        hyperlinkDecorator.decorate(_shapeDivElement).withLinkForShape();
        _shapeDivElement.dispatchEvent(_event);

        expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalled();
      });

      it('should open targeted link in slide show mode', function() {
        spyOn(PointModel,'slideShowMode').andReturn(true);

        hyperlinkDecorator.decorate(_shapeDivElement).withLinkForShape();
        _shapeDivElement.dispatchEvent(_event);

        expect(QOWTMarkerUtils.fetchQOWTMarker).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalled();
      });
    });
  });
});
