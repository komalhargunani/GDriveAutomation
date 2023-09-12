define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/messageBus/messageBus',
  'common/elements/ui/mergeMenuButton/mergeButton/mergeButton'
], function(
    PubSub,
    MessageBus
    /* merge button */) {

  'use strict';

  describe('Test QowtMergeButton Polymer Element', function() {

    var mergeButton_, sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(PubSub, 'publish');
      sandbox_.stub(MessageBus, 'pushMessage');
      mergeButton_ = new QowtMergeButton();
    });


    afterEach(function() {
      sandbox_.restore();
      mergeButton_ = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(mergeButton_ instanceof QowtMergeButton,
          'button should be instance of QowtMergeButton');
    });


    it('should create the aria label on the merge button', function() {
      assert.strictEqual(mergeButton_.getAttribute('aria-label'),
          'merge_aria_spoken_word');
    });


    it('should have the value of \'merge\' for action', function() {
      assert.strictEqual(mergeButton_.action, 'merge');
    });


    it('should have the value of \'merge\' for formatCode', function() {
      assert.strictEqual(mergeButton_.formatCode, 'merge');
    });


    it('should have the value of \'hasMerge\' for widgetFormat', function() {
      assert.strictEqual(mergeButton_.widgetFormat, 'hasMerge');
    });


    it('should have the value of \'cmd-merge\' for id', function() {
      assert.strictEqual(mergeButton_.id, 'cmd-merge');
    });


    it('should publish the correct signal when clicked', function() {
      var signalData = {
        id: 'recordEvent',
        category: 'button-bar',
        action: 'mergeAll'
      };

      assert.isFalse(mergeButton_.active);
      mergeButton_._tapHandler();

      assert.isTrue(PubSub.publish.calledWithMatch('qowt:requestAction'));
      assert.isTrue(MessageBus.pushMessage.calledWith(signalData));
    });
  });
});
