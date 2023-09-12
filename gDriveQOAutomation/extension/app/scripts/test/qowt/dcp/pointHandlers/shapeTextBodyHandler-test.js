define([
  'qowtRoot/dcp/decorators/pointTextBodyPropertiesDecorator',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/dcp/decorators/pointBulletDecorator',
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/models/point',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/utils/fontManager',
  'qowtRoot/utils/qowtMarkerUtils'
], function(PointTextBodyPropertiesDecorator,
            PointTextDecorator,
            PointParagraphDecorator,
            PointBulletDecorator,
            ShapeTextBodyHandler,
            PointModel,
            ExplicitTextStyleManager,
            DefaultTextStyleManager,
            PlaceHolderManager,
            PlaceHolderTextStyleManager,
            CssManager,
            FontManager,
            QowtMarkerUtils) {

  'use strict';

  xdescribe('Point: shape text body handler', function() {

    var v, paraDecoratorApi_, paraDecorator_, bulletDecorator_;

    beforeEach(function() {
      var pointTextBodyPropertiesDecorator = {
        decorate: function() {
        },
        getContainingShapeBoxAlignProperty: function() {
        }
      };

      var _shapeDiv = {
        appendChild: function() {
        },
        style: { getPropertyValue: function() {
        } },
        getAttribute: function() {
        },
        classList: {
          add: function() {
          }
        }
      };

      v = {
        node: _shapeDiv,
        el: {
          etp: 'txBody',
          eid: '123',
          bodyPr: {}
        }
      };

      sinon.stub(PointTextBodyPropertiesDecorator, 'create').
          returns(pointTextBodyPropertiesDecorator);

      var _textDecoratorApi = {
        getDecoratedDiv: function() {
          return {style: {cssText: ''}};
        },
        withNewDiv: function() { return _textDecoratorApi; },
        withTextRunProperties: function() { return _textDecoratorApi; }
      };

      var _pointTextDecorator = {
        decorate: function() { return _textDecoratorApi; }
      };

      sinon.stub(PointTextDecorator, 'create').returns(_pointTextDecorator);

      // Mock the font manager
      sinon.stub(FontManager, 'getFontName');
      sinon.stub(CssManager, 'addRule');

      paraDecoratorApi_ = {
        getDecoratedDiv: function() {
          return {style: {cssText: ''}};
        },
        withNewDiv: function() { return paraDecoratorApi_; },
        withParagraphProperties: function() { return paraDecoratorApi_; }
      };

      paraDecorator_ = {
        decorate: function() { return paraDecoratorApi_; }
      };

      bulletDecorator_ = {
        decorate: function() {}
      };

      sinon.stub(PointParagraphDecorator, 'create').returns(
          paraDecorator_);
      sinon.stub(PointBulletDecorator, 'create').returns(bulletDecorator_);
      sinon.stub(PlaceHolderManager, 'getClassPrefix');
      sinon.stub(QowtMarkerUtils, 'addQOWTMarker');
      sinon.stub(PlaceHolderTextStyleManager, 'resolveParaPropertyFor');
      sinon.stub(DefaultTextStyleManager, 'resolveParaPropertyFor');
    });

    afterEach(function() {
      PointTextBodyPropertiesDecorator.create.restore();
      PointTextDecorator.create.restore();
      FontManager.getFontName.restore();
      CssManager.addRule.restore();
      PointParagraphDecorator.create.restore();
      PointBulletDecorator.create.restore();
      PlaceHolderManager.getClassPrefix.restore();
      QowtMarkerUtils.addQOWTMarker.restore();
      PlaceHolderTextStyleManager.resolveParaPropertyFor.restore();
      DefaultTextStyleManager.resolveParaPropertyFor.restore();
      paraDecoratorApi_ = undefined;
      paraDecorator_ = undefined;
      bulletDecorator_ = undefined;
    });

    it('should create pointParagraphDecorator and PointBulletDecorator ' +
        'during visit', function() {
          ShapeTextBodyHandler.visit(v);
          assert.isTrue(PointParagraphDecorator.create.calledOnce,
              'PointParagraphDecorator created');
          assert.isTrue(PointBulletDecorator.create.calledOnce,
              'PointBulletDecorator created');
        });

    it('should decorate para with new div and para properties', function() {
      sinon.spy(paraDecorator_, 'decorate');
      sinon.spy(paraDecoratorApi_, 'withNewDiv');
      sinon.spy(paraDecoratorApi_, 'withParagraphProperties');
      sinon.spy(paraDecoratorApi_, 'getDecoratedDiv');
      ShapeTextBodyHandler.visit(v);
      assert.isTrue(paraDecorator_.decorate.called,
          'paraDecorator.decorate called');
      assert.isTrue(paraDecoratorApi_.withNewDiv.called,
          'para decorated new div created');
      assert.isTrue(paraDecoratorApi_.withParagraphProperties.called,
          'para decorated with para properties');
      assert.isTrue(paraDecoratorApi_.getDecoratedDiv.called,
          'getDecoratedDiv called');
      paraDecorator_.decorate.restore();
      paraDecoratorApi_.withNewDiv.restore();
      paraDecoratorApi_.withParagraphProperties.restore();
      paraDecoratorApi_.getDecoratedDiv.restore();
    });

    it('should decorate bullet during visit', function() {
      sinon.spy(bulletDecorator_, 'decorate');
      ShapeTextBodyHandler.visit(v);
      assert.isTrue(bulletDecorator_.decorate.called,
          'bulletDecorator.decorate called');
      bulletDecorator_.decorate.restore();
    });

    it('should get family from FontManager', function() {
      sinon.stub(FontManager, 'family');
      ShapeTextBodyHandler.visit(v);
      assert.isTrue(FontManager.family.called, 'FontManager.family called');
      FontManager.family.restore();
    });

    it('should add paraRules to CssManager', function() {
      ShapeTextBodyHandler.visit(v);
      assert.isTrue(CssManager.addRule.called, 'CssManager.addRule called');
    });

    it('should resolve properties for bullet using ExplicitTextStyleManager',
        function() {
          var paraProp = {'level': 1};
          sinon.stub(ExplicitTextStyleManager, 'resolveParaPropertyFor');
          ShapeTextBodyHandler.visit(v);
          assert(ExplicitTextStyleManager.resolveParaPropertyFor.calledWith(
              paraProp), 'ExplicitTextStyleManager resolve property called');
          ExplicitTextStyleManager.resolveParaPropertyFor.restore();
        });

    it('should resolve properties for bullet in a placeholder', function() {
      var paraProp = {'level': 1};
      PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
      ShapeTextBodyHandler.visit(v);
      assert(PlaceHolderTextStyleManager.resolveParaPropertyFor.calledWith(
          paraProp.level), 'pHTextStyleManager resolve property called');
      PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
    });

    it('should resolve properties for bullet from DefaultTextStyleManager if ' +
        'it is not a placeholder', function() {
          var paraProp = {'level': 1};
          ShapeTextBodyHandler.visit(v);
          assert(DefaultTextStyleManager.resolveParaPropertyFor.calledWith(
              paraProp.level), 'DefaultTxtStylManager resolve property called');
        });
  });
});
