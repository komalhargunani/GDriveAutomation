define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/tools/sheet/textHelpers/normalTextHelper'
], function(
    PubSub,
    SheetTextTool,
    NormalTextHelper) {

  'use strict';

  describe('The sheet text tool', function() {
    var sandbox,
        commitChangesSignal = 'qowt:sheet:commitChanges';


    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      sandbox.stub(NormalTextHelper, 'init');
    });


    afterEach(function() {
      sandbox.restore();
    });


    it('Should subscribe/un-subscribe to qowt:sheet:commitChanges signal on' +
        ' activation/deactivation respectively',
        function() {
          assert.strictEqual(
              PubSub.subscriberCountForSignal(commitChangesSignal),
              0,
              'qowt:sheet:commitChanges signal should not have subscribers');

          SheetTextTool.activate();

          assert.isTrue(SheetTextTool.isActive(),
              'Sheet text tool should be active');
          assert.strictEqual(
              PubSub.subscriberCountForSignal(commitChangesSignal),
              1,
              'qowt:sheet:commitChanges signal should be subscribed by sheet' +
              ' text tool');

          SheetTextTool.deactivate();

          assert.isFalse(SheetTextTool.isActive(),
              'Sheet text tool should not be active');
          assert.strictEqual(
              PubSub.subscriberCountForSignal(commitChangesSignal),
              0,
              'qowt:sheet:commitChanges signal should be un-subscribed by ' +
              'sheet text tool');
        });
  });
});
