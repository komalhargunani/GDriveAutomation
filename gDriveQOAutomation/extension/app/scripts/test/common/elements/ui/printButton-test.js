require([
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/printButton/printButton'],
  function(PubSub /* print button */) {

  'use strict';

  describe('QowtPrintButton Polymer Element', function() {

    var printButton;

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      printButton = new QowtPrintButton();
    });
    afterEach(function() {
      PubSub.publish.restore();
      printButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(printButton instanceof QowtPrintButton,
          'print button is QowtPrintButton');
    });

    it('should create the aria label on the print button', function() {
      // For unit tests we do not get the localised version of the string
      // hence in tests aria-label do not contain shortcuts.
      assert.strictEqual(printButton.getAttribute('aria-label'),
          'print_aria_spoken_word shortcut',
          'aria-label is print_aria_spoken_word');
    });

    it('should have the value of \'print\' for action', function() {
      assert.strictEqual(printButton.action, 'print', 'action is print');
    });

    it('should have the value of \'cmd-print\' for id', function() {
      assert.strictEqual(printButton.id, 'cmd-print', 'id is cmd-print');
    });

    xit('should set selected to true and publish the correct message when ' +
      'clicked.', function() {
      printButton.onClick_();
      assert.isTrue(PubSub.publish.calledWith('qowt:requestAction', {
          action: 'print',
          context: {}
        }),
        'request action published');
    });
  });
});