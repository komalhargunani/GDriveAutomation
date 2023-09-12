/**
 * ShapeTextBody handler Test
 */

define([
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/dcp/decorators/pointTextBodyPropertiesDecorator',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/utils/fontManager',
  'qowtRoot/variants/configs/point',
  'qowtRoot/models/point',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/features/utils',
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/pointBulletDecorator'
], function(ShapeTextBodyHandler,
            PointTextBodyPropertiesDecorator,
            PointTextDecorator,
            FontManager,
            PointConfig,
            PointModel,
            IdGenerator,
            PlaceHolderManager,
            PlaceHolderTextStyleManager,
            ExplicitTextStyleManager,
            ParagraphDecorator,
            DefaultTextStyleManager,
            UnittestUtils,
            QowtMarkerUtils,
            Features,
            CssManager,
            PointBulletDecorator) {

  'use strict';

  xdescribe('Shape Text Body handler Test', function() {

    var v, _shapeDiv, _shapeTextBodyDiv;
    var _textRunDiv, _textDecoratorApi, _pointTextDecorator;

    var pointTextBodyPropertiesDecorator = {
      decorate: function() {
      },
      getContainingShapeBoxAlignProperty: function() {
      }
    };

    beforeEach(function() {
      _shapeDiv = {
        appendChild: function() {
        },
        style: { getPropertyValue: function() {
        } },
        getAttribute: function() {
        },
        classList: {
          add: function() {
          }
        },
        host: document.createElement('div'),
        _isShadyRoot: true
      };

      v =
          {
            node: _shapeDiv,
            el: {
              etp: 'txBody',
              eid: '123',
              bodyPr: {}
            }
          };

      _shapeTextBodyDiv = document.createElement('div');
      _shapeTextBodyDiv.setAttribute('id', v.el.eid);
      _shapeTextBodyDiv.style.width = 208;

      spyOn(PointTextBodyPropertiesDecorator, 'create').
          andReturn(pointTextBodyPropertiesDecorator);

      // Mock the point text decorator
      _textRunDiv =  UnittestUtils.createTestAppendArea();
      _textDecoratorApi = {
        getDecoratedDiv: function() {},
        withNewDiv: function() { return _textDecoratorApi; },
        withTextRunProperties: function() { return _textDecoratorApi; }
      };

      _pointTextDecorator = {
        decorate: function() { return _textDecoratorApi; }
      };

      spyOn(_textDecoratorApi, 'getDecoratedDiv').andReturn(_textRunDiv);
      spyOn(PointTextDecorator, 'create').andReturn(_pointTextDecorator);

      // Mock the font manager
      spyOn(FontManager, 'getFontName');
      spyOn(PlaceHolderTextStyleManager, 'resolveParaPropertyFor');
      spyOn(DefaultTextStyleManager, 'resolveParaPropertyFor');
    });

    afterEach(function() {
      UnittestUtils.flushTestAppendArea();
      _textDecoratorApi = undefined;
      _pointTextDecorator = undefined;
      _textRunDiv = undefined;
    });

    describe('pre-condition check', function() {
      var _pointParagraphDecorator, decoratorLocalApi;

      beforeEach(function() {
        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
            return {style: {}};
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };
        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        spyOn(PointBulletDecorator, 'create').andReturn(
            {decorate: function() {}});
      });

      it('should return undefined, when v is undefined', function() {
        v = undefined;

        var result = ShapeTextBodyHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el is undefined', function() {
        v.el = undefined;

        var result = ShapeTextBodyHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is undefined', function() {
        v.el.etp = undefined;

        var result = ShapeTextBodyHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is not -txBody-', function() {
        v.el.etp = 'random';

        var result = ShapeTextBodyHandler.visit(v);
        expect(result, undefined);
      });

      it('should assign eid if eid is undefined', function() {
        v.el.eid = undefined;

        spyOn(IdGenerator, 'getUniqueId').andReturn('420');
        spyOn(document, 'createElement').andReturn(_shapeTextBodyDiv);
        ShapeTextBodyHandler.visit(v);

        expect(_shapeTextBodyDiv.id).toEqual('txBody420');
      });

      it('should create shape text body div', function() {
        spyOn(IdGenerator, 'getUniqueId').andReturn('111');
        spyOn(document, 'createElement').andReturn(_shapeTextBodyDiv);

        var shapeTextBodyDiv = ShapeTextBodyHandler.createShapeTextBodyDiv();

        expect(shapeTextBodyDiv.id).toEqual('txBody111');
        expect(shapeTextBodyDiv.className).toContain('txBody111');
      });
    });

    describe('behaviour check', function() {
      var decoratorLocalApi, _pointParagraphDecorator;
      beforeEach(function() {
        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
            return {style: {}};
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };
        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        spyOn(PointBulletDecorator, 'create').andReturn(
            {decorate: function() {}});
      });

      it('should call the decorate method of ' +
          'pointTextBodyPropertiesDecorator with appropriate parameters',
          function() {
            spyOn(pointTextBodyPropertiesDecorator, 'decorate');

            var _shapeTextBodyDiv = ShapeTextBodyHandler.visit(v);

            expect(pointTextBodyPropertiesDecorator.decorate).
                toHaveBeenCalledWith(_shapeTextBodyDiv, {});
          });

      it('should call the getContainingShapeBoxAlignProperty method of ' +
          'pointTextBodyPropertiesDecorator with appropriate parameters',
          function() {
            spyOn(pointTextBodyPropertiesDecorator,
                'getContainingShapeBoxAlignProperty');

            ShapeTextBodyHandler.visit(v);

            expect(pointTextBodyPropertiesDecorator.
                getContainingShapeBoxAlignProperty).
                toHaveBeenCalledWith({}, _shapeDiv.style);
          });

      it('should cache explicit text styles when txStl is present', function() {
        v.el.txStl = {
          pPrArr: []
        };

        spyOn(ExplicitTextStyleManager, 'cacheExplicitTxtStyle');

        ShapeTextBodyHandler.visit(v);

        expect(ExplicitTextStyleManager.cacheExplicitTxtStyle).
            toHaveBeenCalledWith(v.el.txStl);
      });

      it('should reset explicit text styles cache when txStl is absent',
          function() {
            spyOn(ExplicitTextStyleManager, 'resetCache');

            ShapeTextBodyHandler.visit(v);

            expect(ExplicitTextStyleManager.resetCache).toHaveBeenCalled();
          });
    });

    describe('initialize text body properties tests', function() {
      var decoratorLocalApi, _pointParagraphDecorator;
      beforeEach(function() {
        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
            return {style: {}};
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };
        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        spyOn(PointBulletDecorator, 'create').andReturn(
            {decorate: function() {}});

        PointModel.CurrentPlaceHolderAtSlide.phTyp = true;
        spyOn(PlaceHolderManager, 'getClassPrefix');
        spyOn(QowtMarkerUtils, 'addQOWTMarker');
      });

      //wrap
      it('when wrap is undefined at all levels', function() {
        v.el.bodyPr = {'wrap': undefined};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(undefined);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.wrap).
            toEqual(PointConfig.kDEFAULT_IS_BODY_PROPERTY_WRAP);
      });

      it('when wrap is defined at explicit levels', function() {
        v.el.bodyPr = {'wrap': 'square'};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(undefined);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.wrap).toEqual(true);
      });

      it('when wrap is undefined at explicit levels but cascaded', function() {
        v.el.bodyPr = {'wrap': undefined};
        var cascadedBodyProperties = {'wrap': 'none'};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(cascadedBodyProperties);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.wrap).toEqual(false);
      });

      //anchor-center
      it('when anchor center is undefined at all levels', function() {
        v.el.bodyPr = {'anchorCtr': undefined};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(undefined);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.anchorCtr).
            toEqual(PointConfig.kDEFAULT_IS_BODY_PROPERTY_ANCHOR_CENTER);
      });

      it('when anchor center is defined at explicit levels', function() {
        v.el.bodyPr = {'anchorCtr': true};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(undefined);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.anchorCtr).toEqual(true);
      });

      it('when anchor center is undefined at explicit levels but cascaded',
          function() {
            v.el.bodyPr = {'anchorCtr': undefined};
            var cascadedBodyProperties = {'anchorCtr': true};

            spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
                andReturn(cascadedBodyProperties);

            ShapeTextBodyHandler.visit(v);

            expect(PointModel.textBodyProperties.anchorCtr).toEqual(true);
          });

      // line spacing reduction
      it('when line spacing reduction is undefined at all levels', function() {
        v.el.bodyPr = {'normAutofit': undefined};

        spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
            andReturn(undefined);

        ShapeTextBodyHandler.visit(v);

        expect(PointModel.textBodyProperties.lnSpcReduction).toEqual(undefined);
      });

      it('when line spacing reduction is defined at explicit levels',
          function() {
            v.el.bodyPr = {'normAutofit': {lnSpcReduction: '20'}};

            spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
                andReturn(undefined);

            ShapeTextBodyHandler.visit(v);

            expect(PointModel.textBodyProperties.lnSpcReduction).toEqual('20');
          });

      it('when line spacing reduction is undefined at explicit levels but ' +
          'cascaded', function() {
            v.el.bodyPr = {'normAutofit': undefined};
            var cascadedBodyProperties =
                {'normAutofit': {lnSpcReduction: '20'}};

            spyOn(PlaceHolderTextStyleManager, 'getResolvedBodyProperties').
                andReturn(cascadedBodyProperties);

            ShapeTextBodyHandler.visit(v);

            expect(PointModel.textBodyProperties.lnSpcReduction).toEqual('20');
          });
    });

    describe('Test for application of marker CSS', function() {

      var decoratorLocalApi, _pointParagraphDecorator;
      beforeEach(function() {
        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
            return {style: {}};
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };
        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        spyOn(PointBulletDecorator, 'create').andReturn(
            {decorate: function() {}});
      });

      it('should add correct QOWT markers to shape textBody div when phTyp ' +
          'is body', function() {
            PointModel.MasterSlideId = 111;
            PointModel.SlideLayoutId = 222;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = 'body';
            PointModel.CurrentPlaceHolderAtSlide.phIdx = 333;

            var expectedDiv = ShapeTextBodyHandler.visit(v);

            var expectedMarker = 'casKey<body_sldmt_111 body_333_sldlt_222>;';
            var acutalMarker = expectedDiv.getAttribute('qowt-marker');
            expect(expectedMarker).toEqual(acutalMarker);
          });

      it('should add correct QOWT markers to shape textBody div when phTyp ' +
          'is title', function() {
            PointModel.MasterSlideId = 111;
            PointModel.SlideLayoutId = 222;
            PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
            PointModel.CurrentPlaceHolderAtSlide.phIdx = 333;
            var expectedDiv = ShapeTextBodyHandler.visit(v);

            var expectedMarker = 'casKey<title_sldmt_111 title_sldlt_222>;';
            var acutalMarker = expectedDiv.getAttribute('qowt-marker');
            expect(expectedMarker).toEqual(acutalMarker);
          });

      it('should add correct css rule for shape textBody div', function() {
        spyOn(CssManager, 'addRule').andCallThrough();
        var expectedRules = [
          '.123 p[qowt-level="0"]',
          '.123 p[qowt-level="0"]:before',
          '.123 p[qowt-level="0"] span',

          '.123 p:not([qowt-level])',
          '.123 p:not([qowt-level]):before',
          '.123 p:not([qowt-level]) span',

          '.123 p[qowt-level="1"]',
          '.123 p[qowt-level="1"]:before',
          '.123 p[qowt-level="1"] span',

          '.123 p[qowt-level="2"]',
          '.123 p[qowt-level="2"]:before',
          '.123 p[qowt-level="2"] span',

          '.123 p[qowt-level="3"]',
          '.123 p[qowt-level="3"]:before',
          '.123 p[qowt-level="3"] span',

          '.123 p[qowt-level="4"]',
          '.123 p[qowt-level="4"]:before',
          '.123 p[qowt-level="4"] span',

          '.123 p[qowt-level="5"]',
          '.123 p[qowt-level="5"]:before',
          '.123 p[qowt-level="5"] span'
        ];

        ShapeTextBodyHandler.visit(v);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(expectedRules[0]);
        expect(CssManager.addRule.calls[1].args[0]).toEqual(expectedRules[1]);
        expect(CssManager.addRule.calls[2].args[0]).toEqual(expectedRules[2]);
        expect(CssManager.addRule.calls[3].args[0]).toEqual(expectedRules[3]);
        expect(CssManager.addRule.calls[4].args[0]).toEqual(expectedRules[4]);
        expect(CssManager.addRule.calls[5].args[0]).toEqual(expectedRules[5]);
        expect(CssManager.addRule.calls[6].args[0]).toEqual(expectedRules[6]);
      });

    });

    describe('handleParagraphSpacing', function() {

      var _pointParagraphDecorator, shapeTextBody, decoratorLocalApi;
      var someParaDiv;

      shapeTextBody = {
        appendChild: function() {
        }
      };

      beforeEach(function() {

        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };

        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        var testAppendArea = UnittestUtils.createTestAppendArea();

        someParaDiv = testAppendArea;

        spyOn(decoratorLocalApi, 'getDecoratedDiv').andReturn(someParaDiv);
        spyOn(ExplicitTextStyleManager, 'resolveParaPropertyFor');
        spyOn(PlaceHolderTextStyleManager, 'resolveParaPropertyFor').
            andReturn(undefined);
        spyOn(DefaultTextStyleManager, 'resolveParaPropertyFor').
            andReturn(undefined);
        spyOn(shapeTextBody, 'appendChild');
      });

      afterEach(function() {
        UnittestUtils.flushTestAppendArea();
      });
    });

    describe('Handle placeholder in postTraverse', function() {
      var shapeTextBodyDiv, placeholderTextBodyDiv, shapeDiv, span;
      var decoratorLocalApi, _pointParagraphDecorator;

      beforeEach(function() {
        decoratorLocalApi = {
          withNewDiv: function() {
          },
          withParagraphProperties: function() {
          },
          getDecoratedDiv: function() {
            return {style: {}};
          }
        };

        _pointParagraphDecorator = {
          decorate: function() {
          },
          handleParagraphSpacing: function() {
          }
        };
        spyOn(ParagraphDecorator, 'create').andReturn(_pointParagraphDecorator);
        spyOn(_pointParagraphDecorator, 'decorate').
            andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewDiv').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withParagraphProperties').
            andReturn(decoratorLocalApi);
        spyOn(PointBulletDecorator, 'create').andReturn(
            {decorate: function() {}});


        shapeDiv = window.document.createElement('div');
        v.node = shapeDiv;
        shapeTextBodyDiv = ShapeTextBodyHandler.visit(v);
        span = window.document.createElement('SPAN');
        shapeTextBodyDiv.appendChild(span);
        placeholderTextBodyDiv = UnittestUtils.createTestAppendArea();
        placeholderTextBodyDiv.classList.add('placeholder-text-body');
        placeholderTextBodyDiv.style.display = 'block';
        shapeDiv.appendChild(placeholderTextBodyDiv);
        PointModel.isPlaceholderShape = true;
        spyOn(Features, 'isEnabled').andReturn(true);




      });

      afterEach(function() {
        UnittestUtils.flushTestAppendArea();
        UnittestUtils.removeTestHTMLElement(span);
        shapeDiv = undefined;
        span = undefined;
      });

      it('should hide placeholder text body if it has explicit text',
          function() {
            span.textContent = "Some text";
            ShapeTextBodyHandler.postTraverse();
            expect(placeholderTextBodyDiv.style.display).toEqual('none');
          });

      it('should show placeholder text body if there is no explicit text',
          function() {
            ShapeTextBodyHandler.postTraverse();
            expect(placeholderTextBodyDiv.style.display).toEqual('block');
          });
    });
  });
});
