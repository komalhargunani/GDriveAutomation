/**
 * @fileoverview Test suite for the Auto Save Scheduler.
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/savestate/autoSaveScheduler',
    'qowtRoot/models/env',
    'qowtRoot/models/fileInfo'
    ],
    function(
      PubSub,
      AutoSaveScheduler,
      EnvModel,
      FileInfo) {

  'use strict';

  describe('The Auto Save Scheduler', function() {
    var app_, format_, clock;
    var CREATE_REVISION_EVENTDATA = {
      action: 'autoSave',
      context: {
        contentType: 'common',
        newRevision: true
      }
    };

    var NO_REVISION_EVENTDATA = {
      action: 'autoSave',
      context: {
        contentType: 'common',
        newRevision: false
      }
    };

    beforeEach(function() {
      app_ = EnvModel.app;
      format_ = EnvModel.format;

      sinon.spy(PubSub, 'publish');
      sinon.spy(PubSub, 'subscribe');
      sinon.spy(AutoSaveScheduler, 'enableAutoSave');

      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      EnvModel.app = app_;
      EnvModel.format = format_;

      PubSub.publish.restore();
      PubSub.subscribe.restore();
      AutoSaveScheduler.enableAutoSave.restore();
      clock.restore();
    });

    it("should, when initialised, throw if there is missing document info",
      function() {
        EnvModel.app = undefined;
        FileInfo.format = undefined;
        expect(AutoSaveScheduler.init).to.throw();

        EnvModel.app = 'sheet';
        FileInfo.format = undefined;
        expect(AutoSaveScheduler.init).to.throw();

        EnvModel.app = undefined;
        FileInfo.format = 'OOXML';
        expect(AutoSaveScheduler.init).to.throw();
    });

    it("should, when initialised, enable auto-saving if the opened " +
      "document is point 2007 format", function() {
        EnvModel.app = 'point';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();
        sinon.assert.callCount(PubSub.subscribe, 3);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:editApplied');
    });

    it("should, when initialised, enable auto-saving if the opened " +
      "document is sheet 2007 format", function() {
        EnvModel.app = 'sheet';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();
        sinon.assert.callCount(PubSub.subscribe, 3);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:editApplied');
    });

    it("should, when initialised, enable auto-saving if the opened " +
      "document is word 2007 format", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();
        sinon.assert.callCount(PubSub.subscribe, 3);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:editApplied');
    });

    it("should, when initialised, not enable auto-saving if the opened " +
      "document is Word 2003 format", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'CBF';
        AutoSaveScheduler.init();
        sinon.assert.callCount(PubSub.subscribe, 2);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:saved');
    });

    it("should, when initialised, not enable auto-saving if the opened " +
        "document is Presentation 2003 format", function() {
      EnvModel.app = 'point';
      FileInfo.format = 'CBF';
      AutoSaveScheduler.init();
      sinon.assert.notCalled(AutoSaveScheduler.enableAutoSave);
      sinon.assert.callCount(PubSub.subscribe, 2);
      sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:saved');
    });

    it("should, when initialised, not enable auto-saving if the opened " +
        "document is Sheet 2003 format", function() {
      EnvModel.app = 'sheet';
      FileInfo.format = 'CBF';
      AutoSaveScheduler.init();
      sinon.assert.notCalled(AutoSaveScheduler.enableAutoSave);
      sinon.assert.callCount(PubSub.subscribe, 2);
      sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:saved');
    });

    it("should enable auto-saving when the opened " +
      "Word 2003 document is upsaved to 2007 format", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'CBF';
        AutoSaveScheduler.init();
        sinon.assert.callCount(PubSub.subscribe, 2);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:saved');

        PubSub.subscribe.reset();
        FileInfo.format = 'OOXML';
        PubSub.publish('qowt:ss:saved');
        sinon.assert.callCount(PubSub.subscribe, 1);
        sinon.assert.calledWith(PubSub.subscribe, 'qowt:ss:editApplied');
    });

    it("should publish a single 'qowt:doAction' signal with action " +
      "'autoSave' if a pause occurs after a single edit", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();

        sinon.assert.callCount(PubSub.publish, 0);

        PubSub.publish('qowt:ss:editApplied');

        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', CREATE_REVISION_EVENTDATA);
    });

    it("should publish a single 'qowt:doAction' signal with action " +
      "'autoSave' if a pause occurs after a flurry of rapid edits", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();

        sinon.assert.callCount(PubSub.publish, 0);

        for(var i = 0; i < 5; i++) {
          PubSub.publish('qowt:ss:editApplied');
        }

        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', CREATE_REVISION_EVENTDATA);
    });

    it("should publish create only one revision per minute", function() {
        EnvModel.app = 'word';
        FileInfo.format = 'OOXML';
        AutoSaveScheduler.init();

        sinon.assert.callCount(PubSub.publish, 0);

        PubSub.publish('qowt:ss:editApplied');
        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', CREATE_REVISION_EVENTDATA);


        PubSub.publish('qowt:ss:editApplied');
        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', NO_REVISION_EVENTDATA);

        PubSub.publish('qowt:ss:editApplied');
        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', NO_REVISION_EVENTDATA);

        clock.tick(AutoSaveScheduler.REVISION_WAIT);

        PubSub.publish('qowt:ss:editApplied');
        PubSub.publish.reset();
        clock.tick(AutoSaveScheduler.DEBOUNCE_WAIT);
        sinon.assert.callCount(PubSub.publish, 1);
        sinon.assert.calledWithMatch(PubSub.publish,
            'qowt:doAction', CREATE_REVISION_EVENTDATA);
    });
  });
});
