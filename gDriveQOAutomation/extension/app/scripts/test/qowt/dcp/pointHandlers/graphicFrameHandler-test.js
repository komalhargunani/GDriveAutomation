define([
  'qowtRoot/dcp/pointHandlers/graphicFrameHandler',
  'qowtRoot/dcp/decorators/graphicFrameDecorator',
  'qowtRoot/dcp/pointHandlers/diagramHandler'
], function(GraphicFrameHandler,
            GraphicFrameDecorator,
            DiagramHandler) {

  'use strict';

  describe('GraphicFrameHandler', function() {
    var response_,
        dummyGraphicFrameDiv_ = {},
        dummyGraphicFrameDecorator_ = {
          decorate: function() {}
        },
        dummyGraphicFrameDecorate_ = {
          withNewDiv: function() {},
          withTransforms: function() {},
          withChart: function() {},
          forSmartArt: function() {}
        };

    beforeEach(function() {
      sinon.stub(GraphicFrameDecorator, 'create').returns(
          dummyGraphicFrameDecorator_);
      sinon.stub(dummyGraphicFrameDecorator_, 'decorate').returns(
          dummyGraphicFrameDecorate_);
      sinon.stub(dummyGraphicFrameDecorate_, 'withNewDiv').returns(
          dummyGraphicFrameDiv_);
      sinon.stub(dummyGraphicFrameDecorate_, 'forSmartArt');

      response_ = {
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

    afterEach(function() {
      dummyGraphicFrameDecorate_.withNewDiv.restore();
      dummyGraphicFrameDecorator_.decorate.restore();
      dummyGraphicFrameDecorate_.forSmartArt.restore();
      GraphicFrameDecorator.create.restore();
    });

    describe('visit API', function() {
      it('should call -forSmartArt- decorator function, when the ' +
          'graphic-frame contains smart art', function() {
            var originalList = response_.el.elm;

            response_.el.elm = [{
              etp: DiagramHandler.etp
            }];

            GraphicFrameHandler.visit(response_);

            assert.isTrue(dummyGraphicFrameDecorate_.forSmartArt.calledOnce);
            assert.deepEqual(dummyGraphicFrameDecorate_.forSmartArt.firstCall.
                args[0], dummyGraphicFrameDiv_);

            // restore
            response_.el.elm = originalList;
          });
    });
  });
});
