define([
  'qowtRoot/features/utils',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/controls/viewLayoutControl',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/ui/feedbackButton',
  'qowtRoot/widgets/ui/notificationArea'], function(
  Features,
  WorkbookControl,
  PresentationControl,
  ViewLayoutControl,
  MessageBus,
  PubSub,
  SelectionManager,
  DomListener,
  I18n,
  FeedbackButton,
  NotificationArea) {

  'use strict';

  var mockMainToolbar_ = {
    show: function() {},
    init: function() {}
  };

  describe('View Layout Control.', function() {

    var testConfig;

    beforeEach(function() {
      sinon.stub(I18n, 'getMessage').returns('');
      sinon.stub(FeedbackButton, 'create');
      sinon.spy(DomListener, 'addListener');
      sinon.stub(mockMainToolbar_, 'init');
      sinon.stub(mockMainToolbar_, 'show');
      sinon.stub(NotificationArea, 'create').returns({
        init: sinon.stub()
      });
      sinon.stub(WorkbookControl, 'init');
      sinon.stub(WorkbookControl, 'appendTo');
      sinon.stub(PresentationControl, 'init');
      sinon.stub(window, 'focus');
      sinon.stub(SelectionManager, 'getSelection').returns({
        contentType: 'unittest'
      });
      sinon.stub(PubSub, 'publish');
      sinon.stub(MessageBus, 'pushMessage');
      var aNode = document.createElement('div');
      sinon.stub(aNode, 'appendChild');
      testConfig = {
        appContext: 'UnitTest',
        anchorNode: aNode
      };
    });
    afterEach(function() {
      I18n.getMessage.restore();
      FeedbackButton.create.restore();
      DomListener.addListener.restore();
      mockMainToolbar_.init.restore();
      mockMainToolbar_.show.restore();
      NotificationArea.create.restore();
      WorkbookControl.init.restore();
      WorkbookControl.appendTo.restore();
      PresentationControl.init.restore();
      window.focus.restore();
      SelectionManager.getSelection.restore();
      PubSub.publish.restore();
      MessageBus.pushMessage.restore();
      testConfig.anchorNode.appendChild.restore();
      testConfig.anchorNode = undefined;
      testConfig = undefined;
    });

    describe('init()', function() {
      describe('edit:false, appContext:invalid', function() {
        it('Should throw for invalid appContext, ' +
           'Should append div to anchor node, ' +
           'Should create feedback button, ' +
           'Should setup DOM listeners', function() {
          sinon.stub(Features, 'isEnabled').returns(false);
          assert.throws(
            function() {
              ViewLayoutControl.init(testConfig);
            }, undefined, 'Error: missing application context',
            'throw for invalid appContext');
          assert.isTrue(
            testConfig.anchorNode.appendChild.calledOnce,
            'anchorNode appendChild called');
          var nodeArg = testConfig.anchorNode.appendChild.args[0][0];
          assert.strictEqual(
            nodeArg.nodeName, 'DIV', 'appendChild passed DIV');
          assert.strictEqual(
            nodeArg.id, 'view-layout', 'DIV has correct id');
          assert.isTrue(
            nodeArg.classList.contains('qowt-view-layout'),
            'DIV has correct class');
          assert.isTrue(
            I18n.getMessage.calledWith('action_create_user_feedback'),
            'get translation for feedback button');
          assert.isTrue(
            FeedbackButton.create.calledOnce, 'feedback button created');
          assert.isTrue(
            DomListener.addListener.calledTwice, 'dom listeners added');
          Features.isEnabled.restore();
        });
      });

      describe('edit:false, valid app context', function() {
        it('Should throw an error when edit is not present in the config.',
            function() {
          ['word', 'sheet', 'point'].forEach(function(app) {
            sinon.stub(Features, 'isEnabled').returns(false);
            testConfig.appContext = app;
            assert.throw(function() {
              ViewLayoutControl.init(testConfig);}, 'edit mode not in config ' +
                '- cannot setupToolbar');
            Features.isEnabled.restore();
          });
        });
      });

      describe('edit:true, appContext:word', function() {
        it('Should add the editor class name, ' +
           'Should configure the main toolbar, ' +
           'Should not init the notification area', function() {
          sinon.stub(Features, 'isEnabled').returns(true);
          testConfig.appContext = 'word';
          ViewLayoutControl.setMockToolbar(mockMainToolbar_);
          ViewLayoutControl.init(testConfig);
          var nodeArg = testConfig.anchorNode.appendChild.args[0][0];
          assert.isTrue(
            nodeArg.classList.contains('qowt-editor'),
            'DIV has editor class');
          assert.isTrue(
            mockMainToolbar_.init.calledOnce, 'main toolbar configured');
          assert.isFalse(
            NotificationArea.create.called, 'notification area not created');
          Features.isEnabled.restore();
        });
      });

      describe('edit:true, appContext:sheet', function() {
        it('Should configure the main toolbar', function() {
          sinon.stub(Features, 'isEnabled').returns(true);
          testConfig.appContext = 'sheet';
          ViewLayoutControl.setMockToolbar(mockMainToolbar_);
          ViewLayoutControl.init(testConfig);
          assert.isTrue(
            mockMainToolbar_.init.calledOnce, 'main toolbar configured');
          Features.isEnabled.restore();
        });
      });

      describe('edit:true, appContext:point', function() {
        it('Should add the point editor class name, ' +
           'Should configure the main toolbar', function() {
          sinon.stub(Features, 'isEnabled').returns(true);
          testConfig.appContext = 'point';
          ViewLayoutControl.setMockToolbar(mockMainToolbar_);
          ViewLayoutControl.init(testConfig);
          var nodeArg = testConfig.anchorNode.appendChild.args[0][0];
          assert.isTrue(
            nodeArg.classList.contains('qowt-editor'),
            'add the point editor class');
          assert.isTrue(
            mockMainToolbar_.init.calledOnce, 'main toolbar configured');
          Features.isEnabled.restore();
        });
      });

    });

    describe('showToolbar()', function() {
      it('Should throw for invalid appContext', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        assert.throws(
          function() {
            ViewLayoutControl.showToolbar('UnitTests');
          }, undefined, 'Error: missing application context',
          'throw for invalid appContext');
        Features.isEnabled.restore();
      });

      it('Should show toolbar, edit:true, appContext:word', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        ViewLayoutControl.showToolbar('word');
        assert.isTrue(
          mockMainToolbar_.show.calledOnce, 'show main toolbar');
        Features.isEnabled.restore();
      });
      it('Should show toolbar, edit:true, appContext:sheet', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        ViewLayoutControl.showToolbar('sheet');
        assert.isTrue(
          mockMainToolbar_.show.calledOnce, 'show main toolbar');
        Features.isEnabled.restore();
      });
      it('Should show toolbar, edit:true, appContext:point', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        ViewLayoutControl.showToolbar('point');
        assert.isTrue(
          mockMainToolbar_.show.calledOnce, 'show main toolbar');
        Features.isEnabled.restore();
      });
    });

    describe('keydown DOM listener', function() {
      it('Should publish qowt:shortcutKeys signal', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        testConfig.appContext = 'word';
        ViewLayoutControl.setMockToolbar(mockMainToolbar_);
        ViewLayoutControl.init(testConfig);
        document.dispatchEvent(new KeyboardEvent('keydown'));
        assert.isTrue(
          PubSub.publish.calledOnce, 'qowt:shortcutKeys signal published');
        Features.isEnabled.restore();
      });
    });

    describe('contextmenu DOM listener', function() {
      it('Should push recordEvent:menu message', function() {
        sinon.stub(Features, 'isEnabled').returns(true);
        testConfig.appContext = 'word';
        ViewLayoutControl.setMockToolbar(mockMainToolbar_);
        ViewLayoutControl.init(testConfig);
        document.dispatchEvent(new UIEvent('contextmenu'));
        assert.isTrue(
          MessageBus.pushMessage.calledOnce,
          'recordMessage:menu message pushed');
        Features.isEnabled.restore();
      });
    });

  });
});
