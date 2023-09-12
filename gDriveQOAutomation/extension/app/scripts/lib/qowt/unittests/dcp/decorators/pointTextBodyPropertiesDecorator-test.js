/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
/*
 * Unit tests for POINT - Body Properties handler
 */

define([
  'qowtRoot/dcp/decorators/pointTextBodyPropertiesDecorator',
  'qowtRoot/variants/configs/point',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/unittests/__unittest-util'
], function(
  PointTextBodyPropertiesDecorator,
  PointConfig,
  UnitConversionUtils,
  UnitTestUtils) {

  'use strict';

  describe('test point text body properties decorator', function() {
    var _pointTextBodyPropertiesDecorator;
    var _shapeTextBodyDiv;
    var _shapeDivStyle, _bodyProperties;

    beforeEach(function() {
      _pointTextBodyPropertiesDecorator = PointTextBodyPropertiesDecorator.
            create();
      _shapeTextBodyDiv = UnitTestUtils.createTestAppendArea();

      _bodyProperties = {};
    });

    afterEach(function() {
      _pointTextBodyPropertiesDecorator = undefined;
      _shapeTextBodyDiv = undefined;
      UnitTestUtils.flushTestAppendArea();
    });

    describe('test point text body properties decorator for decorate function',
        function() {

          //***************************** wrap ******************************
          it('should apply correct attribute to text body when wrap ' +
              'is true', function() {
                _bodyProperties.wrap = 'square';

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('wrap')).toEqual('true');
              });

          it('should apply default attribute to text body when wrap ' +
              'is undefined', function() {

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('wrap')).toEqual(
                    (PointConfig.kDEFAULT_IS_BODY_PROPERTY_WRAP).toString());
              });

          it('should apply correct attribute to text body when wrap ' +
              'is defined but not square', function() {
                _bodyProperties.wrap = 'any_other_value';
                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('wrap')).toEqual('false');
              });
          //***************************** anchor center ***********************
          it('should apply correct attribute to text body when anchor ' +
              'center is false', function() {
                _bodyProperties.anchorCtr = false;

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('anchor-center')).
                    toEqual('false');
              });

          it('should apply correct attribute to text body when anchor ' +
              'center is true', function() {
                _bodyProperties.anchorCtr = true;

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('anchor-center')).
                    toEqual('true');
              });

          it('should apply default attribute to text body when anchor ' +
              'center is undefined', function() {
                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.getAttribute('anchor-center')).toEqual(
                    (PointConfig.kDEFAULT_IS_BODY_PROPERTY_ANCHOR_CENTER).
                        toString());
              });

          //**************** left/top/right/bottom insets *******************
          it('should apply correct inline css style to text body when all ' +
              'insets are present in body properties', function() {
                _bodyProperties = {
                  'lIns': '182880',
                  'tIns': '91440',
                  'rIns': '182880',
                  'bIns': '91440'
                };

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['margin-left']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-top']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['margin-right']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-bottom']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
              });

          it('should apply correct inline css style to text body when only ' +
              'left inset is present in body properties', function() {
                _bodyProperties = {'lIns': '182880'};

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['margin-left']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-top']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
                expect(_shapeTextBodyDiv.style['margin-right']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-bottom']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
              });

          it('should apply correct inline css style to text body when only ' +
              'top inset is present in body properties', function() {
                _bodyProperties = {'tIns': '182880'};

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['margin-left']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-top']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
                expect(_shapeTextBodyDiv.style['margin-right']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-bottom']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
              });

          it('should apply correct inline css style to text body when only ' +
              'right inset is present in body properties', function() {
                _bodyProperties = {'rIns': '182880'};

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['margin-left']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-top']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
                expect(_shapeTextBodyDiv.style['margin-right']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-bottom']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
              });

          it('should apply correct inline css style to text body when only ' +
              'bottom inset is present in body properties', function() {
                _bodyProperties = {'bIns': '182880'};

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['margin-left']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-top']).toContain(
                    UnitConversionUtils.convertEmuToPoint(45720) + 'pt');
                expect(_shapeTextBodyDiv.style['margin-right']).toContain(
                    UnitConversionUtils.convertEmuToPoint(91440) + 'pt');
                expect(_shapeTextBodyDiv.style['padding-bottom']).toContain(
                    UnitConversionUtils.convertEmuToPoint(182880) + 'pt');
              });

          //***************************** font scaling **********************
          it('should apply correct inline css style to text body when font ' +
              'scale is present inside normAutofit in body properties',
              function() {
                _bodyProperties = {
                  'normAutofit': {lnSpcReduction: '20', fontScale: '70'}
                };

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['font-size']).toContain('70%');
              });

          it('should apply correct inline css style to text body when ' +
              'normAutofit is undefined in \body properties', function() {
                _bodyProperties = {'normAutofit': undefined};

                _pointTextBodyPropertiesDecorator.decorate(
                    _shapeTextBodyDiv, _bodyProperties);

                expect(_shapeTextBodyDiv.style['font-size']).toContain('100%');
              });
        });

    describe('test point text body properties decorator for Shape Box Align ' +
        'Property function', function() {
          beforeEach(function() {
            _shapeDivStyle = {};
          });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is top ', function() {
                _bodyProperties = {'anchor': 'top'};

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('start');
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is bottom ', function() {
                _bodyProperties = {'anchor': 'bottom'};

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('end');
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is ctr ', function() {
                _bodyProperties = {'anchor': 'ctr'};

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('center');
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is undefined ', function() {
                _bodyProperties = {};

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).not.toBeDefined();
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is bottom and anchorCtr is true', function() {
                _bodyProperties = { anchor: 'bottom', anchorCtr: true };

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('end');
                expect(_shapeDivStyle['-webkit-box-pack']).toEqual('center');
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is bottom and anchorCtr is false', function() {
                _bodyProperties = { anchor: 'bottom', anchorCtr: false };

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('end');
                expect(_shapeDivStyle['-webkit-box-pack']).not.toBeDefined();
              });

          it('should apply correct inline css style to parent shape when ' +
              'anchor is bottom and anchorCtr is undefined', function() {
                _bodyProperties = { anchor: 'bottom' };

                _pointTextBodyPropertiesDecorator.
                    getContainingShapeBoxAlignProperty(_bodyProperties,
                        _shapeDivStyle);

                expect(_shapeDivStyle['-webkit-box-align']).toEqual('end');
                expect(_shapeDivStyle['-webkit-box-pack']).not.toBeDefined();
              });
        });
  });
});
