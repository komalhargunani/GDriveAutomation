// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Text Run handler Test
 *
 * @author rasika.tandale@quickoffice.com (Rasika Tandale)
 */

define([
  'qowtRoot/dcp/pointHandlers/textRunHandler',
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/widgets/document/linebreak'
], function(TextRunHandler,
            PointModel,
            PointTextDecoator,
            LineBreak) {

  'use strict';


  describe('Text Run handler Test', function() {
    var v, _textParagraph;

    _textParagraph = {
      appendChild: function() {
      },
      getAttribute: function() {
        return 1;
      },
      _isShadyRoot: true,
      host: document.createElement('div')
    };

    var _decoratorLocalApi = {
      withNewDiv: function() {
      },
      withTextRunProperties: function() {
      },
      getDecoratedDiv: function() {
      }
    };

    var _pointTextDecorator = {
      decorate: function() {
      }
    };

    beforeEach(function() {
      v =
          {
            node: _textParagraph,
            el: {
              etp: 'txrun',
              eid: '123',
              rpr: {},
              lvl: 0,
              data: 'sample text'
            }
          };

      spyOn(PointTextDecoator, 'create').andReturn(_pointTextDecorator);
      spyOn(_pointTextDecorator, 'decorate').andReturn(_decoratorLocalApi);
      spyOn(_decoratorLocalApi, 'withNewDiv').andReturn(_decoratorLocalApi);
      spyOn(_decoratorLocalApi, 'withTextRunProperties').
          andReturn(_decoratorLocalApi);
      var qowtRun = new QowtPointRun();
      spyOn(_decoratorLocalApi, 'getDecoratedDiv').andReturn(qowtRun);
      spyOn(_textParagraph, 'appendChild');
    });

    describe('pre-condition check', function() {

      it('should return undefined, when v is undefined', function() {
        v = undefined;

        var result = TextRunHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el is undefined', function() {
        v.el = undefined;

        var result = TextRunHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is undefined', function() {
        v.el.etp = undefined;

        var result = TextRunHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is not -txrun-', function() {
        v.el.etp = 'random';

        var result = TextRunHandler.visit(v);
        expect(result, undefined);
      });

    });

    describe('behaviour check', function() {

      it('should call decorate method of pointTextDecorator ', function() {
        spyOn(Polymer.dom(_textParagraph), 'appendChild');
        TextRunHandler.visit(v);

        expect(_pointTextDecorator.decorate).toHaveBeenCalled();
        expect(_decoratorLocalApi.withNewDiv).toHaveBeenCalledWith('123');
        expect(_decoratorLocalApi.withTextRunProperties).
            toHaveBeenCalledWith(v.el, 1);
        expect(_decoratorLocalApi.getDecoratedDiv).toHaveBeenCalled();
        expect(Polymer.dom(_textParagraph).appendChild).toHaveBeenCalled();
      });

      it('should be adding line breaks when no text is defined', function() {
        var lineBreakDcp = {
          node: _textParagraph,
          el: {
            etp: 'txrun',
            eid: '123',
            rpr: {},
            lvl: 0
          }
        };

        var brtag = {};
        var lineBreakWidget = {
          getWidgetElement: function() { return brtag; }
        };
        spyOn(LineBreak, 'create').andReturn(lineBreakWidget);
        spyOn(Polymer.dom(_textParagraph), 'appendChild');
        TextRunHandler.visit(lineBreakDcp);
        expect(Polymer.dom(_textParagraph).appendChild)
            .toHaveBeenCalledWith(brtag);
      });

      it('should return undefined if isSlideView flag is false', function() {
        PointModel.isExplicitTextBody = false;

        var result = TextRunHandler.visit(v);

        expect(result, undefined);
      });

    });

  });
});
