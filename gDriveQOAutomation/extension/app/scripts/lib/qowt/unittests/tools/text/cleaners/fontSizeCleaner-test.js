// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for testing fontSizeCleaner.
 *
 * @author murtaza.haveliwala@synerzip.com (Murtaza Haveliwala)
 */
define([
  'qowtRoot/tools/text/mutations/cleaners/fontSizeCleaner',
  'qowtRoot/models/env',
  'qowtRoot/utils/converters/converter'
], function(
    FontSizeCleaner,
    EnvModel,
    Converter) {

  'use strict';

  var cleaner = FontSizeCleaner.cleanerConfig.callback;

  describe('FontSizeCleaner', function() {
    var node;

    beforeEach(function() {
      node = document.createElement('span');
    });
    afterEach(function() {
      node = undefined;
    });

    it('should return cleaned node in pt font-size when supplied with em ' +
        'font-size', function() {
      var fontSize = '2em',
          summary;

      spyOn(Converter, 'pt2em');
      spyOn(Converter, 'em2pt').andCallThrough();

      node.style.fontSize = fontSize;

      cleaner(summary, node);

      expect(Converter.em2pt).toHaveBeenCalledWith(2);
      expect(Converter.pt2em).not.toHaveBeenCalled();
      expect(node.style.fontSize).toBe('24pt');
    });

    it('should return cleaned node in pt font-size when supplied with px ' +
        'font-size', function() {
      var fontSize = '24px',
          summary;

      spyOn(Converter, 'pt2em');
      spyOn(Converter, 'em2pt');

      node.style.fontSize = fontSize;

      cleaner(summary, node);

      expect(Converter.em2pt).not.toHaveBeenCalled();
      expect(Converter.pt2em).not.toHaveBeenCalled();
      expect(node.style.fontSize).toBe('18pt');
    });

    it('should return same node and not do any cleanup when supplied with a' +
        ' node applied with pt font-size', function() {
      var fontSize = '36pt',
          summary;

      spyOn(Converter, 'cssSize2pt');
      spyOn(Converter, 'pt2em');
      spyOn(Converter, 'em2pt');

      node.style.fontSize = fontSize;

      cleaner(summary, node);

      expect(Converter.cssSize2pt).not.toHaveBeenCalled();
      expect(Converter.em2pt).not.toHaveBeenCalled();
      expect(Converter.pt2em).not.toHaveBeenCalled();
      expect(node.style.fontSize).toBe(fontSize);
    });

    describe('For Point product', function() {
      var previousPointsPerEm,
          previousFontUnit;

      beforeEach(function() {
        previousPointsPerEm = EnvModel.pointsPerEm;
        previousFontUnit = EnvModel.fontUnit;
        EnvModel.pointsPerEm = 1;
        EnvModel.fontUnit = 'em';
      });
      afterEach(function() {
        EnvModel.pointsPerEm = previousPointsPerEm;
        EnvModel.fontUnit = previousFontUnit;
      });

      it('should return cleaned node in em font-size when supplied with pt ' +
          'font-size', function() {
        var fontSize = '22pt',
            summary;

        spyOn(Converter, 'pt2em').andCallThrough();
        spyOn(Converter, 'em2pt');

        node.style.fontSize = fontSize;

        cleaner(summary, node);

        expect(Converter.pt2em).toHaveBeenCalledWith(22);
        expect(Converter.em2pt).not.toHaveBeenCalled();
        expect(node.style.fontSize).toBe('22em');
      });

      it('should return cleaned node in em font-size when supplied with px ' +
          'font-size', function() {
        var fontSize = '44px',
            summary;

        spyOn(Converter, 'pt2em').andCallThrough();
        spyOn(Converter, 'em2pt');

        node.style.fontSize = fontSize;

        cleaner(summary, node);

        expect(Converter.pt2em).toHaveBeenCalledWith(33);
        expect(Converter.em2pt).not.toHaveBeenCalled();
        expect(node.style.fontSize).toBe('33em');
      });

      it('should return same node and not do any cleanup when supplied with a' +
          ' node applied with em font-size', function() {
        var fontSize = '2em',
            summary;

        spyOn(Converter, 'cssSize2pt');
        spyOn(Converter, 'pt2em');
        spyOn(Converter, 'em2pt');

        node.style.fontSize = fontSize;

        cleaner(summary, node);

        expect(Converter.cssSize2pt).not.toHaveBeenCalled();
        expect(Converter.em2pt).not.toHaveBeenCalled();
        expect(Converter.pt2em).not.toHaveBeenCalled();
        expect(node.style.fontSize).toBe(fontSize);
      });
    });
  });
});
