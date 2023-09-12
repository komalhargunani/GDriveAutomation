define([
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'common/elements/presentation/shape/shape'
], function(
    PlaceHolderManager,
    PlaceHolderPropertiesManager
    // shape element
) {

  'use strict';

  describe('<qowt-point-shape>', function() {

    var element, testDiv;

    beforeEach(function() {
      element = new QowtPointShape();
      testDiv = this.getTestDiv();
    });

    afterEach(function() {
      if (element.renderOutline_.restore) {
        element.renderOutline_.restore();
      }
      element = undefined;
      testDiv = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should have a DCP definition', function() {
      assert.strictEqual(element.etp, 'sp', 'etp is sp');
    });

    it('should call render outline when DOM is ready', function(done) {
      sinon.stub(element, 'renderOutline_', function() {
        done();
      });
      testDiv.appendChild(element);
    });

    it('should call render outline when shape is resized', function(done) {
      sinon.stub(element, 'renderOutline_', function() {
        if (element.renderOutline_.calledTwice) {
          done();
        }
      });
      Polymer.dom(testDiv).appendChild(element);
      Polymer.dom(testDiv).flush();
      element.fire('shape-resized');
    });

    it('should return true if it is a ghost shape', function() {
      assert.isTrue(element.isGhostShape_(), 'is a ghost shape');
    });

    it('should return false if it is not a ghost shape', function() {
      var parentNode = document.createElement('div');
      parentNode.appendChild(element);
      assert.isFalse(element.isGhostShape_(), 'not a ghost shape');
    });

    it('should return proper layout ID and master ID', function() {
      var parentNode = document.createElement('div');
      parentNode.setAttribute('qowt-divtype', 'slide');
      parentNode.setAttribute('sldmt', 'E11');
      parentNode.setAttribute('sldlt', 'E12');
      parentNode.appendChild(element);
      assert.strictEqual(element.getMasterId_(), 'E11', 'master ID');
      assert.strictEqual(element.getLayoutId_(), 'E12', 'master ID');
    });

    it('should update the placeholder properties', function() {
      element.setAttribute('placeholder-type', 'subtitle');
      element.setAttribute('placeholder-index', '1');
      sinon.stub(PlaceHolderManager, 'updateCurrentPlaceHolderForShape');
      sinon.stub(element, 'isGhostShape_').returns(false);
      sinon.stub(element, 'getMasterId_').returns('E11');
      sinon.stub(element, 'getLayoutId_').returns('E12');
      element.updatePlaceholderProperties_();
      assert.isTrue(PlaceHolderManager.updateCurrentPlaceHolderForShape.
          calledWith('subtitle', '1', 'E11', 'E12'), 'update the placeholder ' +
          'properties');

      PlaceHolderManager.updateCurrentPlaceHolderForShape.restore();
      element.isGhostShape_.restore();
      element.getMasterId_.restore();
      element.getLayoutId_.restore();
    });

    it('should reset the placeholder properties', function() {
      sinon.stub(PlaceHolderManager, 'resetCurrentPlaceHolderForShape');
      sinon.stub(element, 'isPlaceholderShape_').returns(false);
      element.updatePlaceholderProperties_();
      assert.isTrue(PlaceHolderManager.resetCurrentPlaceHolderForShape.
          calledOnce, 'reset the placeholder properties');

      PlaceHolderManager.resetCurrentPlaceHolderForShape.restore();
      element.isPlaceholderShape_.restore();
    });

    it('should cascade the shape properties', function() {
      sinon.stub(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
          returns({
            dummySpPr: {}
          });
      var expectedProps = {
        geom: { prst: '88' },
        dummySpPr: {}
      };
      var props = element.cascadeProperties_();

      assert.deepEqual(props, expectedProps, 'cascaded properties');

      PlaceHolderPropertiesManager.getResolvedShapeProperties.restore();
    });

  });

  return {};
});
