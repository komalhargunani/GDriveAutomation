define([
  'qowtRoot/dcp/pointHandlers/drawingShapeHandler',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeManager',
  'third_party/lo-dash/lo-dash.min'
], function(DrawingShapeHandler,
            ShapeHandler,
            ThemeStyleRefManager,
            ThemeManager) {

  'use strict';

  describe('DrawingShapeHandler', function() {
    var response_, parentNode_;

    beforeEach(function() {
      sinon.spy(ShapeHandler, 'visit');
      sinon.spy(ShapeHandler, 'postTraverse');
      sinon.stub(ThemeStyleRefManager, 'getFillRefClassName');
      sinon.stub(ThemeStyleRefManager, 'getOutlineRefStyleClassName');
      sinon.stub(ThemeManager, 'getFillStyle');

      parentNode_ = document.createElement('DIV');
      response_ = {
        el: {
          etp: 'dsp',
          eid: 'E123',
          elm: [{
            eid: 'E124',
            etp: 'txBody',
            elm: []
          }],
          nvSpPr: {},
          spPr: {
            xfrm: {
              off: {
                x: 916483,
                y: 1984
              },
              ext: {
                cx: 2030015,
                cy: 1218009
              }
            },
            ln: {
              algn: 'ctr',
              cap: 'flat',
              cmpd: 'sng',
              fill: {},
              prstDash: 'solid',
              w: 25400
            }
          },
          txXfrm: undefined
        },
        node: parentNode_
      };

    });

    afterEach(function() {
      ShapeHandler.visit.restore();
      ShapeHandler.postTraverse.restore();
      ThemeStyleRefManager.getFillRefClassName.restore();
      ThemeStyleRefManager.getOutlineRefStyleClassName.restore();
      ThemeManager.getFillStyle.restore();

      parentNode_ = undefined;
    });

    describe('visit API', function() {
      it('should create one shape for text when there is no txXfrm',
          function() {
            var shapeDiv = DrawingShapeHandler.visit(response_);

            assert.strictEqual(parentNode_.childNodes.length, 1);
            assert.strictEqual(parentNode_.firstChild, shapeDiv);

            assert.isDefined(shapeDiv);
            assert.strictEqual(shapeDiv.id, response_.el.eid);
            assert.strictEqual(shapeDiv.getAttribute('qowt-eid'), response_.el.
                eid);
            assert.strictEqual(shapeDiv.getAttribute('qowt-divtype'), 'shape');

            assert.isTrue(ShapeHandler.visit.calledOnce);
            assert.isDefined(ShapeHandler.visit.firstCall.args[0]);
            assert.strictEqual(ShapeHandler.visit.firstCall.args[0].el.etp,
                'sp');
            assert.notDeepEqual(ShapeHandler.visit.firstCall.args[0],
                response_);
            assert.deepEqual(ShapeHandler.visit.firstCall.args[0].el.spPr.ln,
                response_.el.spPr.ln);
          });

      it('should create two shapes when there is txXfrm', function() {
        response_.el.txXfrm = {
          off: {
            x: 91648,
            y: 198
          },
          ext: {
            cx: 203001,
            cy: 121800
          }
        };

        var shapeDiv = DrawingShapeHandler.visit(response_);

        assert.strictEqual(parentNode_.childNodes.length, 2);
        assert.strictEqual(parentNode_.childNodes[1], shapeDiv);

        assert.isDefined(shapeDiv);
        assert.strictEqual(shapeDiv.id, response_.el.eid);
        assert.strictEqual(shapeDiv.getAttribute('qowt-eid'), response_.el.
            eid);
        assert.strictEqual(shapeDiv.getAttribute('qowt-divtype'), 'shape');

        var outlineDiv = parentNode_.firstChild;
        assert.strictEqual(outlineDiv.id, response_.el.eid + '-outline');
        assert.strictEqual(outlineDiv.getAttribute('qowt-eid'), response_.el.
            eid + '-outline');
        assert.strictEqual(outlineDiv.getAttribute('qowt-divtype'), 'shape');

        assert.isTrue(ShapeHandler.visit.calledTwice);

        assert.isDefined(ShapeHandler.visit.firstCall.args[0]);
        assert.notDeepEqual(ShapeHandler.visit.firstCall.args[0], response_);
        assert.strictEqual(ShapeHandler.visit.firstCall.args[0].el.etp, 'sp');
        assert.isUndefined(ShapeHandler.visit.firstCall.args[0].el.spPr.xfrm.
            rot);
        assert.deepEqual(ShapeHandler.visit.firstCall.args[0].el.spPr.ln,
            response_.el.spPr.ln);

        assert.isDefined(ShapeHandler.visit.secondCall.args[0]);
        assert.notDeepEqual(ShapeHandler.visit.secondCall.args[0], response_);
        assert.strictEqual(ShapeHandler.visit.secondCall.args[0].el.etp, 'sp');
        assert.strictEqual(ShapeHandler.visit.secondCall.args[0].el.spPr.xfrm.
            rot, 0);
        assert.deepEqual(ShapeHandler.visit.secondCall.args[0].el.spPr.ln.fill,
            {type: 'noFill'});

        assert.isTrue(ShapeHandler.postTraverse.calledOnce);
        assert.isDefined(ShapeHandler.postTraverse.firstCall.args[0]);
        assert.deepEqual(ShapeHandler.postTraverse.firstCall.args[0],
            ShapeHandler.visit.firstCall.args[0]);

        response_.el.txXfrm = undefined;
      });

      it('should create two shapes and set rotation properly when there is ' +
          'txXfrm with rot', function() {
            response_.el.spPr.xfrm.rot = 18;
            response_.el.txXfrm = {
              off: {
                x: 91648,
                y: 198
              },
              ext: {
                cx: 203001,
                cy: 121800
              },
              rot: 60
            };

            var shapeDiv = DrawingShapeHandler.visit(response_);

            assert.strictEqual(parentNode_.childNodes.length, 2);
            assert.strictEqual(parentNode_.childNodes[1], shapeDiv);

            assert.isDefined(shapeDiv);
            assert.strictEqual(shapeDiv.id, response_.el.eid);
            assert.strictEqual(shapeDiv.getAttribute('qowt-eid'), response_.el.
                eid);
            assert.strictEqual(shapeDiv.getAttribute('qowt-divtype'), 'shape');

            var outlineDiv = parentNode_.firstChild;
            assert.strictEqual(outlineDiv.id, response_.el.eid + '-outline');
            assert.strictEqual(outlineDiv.getAttribute('qowt-eid'), response_.
                el.eid + '-outline');
            assert.strictEqual(outlineDiv.getAttribute('qowt-divtype'),
                'shape');

            assert.isTrue(ShapeHandler.visit.calledTwice);

            assert.isDefined(ShapeHandler.visit.firstCall.args[0]);
            assert.notDeepEqual(ShapeHandler.visit.firstCall.args[0],
                response_);
            assert.strictEqual(ShapeHandler.visit.firstCall.args[0].el.etp,
                'sp');
            assert.strictEqual(ShapeHandler.visit.firstCall.args[0].el.spPr.
                xfrm.rot, 18);
            assert.deepEqual(ShapeHandler.visit.firstCall.args[0].el.spPr.ln,
                response_.el.spPr.ln);

            assert.isDefined(ShapeHandler.visit.secondCall.args[0]);
            assert.notDeepEqual(ShapeHandler.visit.secondCall.args[0],
                response_);
            assert.strictEqual(ShapeHandler.visit.secondCall.args[0].el.etp,
                'sp');

            assert.strictEqual(ShapeHandler.visit.secondCall.args[0].el.spPr.
                xfrm.rot, 78);
            assert.deepEqual(ShapeHandler.visit.secondCall.args[0].el.spPr.ln.
                fill, {type: 'noFill'});

            assert.isTrue(ShapeHandler.postTraverse.calledOnce);
            assert.isDefined(ShapeHandler.postTraverse.firstCall.args[0]);
            assert.deepEqual(ShapeHandler.postTraverse.firstCall.args[0],
                ShapeHandler.visit.firstCall.args[0]);

            response_.el.spPr.xfrm.rot = undefined;
            response_.el.txXfrm = undefined;
          });
    });

    describe('postTraverse API', function() {
      it('should invoke shapeHandler\'s postTraverse', function() {
        var param = _.cloneDeep(response_);
        param.el.etp = 'sp';

        DrawingShapeHandler.visit(response_);

        DrawingShapeHandler.postTraverse();

        assert.isTrue(ShapeHandler.postTraverse.calledOnce);
        assert.deepEqual(ShapeHandler.postTraverse.firstCall.args[0], param);
      });
    });
  });
});
