/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/pointHandlers/textParagraphHandler',
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/models/point'
], function(TextParagraphHandler,
            PointParagraphDecorator,
            PlaceHolderTextStyleManager,
            ExplicitTextStyleManager,
            DefaultTextStyleManager,
            PointModel) {

  'use strict';

  describe('Text Paragraph Handler Test', function() {
    var v;

    var _shapeTextBody = {
      appendChild: function() {
      },
      _isShadyRoot: true,
      host: document.createElement('div')
    };

    var _decoratorLocalApi = {
      withNewDiv: function() {
      },
      withParagraphProperties: function() {
      },
      getDecoratedDiv: function() {
      }
    };

    var _pointParagraphDecorator = {
      decorate: function() {
      },
      handleParagraphSpacing: function() {
      }
    };

    beforeEach(function() {
      PointModel.isExplicitTextBody = true;

      v =
          {
            node: _shapeTextBody,
            el: {
              etp: 'para',
              eid: '123',
              ppr: {}
            }
          };

      spyOn(PointParagraphDecorator, 'create').
          andReturn(_pointParagraphDecorator);
      spyOn(_pointParagraphDecorator, 'decorate').andReturn(_decoratorLocalApi);
      spyOn(_decoratorLocalApi, 'withNewDiv').andReturn(_decoratorLocalApi);
      spyOn(_decoratorLocalApi, 'withParagraphProperties').
          andReturn(_decoratorLocalApi);
      var qowtParagraph = new QowtPointPara();
      qowtParagraph.setEid(v.el.eid);
      spyOn(_decoratorLocalApi, 'getDecoratedDiv').andReturn(qowtParagraph);
      spyOn(ExplicitTextStyleManager, 'resolveParaPropertyFor');
      spyOn(PlaceHolderTextStyleManager, 'resolveParaPropertyFor').
          andReturn(undefined);
      spyOn(DefaultTextStyleManager, 'resolveParaPropertyFor').
          andReturn(undefined);
      spyOn(_shapeTextBody, 'appendChild');
    });

    describe('pre-condition check', function() {

      it('should return undefined, when v is undefined', function() {
        v = undefined;

        var result = TextParagraphHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el is undefined', function() {
        v.el = undefined;

        var result = TextParagraphHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is undefined', function() {
        v.el.etp = undefined;

        var result = TextParagraphHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is not -para-', function() {
        v.el.etp = 'random';

        var result = TextParagraphHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined if isSlideView flag is false', function() {
        PointModel.isExplicitTextBody = false;

        var result = TextParagraphHandler.visit(v);

        expect(result, undefined);
      });

    });

    describe('behaviour check', function() {

      it('should call decorate method of pointParagraphDecorator ', function() {

        TextParagraphHandler.visit(v);

        expect(_pointParagraphDecorator.decorate).toHaveBeenCalled();
        expect(_decoratorLocalApi.withNewDiv).toHaveBeenCalledWith('123');
        expect(_decoratorLocalApi.withParagraphProperties).
            toHaveBeenCalledWith(v.el);
        expect(_decoratorLocalApi.getDecoratedDiv).toHaveBeenCalled();
      });

      it('should call handleParagraphSpacing in postTraverse', function() {
        spyOn(Polymer.dom(_shapeTextBody), 'appendChild');
        spyOn(_pointParagraphDecorator, 'handleParagraphSpacing');

        var result = TextParagraphHandler.visit(v);
        TextParagraphHandler.postTraverse(v);

        expect(_pointParagraphDecorator.handleParagraphSpacing).
            toHaveBeenCalledWith(result.style);
        expect(Polymer.dom(_shapeTextBody).appendChild).toHaveBeenCalled();
      });

      it('should not call handleParagraphSpacing in postTraverse, if ' +
          'isExplicitTextBody is false', function() {
            PointModel.isExplicitTextBody = false;

            spyOn(_pointParagraphDecorator, 'handleParagraphSpacing');

            TextParagraphHandler.postTraverse(v);

            expect(_pointParagraphDecorator.handleParagraphSpacing).
                not.toHaveBeenCalled();
          });
    });
  });
});
