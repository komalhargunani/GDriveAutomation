require([
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/zoomToFitButton/zoomToFitButton'],
  function(PubSub /* zoom to fit button */) {

  'use strict';

  describe('QowtZoomToFitButton Polymer Element', function() {

    var zoomToFitButton;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      zoomToFitButton = new QowtZoomToFitButton();
    });
    afterEach(function() {
      PubSub.publish.restore();
      zoomToFitButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(zoomToFitButton instanceof QowtZoomToFitButton,
          'zoom to fit button is QowtZoomToFitButton');
    });

    it('should create the aria label on the zoom to fit button', function() {
      assert.strictEqual(zoomToFitButton.getAttribute('aria-label'),
          'togglezoom_aria_spoken_word',
          'aria-label is togglezoom_aria_spoken_word');
    });

    it('should have value of \'toggleZoom\' for action', function() {
      assert.strictEqual(
          zoomToFitButton.action, 'toggleZoom', 'action is toggleZoom');
    });

    it('should have the value of \'cmd-toggleZoom\' for id', function() {
      assert.strictEqual(
          zoomToFitButton.id, 'cmd-toggleZoom', 'id is cmd-toggleZoom');
    });

    it('should toggle the button\'s active state and publish the correct ' +
      'message when clicked.', function() {
      var activeBefore = zoomToFitButton.isActive();
      zoomToFitButton._tapHandler();
      var activeAfter = zoomToFitButton.isActive();
      assert.isTrue(PubSub.publish.calledWith('qowt:doAction', {
          action: 'toggleZoom',
          context: {
            contentType: 'document',
            zoomFullPage: activeAfter
          }
        }),
        'request action published');
      assert.isFalse(activeBefore, 'button was initially inactive');
      assert.isTrue(activeAfter, 'button was activated');
    });

  });
});