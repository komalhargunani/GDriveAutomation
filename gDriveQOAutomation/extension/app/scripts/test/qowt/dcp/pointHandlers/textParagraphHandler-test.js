define([
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/dcp/decorators/pointBulletDecorator',
  'qowtRoot/dcp/pointHandlers/textParagraphHandler',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/utils/cssManager'
], function(PointParagraphDecorator,
            PointBulletDecorator,
            TextParagraphHandler,
            PointModel,
            PlaceHolderTextStyleManager,
            ExplicitTextStyleManager,
            DefaultTextStyleManager,
            CSSManager) {

  'use strict';

  describe('Point: Text Paragraph Handler Test', function() {
    var v, shapeTextBody_, bulletDecorator_, decoratorLocalApi_,
        pointParagraphDecorator_;

    beforeEach(function() {
      shapeTextBody_ = {
        appendChild: function() {
        }
      };

      v = {
        node: shapeTextBody_,
        el: {
          etp: 'para',
          eid: '123',
          ppr: {}
        }
      };

      decoratorLocalApi_ = {
        withNewDiv: function() {
          return decoratorLocalApi_;
        },
        withParagraphProperties: function() {
          return decoratorLocalApi_;
        },
        getDecoratedDiv: function() {}
      };

      pointParagraphDecorator_ = {
        decorate: function() {
        },
        handleParagraphSpacing: function() {
        }
      };

      sinon.stub(PointParagraphDecorator, 'create').
          returns(pointParagraphDecorator_);
      sinon.stub(pointParagraphDecorator_, 'decorate').returns(
          decoratorLocalApi_);
      var qowtParagraph = new QowtPointPara();
      qowtParagraph.setEid(v.el.eid);
      sinon.stub(decoratorLocalApi_, 'getDecoratedDiv').returns(
          qowtParagraph);
      sinon.stub(ExplicitTextStyleManager, 'resolveParaPropertyFor');
      sinon.stub(PlaceHolderTextStyleManager, 'resolveParaPropertyFor');
      sinon.stub(DefaultTextStyleManager, 'resolveParaPropertyFor');
      sinon.stub(shapeTextBody_, 'appendChild');
      sinon.stub(CSSManager, 'addRule');
      bulletDecorator_ = {
        decorate: function() {}
      };

      sinon.stub(PointBulletDecorator, 'create').returns(bulletDecorator_);
      sinon.stub(bulletDecorator_, 'decorate');
      PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dummy';
    });

    afterEach(function() {
      shapeTextBody_.appendChild.restore();
      pointParagraphDecorator_.decorate.restore();
      bulletDecorator_.decorate.restore();
      decoratorLocalApi_.getDecoratedDiv.restore();
      PointParagraphDecorator.create.restore();
      ExplicitTextStyleManager.resolveParaPropertyFor.restore();
      PlaceHolderTextStyleManager.resolveParaPropertyFor.restore();
      DefaultTextStyleManager.resolveParaPropertyFor.restore();
      CSSManager.addRule.restore();
      PointBulletDecorator.create.restore();
      shapeTextBody_ = undefined;
      pointParagraphDecorator_ = undefined;
      bulletDecorator_ = undefined;
      decoratorLocalApi_ = undefined;
      TextParagraphHandler.reset();
      PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
    });

    it('should create PointBulletDecorator during visit', function() {
      TextParagraphHandler.visit(v);
      assert.isTrue(PointBulletDecorator.create.calledOnce,
          'PointBulletDecorator created');
    });

    it('should resolve explicit properties during visit', function() {
      TextParagraphHandler.visit(v);
      assert.isTrue(ExplicitTextStyleManager.resolveParaPropertyFor.calledOnce,
          'ExplicitTextStyleManager.resolveParaPropertyFor called');
    });

    it('should resolve default text properties during visit when it is not ' +
        'a placeholder', function() {
          PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
          TextParagraphHandler.visit(v);
          assert.isTrue(DefaultTextStyleManager.resolveParaPropertyFor.
              calledOnce,
              'DefaultTextStyleManager.resolveParaPropertyFor called');
        });

    it('should resolve placeholder text properties during visit when it is a ' +
        'placeholder', function() {
          TextParagraphHandler.visit(v);
          assert.isTrue(PlaceHolderTextStyleManager.resolveParaPropertyFor.
              calledOnce,
              'PlaceHolderTextStyleManager.resolveParaPropertyFor called');
        });

    it('should decorate bullet during visit', function() {
      TextParagraphHandler.visit(v);
      assert.isTrue(bulletDecorator_.decorate.calledOnce,
          'bulletDecorator.decorate called');
    });

    it('should add paraRules to CssManager', function() {
      TextParagraphHandler.visit(v);
      assert.isTrue(CSSManager.addRule.calledOnce, 'CssManager.addRule called');
    });
  });
});
