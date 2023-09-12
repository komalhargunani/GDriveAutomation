/**
 * @fileoverview Unit test for the qowt-platform-anchor element.
 */

require([
    'qowtRoot/utils/platform',
    'common/elements/ui/platformAnchor/platformAnchor'],
  function(Platform) {

  'use strict';

  xdescribe('QowtPlatformAnchor Polymer Element', function() {

    var element;
    beforeEach(function() {
      this.stampOutTempl('qowt-platform-anchor-test-template');
      element = this.getTestDiv().querySelector('#defaultTest');
    });
    afterEach(function() {
      element = undefined;
    });

    it('should be a QowtPlatformAnchor instance.', function() {
      assert.instanceOf(element, QowtPlatformAnchor,
          'be a QowtPlatformAnchor.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(element.isQowtElement, 'should be a QowtElement.');
    });

    it('should default to OTHER when there is no corresponding attribute to ' +
        'the current platform', function() {
      if (Platform.name !== 'OTHER') {
        assert.isNull(element.getAttribute(Platform.name));
      }
      assert.strictEqual(element.getAttribute('OTHER'),
          element.$.anchor.getAttribute('href'));
    });

    it('should set the href according to platform if provided', function() {
      element = this.getTestDiv().querySelector('#platformTest');
      // TODO(cuiffo): The code below runs the risk of being out of date if more
      // platforms are added to Platform. However, Platform.name isn't so simple
      // to mock right now because getters are not mockable in sinon. Revisit
      // this when that's possible or if Platform is adjusted.
      assert.isDefined(element.getAttribute(Platform.name));
      assert.strictEqual(element.getAttribute(Platform.name),
          element.$.anchor.getAttribute('href'));
    });
  });
});