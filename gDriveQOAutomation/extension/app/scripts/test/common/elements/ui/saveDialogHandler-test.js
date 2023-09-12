define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/savestate/saveDialogHandler',
  ], function(
    PubSub,
    SaveDialogHandler
  ) {

  'use strict';

  var callbacks = {};

  var baconBarMock_ = { show: function() {}, hide: function() {},
        isShown: function() {}};
  var butterBarMock_ = { show: function() {}, hide: function() {} };

  describe('saveDialogHandler', function() {
    describe('test behavior', function() {
      beforeEach(function() {
        sinon.stub(PubSub, 'subscribe', function(signal, callback) {
          callbacks[signal] = callback;
        });
        SaveDialogHandler.init(baconBarMock_, butterBarMock_);
      });


      afterEach(function() {
        PubSub.subscribe.restore();
      });

      it('should register for a multiple-Drive-failure signal.', function() {
        assert.isFunction(callbacks['qowt:multiDriveFailures'],
            'multiDriveFailures handler');
      });

      it('should register for a qowt:ss:editApplied signal.', function() {
        assert.isFunction(callbacks['qowt:ss:editApplied'],
            'editApplied handler');
      });

      it('should show baconBar without error on failure.', function() {
        assert.doesNotThrow(callbacks['qowt:multiDriveFailures'],
            'missing message or action text', 'baconBar show');
      });
    });

    describe('test bacon bar', function() {
      beforeEach(function() {
        SaveDialogHandler.init(baconBarMock_, butterBarMock_);
      });
      it('should show bacon bar upon encountering edit', function() {
        sinon.stub(baconBarMock_, 'show');
        sinon.stub(baconBarMock_, 'isShown').returns(false);
        PubSub.publish('qowt:ss:editApplied');
        assert.isTrue(baconBarMock_.show.called, 'bacon bar shown');
        baconBarMock_.show.restore();
        baconBarMock_.isShown.restore();
      });
    });
  });

  return {};
});
