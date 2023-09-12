/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */


define([
  'qowtRoot/utils/fontManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/models/model'
], function(
    FontManager,
    CssManager,
    Model) {

  'use strict';

  describe('FontManager', function() {

    var fontArial = 'Arial',
        fontTNR = 'Times New Roman',
        fontUknown = 'UnknownFont',
        fontList = [fontArial, fontTNR, fontUknown];

    var expectedArialFontObject = {
      fontName: 'Arial',
      family: 'Arial, "Arial Unicode MS", Arimo, "Microsoft Sans serif", ' +
          'sans-serif',
      className: 'qowt-font1-Arial'
    };
    var expectedTNRFontObject = {
      fontName: 'Times New Roman',
      family: '"Times New Roman", Tinos, "Baskerville Old Face", "Bell MT", ' +
          'serif',
      className: 'qowt-font1-TimesNewRoman'
    };
    var expectedUnknownFontObject = {
      fontName: 'UnknownFont',
      family: '"UnknownFont"',
      className: 'qowt-font1-UnknownFont'
    };


    beforeEach(function() {});
    afterEach(function() {
      FontManager.reset();
    });

    it('should create dynamic font-family rules for fonts and update the model',
       function() {
         var createdRules = [];
         spyOn(CssManager, 'addRule').andCallFake(function(selector, props) {
            selector = selector || '';
           createdRules.push(props);
         });

         FontManager.initFonts(fontList);

         expect(CssManager.addRule).wasCalled();
         expect(CssManager.addRule.callCount).toBe(3);
         expect(createdRules[0]).toEqual('font-family:' +
             expectedArialFontObject.family + ' !important;');
         expect(createdRules[1]).toEqual('font-family:' +
             expectedTNRFontObject.family + ' !important;');
         expect(createdRules[2]).toEqual('font-family:' +
             expectedUnknownFontObject.family + ' !important;');

         var fontNames = Model.get('fontList', 'names');
         expect(fontNames.length).toBe(3);
       });

    it('should be able to set and remove the qowt font className of an element',
       function() {
         var expectedClass = expectedArialFontObject.className;
         var dummy = document.createElement('div');
         FontManager.setFontClassName(dummy, 'Arial');
         expect(dummy.classList.contains(expectedClass)).toBe(true);

         FontManager.removeFontClassName(dummy);
         expect(dummy.classList.contains(expectedClass)).not.toBe(true);
       });

    it('should be possible to get the font name from the font className',
       function() {
         // make sure we've set a font, or else it wont be known to the manager
         var dummy = document.createElement('div');
         FontManager.setFontClassName(dummy, 'Times New Roman');

         var className = expectedTNRFontObject.className;
         var fontName = expectedTNRFontObject.fontName;
         expect(FontManager.getFontName(className)).toBe(fontName);
       });

    it('should be possible to get the font name from an element', function() {
      var className = expectedTNRFontObject.className;
      var fontName = expectedTNRFontObject.fontName;

      var dummy = document.createElement('div');
      FontManager.setFontClassName(dummy, fontName);

      expect(dummy.classList.contains(className)).toBe(true);
      expect(FontManager.getFontName(dummy)).toBe(fontName);
    });

    it('should be able to return the font family for known fonts', function() {
      expect(FontManager.family(fontArial)).toBe(
          expectedArialFontObject.family);
    });

    it('should fallback to the font name if the family is not known',
       function() {
         expect(FontManager.family(fontUknown)).toBe(
             expectedUnknownFontObject.family);
       });

    it('should be able to return font family for fonts containing spaces',
       function() {
         expect(FontManager.family(fontTNR)).toBe(expectedTNRFontObject.family);
       });

    describe('isSymbolFont', function() {
      it('should return true for symbol-like fonts', function() {
        expect(FontManager.isSymbolFont('Symbol')).toBe(true);
        expect(FontManager.isSymbolFont('Webdings')).toBe(true);
        expect(FontManager.isSymbolFont('Wingdings')).toBe(true);
        expect(FontManager.isSymbolFont('Wingdings 2')).toBe(true);
        expect(FontManager.isSymbolFont('Wingdings 3')).toBe(true);
      });

      it('should return false for non symbol-like fonts', function() {
        expect(FontManager.isSymbolFont('Arial')).toBe(false);
      });
    });

  });

  return {};
});
