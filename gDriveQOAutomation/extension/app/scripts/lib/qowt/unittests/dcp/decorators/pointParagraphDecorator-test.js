define([
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/models/point',
  'qowtRoot/models/env',
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'qowtRoot/dcp/pointHandlers/util/cssManagers/presentation',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/decorators/pointBulletDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/dcp/decorators/pointTextDecorator'
], function(ParagraphDecorator,
            PointModel,
            EnvModel,
            TextSpacingHandler,
            CssManagerPresentation,
            UnittestUtils,
            PointBulletDecorator,
            PlaceHolderTextStyleManager,
            ExplicitTextStyleManager,
            DefaultTextStyleManager,
            PointTextDecorator) {

  'use strict';

  describe('pointParagraphDecorator Decorator Test', function() {
    var _paragraphDecorator = ParagraphDecorator.create();
    var _textParagraph, _explicitParagraphProperties,
        _cascadedParagraphProperties, _firstRunProperty,
        _paragraphObject, _localApi;

    var _pointBulletDecorator = {
      decorate: function() {}
    };

    var _textRunDiv = {
      style: {
        'font-size': '6em',
        'line-height': '120%',
        'min-height': undefined
      }
    };

    var _textDecoratorApi = {
      getDecoratedDiv: function() {
        return _textRunDiv;
      },
      withNewDiv: function() {
        return _textDecoratorApi;
      },
      withTextRunProperties: function() {
        return _textDecoratorApi;
      }
    };

    var _pointTextDecorator = {
      decorate: function() { return _textDecoratorApi; }
    };

    beforeEach(function() {
      var testAppendArea = UnittestUtils.createTestAppendArea();

      _textParagraph = testAppendArea;
      EnvModel.pointsPerEm = 1;

      _explicitParagraphProperties = {
        indent: '0',
        leftMargin: 914400,
        jus: 'R'
      };

      _cascadedParagraphProperties = {
        indent: '0',
        leftMargin: 1828800,
        jus: 'R'
      };

      _firstRunProperty = {
        'b': true,
        'fill': {
          'color': {
            'clr': '#ff0000',
            'effects': [
              {
                'name': 'alpha',
                'value': 100000
              }
            ],
            'type': 'srgbClr'
          },
          'type': 'solidFill'
        },
        'sz': 40
      };

      _paragraphObject = {
        etp: 'para',
        eid: 'E111',
        ppr: _explicitParagraphProperties,
        endParaRPr: {},
        elm: [
          {
            'eid': 'E222',
            'etp': 'txrun',
            'rpr': _firstRunProperty,
            't': 'some text'
          }

        ]
      };

      spyOn(ExplicitTextStyleManager, 'resolveParaPropertyFor');
      spyOn(PlaceHolderTextStyleManager, 'resolveParaPropertyFor').andReturn(
          _cascadedParagraphProperties);
      spyOn(DefaultTextStyleManager, 'resolveParaPropertyFor').andReturn(
          _cascadedParagraphProperties);
      spyOn(PointBulletDecorator, 'create').andReturn(_pointBulletDecorator);
      spyOn(_pointBulletDecorator, 'decorate');
      spyOn(PointTextDecorator, 'create').andReturn(_pointTextDecorator);


      _localApi = _paragraphDecorator.decorate(_textParagraph).withNewDiv(
          _paragraphObject.eid);

      PointModel.CurrentPlaceHolderAtSlide.phTyp = true;
      PointModel.textBodyProperties.wrap = true;
      PointModel.textBodyProperties.anchorCtr = false;
    });

    afterEach(function() {
      EnvModel.pointsPerEm = undefined;
      _textParagraph = undefined;
      UnittestUtils.flushTestAppendArea();
    });

    it('should create basic para tag appropriately', function() {
      var qowtEidAttributeName = 'qowt-eid',
          paraEid = _paragraphObject.eid.toString(),
          expectedDiv = _localApi.getDecoratedDiv();

      expect(expectedDiv.tagName).toBe('P');
      expect(expectedDiv.id).toBe(paraEid);
      expect(expectedDiv.hasAttribute(qowtEidAttributeName)).toBe(true);
      expect(expectedDiv.getAttribute(qowtEidAttributeName)).toBe(paraEid);
    });

    describe('Test for alignment', function() {
      it('should apply correct css property for explicit alignment as left',
          function() {
            _explicitParagraphProperties.jus = 'L';

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('left');
          });

      it('should apply correct css property for cascaded alignment as left ' +
          'and place holder type is defined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'L';
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('left');
          });

      it('should apply correct css property for cascaded alignment as left ' +
          'and place holder type is undefined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'L';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('left');
          });

      it('should apply correct css property for explicit alignment as center',
          function() {
            _explicitParagraphProperties.jus = 'C';

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('center');
          });

      it('should apply correct css property for cascaded alignment as center ' +
          'and place holder type is defined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'C';
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('center');
          });

      it('should apply correct css property for cascaded alignment as center ' +
          'and place holder type is undefined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'C';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('center');
          });

      it('should apply correct css property for explicit alignment as right',
          function() {
            _explicitParagraphProperties.jus = 'R';

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('right');
          });

      it('should apply correct css property for cascaded alignment as right ' +
          'and place holder type is defined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'R';
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('right');
          });

      it('should apply correct css property for cascaded alignment as right ' +
          'and place holder type is undefined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'R';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('right');
          });

      it('should apply correct css property for explicit alignment as justify',
          function() {
            _explicitParagraphProperties.jus = 'J';

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('justify');
          });

      it('should apply correct css property for cascaded alignment as ' +
          'justify and place holder type is defined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'J';
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-align']).toBe('justify');
          });

      it('should apply correct css property for cascaded alignment as ' +
          'justify and place holder type is undefined', function() {
            _explicitParagraphProperties.jus = undefined;
            _cascadedParagraphProperties.jus = 'J';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();
            expect(expectedDiv.style['text-align']).toBe('justify');
          });
    });

    describe('handleParagraphSpacing', function() {
      it('should apply correct padding-bottom to paragraph, if it is not ' +
          'last paragraph', function() {
            var paraDivStyle = {};
            var spacingAfter = '10pt';
            spyOn(TextSpacingHandler, 'getSpacingAfter').andReturn(
                spacingAfter);
            _paragraphDecorator.handleParagraphSpacing(paraDivStyle);

            expect(paraDivStyle['padding-bottom']).toEqual(spacingAfter);
          });


      it('should apply correct padding-top to paragraph, if it is not ' +
          'first paragraph', function() {
            var paraDivStyle = {};
            var spacingBefore = '10pt';
            spyOn(TextSpacingHandler, 'getSpacingBefore').andReturn(
                spacingBefore);
            _paragraphDecorator.handleParagraphSpacing(paraDivStyle);

            expect(paraDivStyle['padding-top']).toEqual(spacingBefore);
          });
    });

    describe('Tests for handleMarginsIndent', function() {
      PointModel.shapeDimensions =
          {
            'ext': {
              'cx': 914400,
              'cy': 457200
            },
            'off': {
              'x': '2133601',
              'y': '838200'
            }
          };

      it('should apply correct css for explicit margin left property',
          function() {
            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-left']).toEqual('72pt');
          });

      it('should apply correct css for cascaded margin left property and ' +
          'place holder type is defined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-left']).toEqual('144pt');
          });

      it('should apply correct css for cascaded margin left property and ' +
          'place holder type is undefined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-left']).toEqual('144pt');
          });

      it('should apply correct css for explicit margin right property',
          function() {
            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-right']).toEqual('0pt');
          });

      it('should apply correct css for cascaded margin right property and ' +
          'place holder type is defined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-right']).toEqual('0pt');
          });

      it('should apply correct css for cascaded margin right property and ' +
          'place holder type is undefined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['margin-right']).toEqual('0pt');
          });

      it('should apply correct css for explicit indent property', function() {
        _explicitParagraphProperties.indent = '-914400';

        var expectedDiv = _localApi.withParagraphProperties(
            _paragraphObject).getDecoratedDiv();

        expect(expectedDiv.style['text-indent']).toEqual('-72pt');
      });

      it('should apply correct css for cascaded indent property and place ' +
          'holder type is defined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            _cascadedParagraphProperties.leftMargin = undefined;
            _explicitParagraphProperties.indent = '-914400';
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-indent']).toEqual('0pt');
          });

      it('should apply correct css for cascaded indent property and place ' +
          'holder type is undefined', function() {
            _explicitParagraphProperties.leftMargin = undefined;
            _cascadedParagraphProperties.leftMargin = undefined;
            _explicitParagraphProperties.indent = undefined;
            _cascadedParagraphProperties.indent = '914400';
            PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
            _paragraphObject.ppr = _cascadedParagraphProperties;

            var expectedDiv = _localApi.withParagraphProperties(
                _paragraphObject).getDecoratedDiv();

            expect(expectedDiv.style['text-indent']).toEqual('72pt');
          });

      describe('should apply correct CSS when wrap and anchorCenter is false ',
          function() {

            it('when text is right aligned', function() {
              PointModel.textBodyProperties.wrap = false;
              spyOn(CssManagerPresentation, 'getX').andReturn(914400);

              var expectedDiv = _localApi.withParagraphProperties(
                  _paragraphObject).getDecoratedDiv();

              expect(parseFloat(expectedDiv.style['margin-left'])).toBeCloseTo(
                  -168.0000787, 0);
              expect(expectedDiv.style['margin-left'].substr(-2)).toBe('pt');

              expect(expectedDiv.style['margin-right']).toEqual('0pt');
              expect(expectedDiv.style['text-align']).toEqual('right');
              expect(expectedDiv.style['text-indent']).toEqual('0pt');
            });

            it('when text is center aligned', function() {
              PointModel.textBodyProperties.wrap = false;
              _explicitParagraphProperties.jus = 'C';
              spyOn(CssManagerPresentation, 'getX').andReturn(914400);

              var expectedDiv = _localApi.withParagraphProperties(
                  _paragraphObject).getDecoratedDiv();

              expect(parseFloat(expectedDiv.style['margin-right'])).toBeCloseTo(
                  168.00007874015748, 0);
              expect(expectedDiv.style['margin-right'].substr(-2)).toBe('pt');

              expect(parseFloat(expectedDiv.style['margin-left'])).toBeCloseTo(
                  204.00007874015748, 0);
              expect(expectedDiv.style['margin-left'].substr(-2)).toBe('pt');

              expect(expectedDiv.style['text-align']).toEqual('center');
              expect(expectedDiv.style['text-indent']).toEqual('0pt');
            });

            it('when text is left aligned', function() {
              _explicitParagraphProperties.jus = 'L';
              PointModel.textBodyProperties.wrap = false;

              var expectedDiv = _localApi.withParagraphProperties(
                  _paragraphObject).getDecoratedDiv();

              expect(expectedDiv.style['margin-left']).toEqual('72pt');
              expect(expectedDiv.style['margin-right']).toEqual('0pt');
              expect(expectedDiv.style['text-align']).toEqual('left');
              expect(expectedDiv.style['text-indent']).toEqual('0pt');
            });
          });

      describe('should apply correct text-indent ', function() {
        it('when text-indent and margin-left is negative', function() {
          _explicitParagraphProperties.jus = 'L';
          _explicitParagraphProperties.indent = '-1828800';

          var expectedDiv = _localApi.withParagraphProperties(_paragraphObject).
              getDecoratedDiv();

          expect(expectedDiv.style['margin-left']).toEqual('72pt');
          expect(expectedDiv.style['margin-right']).toEqual('0pt');
          expect(expectedDiv.style['text-align']).toEqual('left');
          expect(expectedDiv.style['text-indent']).toEqual('-72pt');
        });

        it('when text-indent and margin-left is positive', function() {
          _explicitParagraphProperties.jus = 'L';
          _explicitParagraphProperties.indent = '914400';

          var expectedDiv = _localApi.withParagraphProperties(_paragraphObject).
              getDecoratedDiv();

          expect(expectedDiv.style['margin-left']).toEqual('72pt');
          expect(expectedDiv.style['margin-right']).toEqual('0pt');
          expect(expectedDiv.style['text-align']).toEqual('left');
          expect(expectedDiv.style['text-indent']).toEqual('72pt');
        });

        it('when text-indent is undefined', function() {
          _explicitParagraphProperties.jus = 'L';
          _explicitParagraphProperties.indent = undefined;
          _cascadedParagraphProperties.indent = undefined;

          var expectedDiv = _localApi.withParagraphProperties(_paragraphObject).
              getDecoratedDiv();

          expect(expectedDiv.style['margin-left']).toEqual('72pt');
          expect(expectedDiv.style['margin-right']).toEqual('0pt');
          expect(expectedDiv.style['text-align']).toEqual('left');
          expect(expectedDiv.style['text-indent']).toEqual('');
        });
      });
    });

    describe('Tests for handle bullet', function() {

      beforeEach(function() {
        _explicitParagraphProperties.bullet = {
          'type': 'buChar',
          'char': 'b'
        };
      });

      afterEach(function() {
        _explicitParagraphProperties.bullet = undefined;
      });

      it('should add qowt attributes correctly to paragraph', function() {
        var paragraphElement = _localApi.withParagraphProperties(
          _paragraphObject).getDecoratedDiv();

        var level = paragraphElement.getAttribute('qowt-level');

        expect(level).toEqual('0');
      });

      it('should not decorate paragraph with bullet properties when ' +
          'paragraph is empty', function() {
            _paragraphObject.elm = [];

            _localApi.withParagraphProperties(_paragraphObject).
                getDecoratedDiv();

            expect(_pointBulletDecorator.decorate).not.toHaveBeenCalled();
          });
    });

    describe('should test paragraph spacing', function() {
      describe('should test handling of paragraph spacing when given in points',
          function() {
            var _spacingHandler = TextSpacingHandler;
            var paragraphProperties = {};
            var _textParagraphElementStyle = {};

            afterEach(function() {
              paragraphProperties = {};
              _textParagraphElementStyle = {};
            });

            it('should create style with 3pt padding-top and 6pt ' +
                'padding-bottom, when spaceAfter is 600 and spaceBefore is 300',
                function() {
                  paragraphProperties.spcAft = {
                    'format': 'points',
                    'value': '600'
                  };
                  paragraphProperties.spcBef = {
                    'format': 'points',
                    'value': '300'
                  };
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('6pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('3pt');
                });

            it('should create style with 3pt padding-top, when spaceBefore ' +
                'is 300', function() {
                  paragraphProperties.spcAft = {
                    'format': 'points',
                    'value': '0'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'points',
                    'value': '300'
                  };

                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('3pt');
                });

            it('should create style with 3pt padding-bottom, when spaceAfter ' +
                'is 300', function() {
                  paragraphProperties.spcAft = {
                    'format': 'points',
                    'value': '300'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'points',
                    'value': '0'
                  };
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('3pt');
                  expect(_textParagraphElementStyle['padding-top']).toContain(
                      '0pt');
                });

            it('should create style with padding-bottom and padding-top with ' +
                '0 value, when spaceAfter and spaceBefore are undefined',
                function() {
                  paragraphProperties.spcAft = {
                    'format': 'points',
                    'value': '0'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'points',
                    'value': '0'
                  };

                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).toContain(
                      '0pt');
                });
          });

      describe('should test handling of paragraph spacing when given in ' +
          'percent and text-body is not wrapped', function() {
            var paragraphProperties = {};
            var _spacingHandler = TextSpacingHandler;
            var _textParagraphElementStyle = {};

            beforeEach(function() {
              PointModel.textBodyProperties.wrap = false;
            });
            afterEach(function() {
              paragraphProperties = {};
              _textParagraphElementStyle = {};
              PointModel.textBodyProperties.wrap = true;
            });

            //********************** value is backed by % sign ****************
            it('should create style with 9pt padding-top and 3pt ' +
                'padding-bottom, when spaceAfter is 100%, spaceBefore is ' +
                '300% and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '100%'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '300%'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('3pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('9pt');
                });

            it('should create style with 20pt padding-top and 8pt ' +
                'padding-bottom, when spaceAfter is 200%, spaceBefore is ' +
                '500% and maximum Paragraph font-size is 4', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '200%'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '500%'
                  };

                  PointModel.maxParaFontSize = 4;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('8pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('20pt');
                });

            it('should create style with 9pt padding-top, when spaceBefore ' +
                'is 300% and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '0%'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '300%'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('9pt');
                });

            it('should create style with 9pt padding-bottom, when spaceAfter ' +
                'is 300% and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '300%'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '0%'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('9pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('0pt');
                });

            it('should create style with padding-bottom and padding-top with ' +
                '0 value, when spaceAfter and spaceBefore are 0 and maximum ' +
                'Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '0%'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '0%'
                  };
                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('0pt');
                });

            //****************** value is not backed by % sign ***********
            it('should create style with 9pt padding-top and 3pt ' +
                'padding-bottom, when spaceAfter is 100000, spaceBefore ' +
                'is 300000 and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '100000'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '300000'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('3pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('9pt');
                });

            it('should create style with 20pt padding-top and 8pt ' +
                'padding-bottom, when spaceAfter is 200000, spaceBefore is ' +
                '500000 and maximum Paragraph font-size is 4', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '200000'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '500000'
                  };

                  PointModel.maxParaFontSize = 4;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('8pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('20pt');
                });

            it('should create style with 9pt padding-top, when spaceBefore ' +
                'is 300000 and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '0'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '300000'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('9pt');
                });

            it('should create style with 9pt padding-bottom, when spaceAfter ' +
                'is 300000 and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '300000'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '0'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('9pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('0pt');
                });

            it('should create style with padding-bottom and padding-top with ' +
                '0 value, when spaceAfter and spaceBefore are 0, not backed ' +
                'by % sign and maximum Paragraph font-size is 3', function() {
                  paragraphProperties.spcAft = {
                    'format': 'percentage',
                    'value': '0'
                  };

                  paragraphProperties.spcBef = {
                    'format': 'percentage',
                    'value': '0'
                  };

                  PointModel.maxParaFontSize = 3;
                  _spacingHandler.setProperties(paragraphProperties);
                  _paragraphDecorator.handleParagraphSpacing(
                      _textParagraphElementStyle);
                  expect(_textParagraphElementStyle['padding-bottom']).
                      toContain('0pt');
                  expect(_textParagraphElementStyle['padding-top']).
                      toContain('0pt');
                });
          });

      describe('Tests for end parargraph run properties', function() {
        it('should compute the correct min height for an empty paragraph when' +
            ' line spacing is in percent', function() {
              var paragraphObject = {
                eid: '455',
                etp: 'para',
                ppr: {
                  lnSpc: {
                    format: 'percentage',
                    value: '120%'
                  }
                },
                endParaRPr: {
                  eid: '456',
                  rpr: {
                    sz: '72'
                  }
                }
              };

              _textRunDiv = {
                style: {
                  'font-size': '6em',
                  'min-height': undefined
                }
              };
              var expectedDiv = _localApi.withParagraphProperties(
                  paragraphObject).getDecoratedDiv();

              // min-height should be set to (6 * 120/100 * 1.2) in em.
              // lineSpacing, if in percentage is adjusted by the Line Spacing
              // constant
              var minHeight = (6 * 1.2 * 1.2);
              expect(parseFloat(expectedDiv.style['min-height'])).toBeCloseTo(
                minHeight, 7);
              expect(expectedDiv.style['min-height'].substr(-2)).toBe('em');
            });

        it('should compute the correct min height for an empty paragraph when' +
            ' line spacing in points', function() {
              var paragraphObject = {
                eid: '455',
                etp: 'para',
                ppr: {
                  lnSpc: {
                    format: 'points',
                    value: '7200'
                  }
                },
                endParaRPr: {
                  eid: '456',
                  rpr: {
                    sz: '12'
                  }
                }
              };

              _textRunDiv = {
                style: {
                  'font-size': '1em',
                  'min-height': undefined
                }
              };

              var expectedDiv = _localApi.withParagraphProperties(
                  paragraphObject).getDecoratedDiv();

              // min-height should be set to (72pts) in em as line spacing
              // here overrides the the size of the empty paragraph.
              expect(parseFloat(expectedDiv.style['min-height'])).toBeCloseTo(
                72, 7);
              expect(expectedDiv.style['min-height'].substr(-2)).toBe('em');
            });

        it('should handle para level for end para run properties', function() {
          var paragraphObject = {
            endParaRPr: {
              eid: '456',
              rpr: {
                sz: '12'
              }
            }
          };
          var endParaRprRun = {
            'rpr': paragraphObject.endParaRPr
          };

          spyOn(_textDecoratorApi, 'withTextRunProperties').andCallThrough();

          _localApi.withParagraphProperties(paragraphObject);

          expect(_textDecoratorApi.withTextRunProperties).toHaveBeenCalledWith(
              endParaRprRun, 0);
        });
      });
    });
  });
});
