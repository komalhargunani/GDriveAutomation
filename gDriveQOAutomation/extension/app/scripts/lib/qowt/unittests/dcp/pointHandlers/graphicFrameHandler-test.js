define([
  'qowtRoot/dcp/decorators/graphicFrameDecorator',
  'qowtRoot/dcp/pointHandlers/graphicFrameHandler'
], function(GraphicFrameDecorator, GraphicFrameHandler) {

  'use strict';

  describe('graphicFrame Handler test', function() {

    var _response, _dummyDecorateGraphic, _dummyGraphicFrameDiv;

    var _dummyGraphicFrameDecorator = {
      decorate: function() {
      }
    };

    beforeEach(function() {
      spyOn(GraphicFrameDecorator, 'create').
          andReturn(_dummyGraphicFrameDecorator);

      _response = {
        el: {
          etp: 'grfrm',
          eid: '777',
          nvSpPr: {
            shapeId: '1'
          },
          elm: [],
          xfrm: 'some transform'
        },
        node: {
          appendChild: function() {
          }
        }
      };
    });

    describe('response verification test', function() {
      it('should not create graphic-frame div when response JSON is undefined',
          function() {
            _response = undefined;
            var graphicFrameDiv = GraphicFrameHandler.visit(_response);

            expect(graphicFrameDiv).toEqual(undefined);
          });

      it('should not create graphic-frame div when element in response JSON ' +
          'is undefined', function() {
            _response.el = undefined;
            var graphicFrameDiv = GraphicFrameHandler.visit(_response);

            expect(graphicFrameDiv).toEqual(undefined);
          });

      it('should not create graphic-frame div when element-type in response ' +
          'JSON is undefined', function() {
            _response.el.etp = undefined;
            var graphicFrameDiv = GraphicFrameHandler.visit(_response);

            expect(graphicFrameDiv).toEqual(undefined);
          });

      it('should not create graphic-frame div when element-id in response ' +
          'JSON is undefined', function() {
            _response.el.eid = undefined;
            var graphicFrameDiv = GraphicFrameHandler.visit(_response);

            expect(graphicFrameDiv).toEqual(undefined);
          });

      it('should not create graphic-frame div when element-type in response ' +
          'JSON is not -grfrm-', function() {
            _response.el.etp = 'xxx';
            var graphicFrameDiv = GraphicFrameHandler.visit(_response);

            expect(graphicFrameDiv).toEqual(undefined);
          });
    });

    describe('behavior test', function() {

      beforeEach(function() {

        _dummyDecorateGraphic = {
          withNewDiv: function() {
          },
          withTransforms: function() {
          },
          withChart: function() {
          }
        };

        _dummyGraphicFrameDiv = {};

        spyOn(_dummyGraphicFrameDecorator, 'decorate').
            andReturn(_dummyDecorateGraphic);

        spyOn(_dummyDecorateGraphic, 'withNewDiv').
            andReturn(_dummyGraphicFrameDiv);
        spyOn(_dummyDecorateGraphic, 'withTransforms');
        spyOn(_dummyDecorateGraphic, 'withChart');
      });

      it('should call -withNewDiv- decorator function', function() {
        GraphicFrameHandler.visit(_response);

        expect(_dummyDecorateGraphic.withNewDiv).
            toHaveBeenCalledWith('777', '1');
      });

      it('should call -withTransforms- decorator function', function() {
        GraphicFrameHandler.visit(_response);

        expect(_dummyDecorateGraphic.withTransforms).
            toHaveBeenCalledWith('some transform', undefined,
                _dummyGraphicFrameDiv);
      });

      it('should not call -withChart- decorator function, when the ' +
          'graphic-frame does not contain chart', function() {
            GraphicFrameHandler.visit(_response);

            expect(_dummyDecorateGraphic.withChart).not.toHaveBeenCalled();
          });

      it('should call -withChart- decorator function, when the graphic-frame ' +
          'contains chart', function() {
            _response.el.elm = [
              {
                etp: 'cht',
                chid: 278
              }
            ];
            GraphicFrameHandler.visit(_response);

            expect(_dummyDecorateGraphic.withChart).
                toHaveBeenCalledWith(_response.el.elm[0].chid,
                    _dummyGraphicFrameDiv);
          });

      it('should append graphic-frame div to the parent-node', function() {
        spyOn(_response.node, 'appendChild');
        GraphicFrameHandler.visit(_response);

        expect(_response.node.appendChild).
            toHaveBeenCalledWith(_dummyGraphicFrameDiv);
      });

      it('should cache JSON correctly', function() {
        GraphicFrameHandler.visit(_response);

        expect(_dummyGraphicFrameDiv.shapeJson).toEqual(_response.el);
      });
    });
  });
});
