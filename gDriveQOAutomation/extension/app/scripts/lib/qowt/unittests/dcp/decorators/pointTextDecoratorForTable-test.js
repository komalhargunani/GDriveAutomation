// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for testing PointTextDecorator in view of table
 * based scenarios.
 * @author murtaza.haveliwala@synerip.com (Murtaza Haveliwala)
 */

define([
  'qowtRoot/models/env',
  'qowtRoot/models/point',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager'
], function(EnvModel,
            PointModel,
            ColorUtility,
            UnittestUtils,
            PointTextDecorator,
            PlaceHolderTextStyleManager,
            DefaultTextStyleManager,
            ExplicitTextStyleManager,
            ThemeStyleRefManager,
            ThemeFontManager,
            TableStyleManager) {

  'use strict';

  describe('Point Text Decorator Tests for Table', function() {
    var _textRunElement, _cascadedTextRunProperties, _explicitTextRunProperties,
        _fontRef, _textRunObject, _localApi, ZOOM_VALUE = '70%';
    var _pointTextDecorator = PointTextDecorator.create();

    beforeEach(function() {
      PointModel.ThemeId = 111;
      EnvModel.pointsPerEm = 1;

      var testAppendArea = UnittestUtils.createTestAppendArea();

      _textRunElement = testAppendArea;

      _cascadedTextRunProperties = {
        font: 'Calibri',
        siz: 20,
        baseline: 30,
        cap: 'none', // all / small /none
        fill: {
          type: 'solidFill',
          color: {
            clr: '#ff0000',
            effects: [
              {name: 'alpha', value: '100000'}
            ],
            type: 'srgbClr'
          },
          alpha: 1
        },
        color: {     // for table
          scheme: 'dk1',
          type: 'schemeClr'
        },
        strike: 'single',
        bld: true,
        itl: true,
        udl: true
      };

      _explicitTextRunProperties = {
        font: 'Calibri',
        siz: 20,
        baseline: 30,
        cap: 'none', // all / small /none
        fill: {
          type: 'solidFill',
          color: {
            clr: '#00ff00',
            effects: [
              {name: 'alpha', value: '100000'}
            ],
            type: 'srgbClr'
          },
          alpha: 1
        },
        color: {     // for table
          scheme: 'dk1',
          type: 'schemeClr'
        },
        strike: 'single',
        bld: true,
        itl: true,
        udl: true
      };

      // Using different color for fontRef,Cascade and explicit style for being
      // sure about which one is getting applied
      _fontRef = {
        type: 'solidFill',
        color: {
          clr: '#0000ff',
          effects: [
            {name: 'alpha', value: '100000'}
          ],
          type: 'srgbClr'
        },
        alpha: 1
      };

      _textRunObject = {
        etp: 'txrun',
        eid: 111,
        rpr: _explicitTextRunProperties,
        lvl: 0,
        data: 'some text'
      };

      spyOn(TableStyleManager, 'applyTblCellStyleClasses');
      spyOn(ExplicitTextStyleManager, 'resolveRunPropertyFor');
      spyOn(PlaceHolderTextStyleManager, 'resolveRunPropertyFor').andReturn(
          _cascadedTextRunProperties);
      spyOn(DefaultTextStyleManager, 'resolveRunPropertyFor').andReturn(
          _cascadedTextRunProperties);
      spyOn(ThemeStyleRefManager, 'getCachedFontRefStyle').andReturn(_fontRef);
      PointModel.CurrentPlaceHolderAtSlide.phTyp = true;
      PointModel.currentTable.isProcessingTable = true;
      _localApi = _pointTextDecorator.decorate(_textRunElement).withNewDiv(
          _textRunObject.eid);
      PointModel.fontList = [];
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
      EnvModel.pointsPerEm = undefined;
      PointModel.fontList = undefined;
      _textRunElement = undefined;
      UnittestUtils.flushTestAppendArea();
    });

    describe('Tests blank space', function() {
      it('should set no text-decoration, when only white-spaces text',
          function() {
            _textRunObject.data = '    ';
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();
            expect(expectedDiv.style['text-decoration']).toEqual('none');
          });
    });

    describe('Tests applied classes', function() {
      it('should apply table cell style classes when processing table',
          function() {
            _localApi.withTextRunProperties(_textRunObject).getDecoratedDiv();

            expect(TableStyleManager.applyTblCellStyleClasses).
                toHaveBeenCalled();
          });
    });

    /********************** Font ********************/
    describe('Tests for font family', function() {
      it('should create correct text run properties with correct font class',
          function() {
            var fontClassName = 'qowt-font1-Calibri';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            // No more accepting fonts in explicit style attribute
            expect(expectedDiv.style['font-family']).toBe('');
            expect(expectedDiv.classList.contains(fontClassName)).toBe(true);
          });

      it('should create correct text run properties with cascaded font',
          function() {
            _cascadedTextRunProperties.font = '+mn-lt';
            spyOn(ThemeFontManager, 'getThemeFontFace').andReturn('Calibri');

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.classList.contains('qowt-font1-Calibri')).toBe(
                true);
          });
    });

    /********************** Size ********************/
    describe('Tests for font size', function() {
      it('should create correct text run properties with explicit size when ' +
          'superscript is defined', function() {

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('20em');
          });

      it('should create correct text run properties with explicit size when ' +
          'subscript is defined and superscript is undefined', function() {
            _explicitTextRunProperties.baseline = -40;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('20em');
          });

      it('should create correct text run properties with explicit size when ' +
          'both baselines are undefined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.baseline = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['font-size']).toBe('20em');
          });

      it('should create correct text run properties with explicit size when ' +
          'baseline is defined', function() {

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('20em');
          });

      it('should update maximum paragraph font size when maximum paragraph ' +
          'font size is less than the current text-run font-size', function() {
            _explicitTextRunProperties.siz = 45;
            PointModel.maxParaFontSize = 7;

            _localApi.withTextRunProperties(_textRunObject).getDecoratedDiv();

            expect(PointModel.maxParaFontSize).toEqual(45);
          });

      it('should not update maximum paragraph font size when maximum ' +
          'paragraph font size is greater than the current text-run font-size',
          function() {

            PointModel.maxParaFontSize = 70;

            _localApi.withTextRunProperties(_textRunObject).getDecoratedDiv();
            expect(PointModel.maxParaFontSize).toEqual(70);
          });

      it('should create correct text run properties with no font-size even ' +
          'when cascaded size is present and when superscript is defined and' +
          'place holder type is defined',
          function() {
            _explicitTextRunProperties.siz = undefined;
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create correct text run properties with no font-size even ' +
          'when cascaded size is present and when superscript is defined and ' +
          'subscript is undefined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.siz = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create correct text run properties with no font-size even ' +
          'when cascaded size is present and when subscript is defined and ' +
          'superscript is undefined and place holder type is defined',
          function() {
            _explicitTextRunProperties.siz = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create correct text run properties with no font-size even ' +
          'when cascaded size present and subscript is defined and ' +
          'superscript is undefined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.siz = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create text run properties with no cascaded size when ' +
          'both subscript and superscript are undefined and place holder ' +
          'type is defined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.siz = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create text run properties with no cascaded size when ' +
          'both subscript and superscript are undefined and place holder ' +
          'type is undefined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.siz = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create text run properties with no cascaded size when ' +
          'both subscript and superscript are undefined and place holder type' +
          ' is defined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.siz = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['font-size']).toBe('');
          });

      it('should create text run properties with no cascaded size when ' +
          'both subscript and superscript are undefined and place holder ' +
          'type is undefined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.siz = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['font-size']).toBe('');
          });
    });

    /*************************** superscript **********************/
    describe('Tests for superscript property', function() {

      it('should create correct text run properties with explicit superscipt ' +
          'when underline property defined ', function() {
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('30%');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create correct text run properties with explicit superscipt ' +
          'when underline property undefined ', function() {
            _explicitTextRunProperties.udl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('30%');
          });

      it('should create correct text run properties for only explicit ' +
          'properties defining underline property even when cascaded ' +
          'superscript is defined and when place holder type is defined',
          function() {
            _explicitTextRunProperties.baseline = -40;
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create correct text run properties for only explicit ' +
          'properties with underline defined but not for cascaded superscript' +
          'and when place holder type is undefined', function() {
            _explicitTextRunProperties.baseline = -40;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create correct text run properties with explicit properties' +
          ' only even when cascaded superscript is defined and underline ' +
          'property is undefined and place holder type is defined', function() {
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.baseline = -40;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
          });

      it('should create correct text run properties only for explicit ' +
          'properties even when cascaded superscript and cascaded underline' +
          ' property are defined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.baseline = -40;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
          });
    });

    /*************************** subscript **********************/
    describe('Tests for subscript property', function() {

      it('should create correct text run properties with explicit subscript' +
          ' when underline property defined ', function() {
            _explicitTextRunProperties.baseline = -40;
            _cascadedTextRunProperties.baseline = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create correct text run properties with explicit subscript' +
          ' when underline property undefined ', function() {
            _explicitTextRunProperties.baseline = -40;
            _explicitTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.udl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe(ZOOM_VALUE);
            expect(expectedDiv.style['vertical-align']).toBe('-40%');
          });

      it('should create correct text run properties for only explicit' +
          ' properties and not for cascaded properties and when place holder' +
          ' type is defined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.baseline = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['vertical-align']).toBe('');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create correct text run properties for only explicit ' +
          'defined properties and not for the defined cascaded properties' +
          ' and when place holder type is undefined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.baseline = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['vertical-align']).toBe('');
            expect(expectedDiv.style['text-decoration']).toBe('underline ' +
                'line-through');
            expect(expectedDiv.style.padding).toBe('');
            expect(expectedDiv.style['border-bottom']).toBe('');
          });

      it('should create normal text run from explicit properties and not ' +
          'cascaded properties, when cascaded subscript when underline ' +
          'property is undefined and place holder type is defined', function() {
            _explicitTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.udl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['vertical-align']).toBe('');
          });

      it('should create normal text run from explicit properties and not ' +
          'cascaded properties, when cascaded subscript when underline ' +
          'property is undefined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.baseline = undefined;
            _cascadedTextRunProperties.baseline = undefined;
            _explicitTextRunProperties.udl = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.zoom).toBe('');
            expect(expectedDiv.style['vertical-align']).toBe('');
          });
    });

    /******************** Cap ********************/
    describe('Tests for cap property', function() {

      it('should create correct text run properties with explicit cap type all',
          function() {
            _explicitTextRunProperties.cap = 'all';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('uppercase');
          });

      it('should create correct text run properties with explicit cap ' +
          'type small', function() {
            _explicitTextRunProperties.cap = 'small';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-variant']).toBe('small-caps');
          });

      it('should create correct text run properties with explicit cap ' +
          'type none', function() {
            _explicitTextRunProperties.cap = 'none';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('none');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type all and place holder type is defined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'all';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type all and place holder type is undefined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'all';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type small and place holder type is defined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'small';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-variant']).toBe('');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type small and place holder type is undefined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'small';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-variant']).toBe('');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type none and place holder type is defined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'none';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('');
          });

      it('should create correct text run properties even when cascaded cap ' +
          'type none and place holder type is undefined', function() {
            _explicitTextRunProperties.cap = undefined;
            _cascadedTextRunProperties.cap = 'none';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-transform']).toBe('');
          });
    });

    /******************** fill ********************/
    describe('Tests for fill color and color effect', function() {

      it('should create correct text run properties with explicit fill ' +
          'with solid fill', function() {
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('rgb(0, 255, 0)');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create correct text run properties with explicit fill with ' +
          'gradient fill', function() {
            _explicitTextRunProperties.fill = {
              type: 'gradientFill',
              alpha: 1,
              gsLst: [
                {
                  color: {
                    clr: '#00ff00',
                    effects: [
                      {name: 'alpha', value: '100000'}
                    ],
                    type: 'srgbClr'
                  }
                }
              ]};

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('rgb(0, 255, 0)');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create correct text run properties with explicit fill has ' +
          'no fill', function() {
            _textRunObject.rpr.fill.type = 'noFill';

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.display).toBe('none');
          });

      it('should create correct text run properties with fontRef fill with ' +
          'solid fill', function() {
            _explicitTextRunProperties.fill = undefined;
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('rgb(0, 0, 255)');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create correct text run properties with fontRef fill with ' +
          'gradient fill', function() {
            _explicitTextRunProperties.fill = undefined;

            _fontRef = {
              type: 'gradientFill',
              alpha: 1,
              gsLst: [
                {
                  color: {
                    clr: '#0000ff',
                    effects: [
                      {name: 'alpha', value: '100000'}
                    ],
                    type: 'srgbClr'
                  }
                }
              ]};

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('rgb(0, 0, 255)');
            expect(expectedDiv.style.opacity).toBe('1');
          });


      it('should create non-fill text run properties even when cascaded fill ' +
          'with solid fill and place holder type is defined', function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create non-fill text run properties even when cascaded fill ' +
          'with solid fill and place holder type is undefined', function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create non-colored text run properties even when cascaded ' +
          'fill defined with gradient fill and place holder type is defined',
          function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;
            _cascadedTextRunProperties.fill = {
              type: 'gradientFill',
              alpha: 1,
              gsLst: [
                {
                  color: {
                    clr: '#ff0000',
                    effects: [
                      {name: 'alpha', value: '100000'}
                    ],
                    type: 'srgbClr'
                  }
                }
              ]};

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create non-colored text run properties even when cascaded ' +
          'fill with gradient fill is defined and place holder type is ' +
          'undefined', function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;

            _cascadedTextRunProperties.fill = {
              type: 'gradientFill',
              alpha: 1,
              gsLst: [
                {
                  color: {
                    clr: '#ff0000',
                    effects: [
                      {name: 'alpha', value: '100000'}
                    ],
                    type: 'srgbClr'
                  }
                }
              ]};
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      /******************** color *******************/

      it('should create correct text run properties with explicit color ',
          function() {
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('rgb(0, 255, 0)');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create correct text run properties with fontRef ', function() {
        _explicitTextRunProperties.fill = undefined;

        var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
            getDecoratedDiv();

        expect(expectedDiv.style.color).toBe('rgb(0, 0, 255)');
        expect(expectedDiv.style.opacity).toBe('1');
      });

      it('should create non-colored text run properties even when cascaded ' +
          'color and place holder type is defined', function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });

      it('should create non-colored text run properties even when cascaded ' +
          'color and place holder type is undefined', function() {
            _explicitTextRunProperties.fill = undefined;
            _fontRef.color = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style.color).toBe('');
            expect(expectedDiv.style.opacity).toBe('1');
          });
    });

    /******************** strike *******************/
    describe('Tests for strike-through property', function() {

      it('should create correct text run properties with explicit strike ' +
          'type single', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('line-through');
          });

      it('should create correct text run properties with explicit strike ' +
          'type double', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('line-through');
          });


      it('should create non-strike text run properties even when cascaded ' +
          'strike type single and place holder type is defined', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _explicitTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('');
          });

      it('should create non-strike text run properties even when cascaded ' +
          'strike type single and place holder type is undefined', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _explicitTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('');
          });

      it('should create non-strike text run properties even when cascaded ' +
          'strike type double and place holder type is defined', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _explicitTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('');
          });

      it('should create non-strike text run properties even when cascaded ' +
          'strike type double and place holder type is undefined', function() {
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.subscript = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.subscript = undefined;
            _explicitTextRunProperties.strike = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('');
          });
    });

    /******************** bold ********************/
    describe('Tests for bold property', function() {

      it('should create correct text run properties with explicit bold ' +
          'property defined', function() {
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('bold');
          });

      it('should create correct text run properties with explicit bold ' +
          'property undefined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create correct text run properties with explicit bold ' +
          'property false', function() {
            _explicitTextRunProperties.bld = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create non-bold text run properties even when cascaded bold ' +
          'property defined and place holder type is defined', function() {
            _explicitTextRunProperties.bld = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create non-bold text run properties even when cascaded bold ' +
          'property defined and place holder type is undefined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = true;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create correct text run properties with cascaded bold ' +
          'property undefined and place holder type is defined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create correct text run properties with cascaded bold ' +
          'property undefined and place holder type is undefined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create non-bold text run properties for text in table even ' +
          'when cascaded bold property defined and place holder type is ' +
          'defined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = true;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create non-bold text run properties for text in table even' +
          ' when cascaded bold property defined and place holder type is ' +
          'undefined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = true;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create correct text run properties for text in table with ' +
          'cascaded bold property undefined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create non-bold text run properties for text in table even' +
          ' when cascaded bold property undefined and place holder type is ' +
          'defined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });

      it('should create correct text run properties for text in table with ' +
          'explicit bold property defined ', function() {
            _explicitTextRunProperties.bld = true;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('bold');
          });

      it('should create correct text run properties for text in table with ' +
          'explicit bold property undefined', function() {
            _explicitTextRunProperties.bld = undefined;
            _cascadedTextRunProperties.bld = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-weight']).toBe('normal');
          });
    });

    /******************** italic ********************/
    describe('Tests for italic property', function() {

      it('should create correct text run properties with explicit italic ' +
          'property defined', function() {
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('italic');
          });

      it('should create correct text run properties with explicit italic ' +
          'property undefined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create correct text run properties with explicit italic ' +
          'property false', function() {
            _explicitTextRunProperties.itl = false;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties even when cascaded ' +
          'italic property defined and place holder type is defined',
          function() {
            _explicitTextRunProperties.itl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties even when cascaded' +
          ' italic property defined and place holder type is undefined',
          function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = true;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create correct text run properties with cascaded italic ' +
          'property undefined and place holder type is defined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create correct text run properties with cascaded italic ' +
          'property undefined and place holder type is undefined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties for text even when ' +
          'cascaded italic property defined and place holder type is defined',
          function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = true;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties for text ' +
          'even when cascaded italic property defined and place holder type' +
          ' is undefined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = true;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties for text in table ' +
          'when cascaded italic property undefined and place holder type is ' +
          'undefined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create non-italic text run properties for text when ' +
          'cascaded italic property undefined and place holder type is ' +
          'defined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });

      it('should create correct text run properties for text in table with ' +
          'explicit italic property defined ', function() {
            _explicitTextRunProperties.itl = true;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('italic');
          });

      it('should create correct text run properties for text in table with ' +
          'explicit italic property undefined', function() {
            _explicitTextRunProperties.itl = undefined;
            _cascadedTextRunProperties.itl = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['font-style']).toBe('normal');
          });
    });

    /******************** underline ********************/
    describe('Tests for underline property', function() {

      it('should create correct text run properties with explicit ' +
          'underline property', function() {
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.udl = undefined;
            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('underline');
          });

      it('should create correct text run properties with explicit underline ' +
          'property undefined, with no underline', function() {
            _explicitTextRunProperties.udl = undefined;
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('');
          });

      it('should create correct text run properties with explicit underline ' +
          'property is false and strike property is undefined', function() {
            _explicitTextRunProperties.udl = false;
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('none');
          });

      it('should create correct text run properties with cascaded underline ' +
          'property and place holder type is defined', function() {
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('underline');
          });

      it('should create correct text run properties with cascaded underline ' +
          'property and place holder type is undefined', function() {
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('underline');
          });

      it('should create correct text run properties with cascaded underline ' +
          'property is false and strike property is undefined ' +
          'and place holder type is defined', function() {
            _explicitTextRunProperties.udl = false;
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.udl = false;
            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('none');
          });

      it('should create correct text run properties with cascaded underline ' +
          'property is false and strike property is undefined ' +
          'and place holder type is undefined', function() {
            _explicitTextRunProperties.udl = false;
            _explicitTextRunProperties.strike = undefined;
            _explicitTextRunProperties.superscript = undefined;
            _explicitTextRunProperties.subscript = undefined;

            _cascadedTextRunProperties.udl = false;
            _cascadedTextRunProperties.strike = undefined;
            _cascadedTextRunProperties.superscript = undefined;
            _cascadedTextRunProperties.subscript = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.style['text-decoration']).toBe('none');
          });
    });

    describe(' with hyperlink ', function() {

      it('should set textHyperlink attribute for run hyperlink', function() {
        var link = 'sample link';
        _textRunObject.rpr.lnk = link;
        spyOn(ColorUtility, 'getHexEquivalentOfSchemeColor');

        var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
            getDecoratedDiv();

        expect(expectedDiv.getAttribute('qowt-marker')).toEqual(
            'textHyperlink<sample link>;');
      });

      it('should set hyperlink color from scheme-colors, for run hyperlink',
          function() {
            var link = 'sample link';
            _textRunObject.rpr.lnk = link;
            spyOn(ColorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
                'rgb(46, 139, 87)');

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.getAttribute('qowt-marker')).toEqual(
                'textHyperlink' + '<sample link>;');
            expect(ColorUtility.getHexEquivalentOfSchemeColor).
                toHaveBeenCalledWith('hlink');
            expect(expectedDiv.style.color).toEqual('rgb(46, 139, 87)');
          });

      it('should add qowt-point-thumbnail-textLink css class for run hyperlink',
          function() {
            var link = 'sample link';
            _textRunObject.rpr.lnk = link;

            spyOn(ColorUtility, 'getHexEquivalentOfSchemeColor');
            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.className).toContain(
                'qowt-point-thumbnail-textLink');
          });

      it('should not set textHyperlink attribute for run hyperlink when lnk ' +
          'is undefined', function() {
            var link = 'sample link';
            _textRunObject.rpr.lnk = link;
            spyOn(ColorUtility, 'getHexEquivalentOfSchemeColor');

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.getAttribute('textHyperlink')).not.toEqual(link);
          });

      it('should not add qowt-point-thumbnail-textLink css class for run ' +
          'hyperlink when lnk is undefined', function() {
            _textRunObject.rpr.lnk = undefined;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.className).not.toContain(
                'qowt-point-thumbnail-textLink');
          });

      it('should not set textHyperlink attribute for run hyperlink when lnk ' +
          'has a file path in it', function() {
            var link = 'file://xyz';
            _textRunObject.rpr.lnk = link;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.getAttribute('textHyperlink')).not.toEqual(link);
          });

      it('should not add qowt-point-thumbnail-textLink css class for run ' +
          'hyperlink when lnk has a file path in it', function() {
            var link = 'file://xyz';
            _textRunObject.rpr.lnk = link;

            var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
                getDecoratedDiv();

            expect(expectedDiv.className).not.toContain(
                'qowt-point-thumbnail-textLink');
          });

      it('should apply default text shadow when text has shadow', function() {
        _textRunObject.rpr.outSdwEff = {
          'color': {
            'clr': '#ff0000',
            'effects': [
              {'name': 'alpha', 'value': 100000}
            ],
            'type': 'srgbClr'
          }
        };

        var expectedDiv = _localApi.withTextRunProperties(_textRunObject).
            getDecoratedDiv();

        expect(expectedDiv.style['text-shadow']).toEqual('rgb(255, 0, 0)' +
            ' 3px 1px 1px');
      });
    });
  });
});
