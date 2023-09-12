/**
 * @fileoverview
 * Unit test to cover the Common Content Manager.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/commandSequenceEnd',
  'qowtRoot/commands/common/commandSequenceStart',
  'qowtRoot/commands/common/convertToDocs',
  'qowtRoot/commands/common/downloadFile',
  'qowtRoot/commands/common/makeACopy',
  'qowtRoot/commands/common/redo',
  'qowtRoot/commands/common/saveFile',
  'qowtRoot/commands/common/undo',
  'qowtRoot/commands/common/writeToExistingDriveFile',
  'qowtRoot/commands/common/writeToUserFile',
  'qowtRoot/commands/contentCheckers/docChecker',
  'qowtRoot/configs/common',
  'qowtRoot/contentMgrs/commonContentMgr',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/env',
  'qowtRoot/models/fileInfo',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/userFeedback'], function(
  CommandManager,
  CommandSeqEndCmd,
  CommandSeqStartCmd,
  ConvertToDocsCmd,
  DownloadFileCmd,
  MakeACopyCmd,
  RedoCmd,
  SaveFileCmd,
  UndoCmd,
  WriteToExistingDriveFileCmd,
  WriteToUserFileCmd,
  DocumentChecker,
  CommonConfig,
  CommonContentMgr,
  MessageBus,
  EnvModel,
  FileInfo,
  PubSub,
  UserFeedback) {

  'use strict';

  describe('Common Content Manager.', function() {
    var mockEventData;
    beforeEach(function() {
      mockEventData = {
        action: '',
        context: {
          contentType: 'common'
        }
      };
      sinon.stub(CommandManager, 'addCommand');
      sinon.stub(MessageBus, 'pushMessage');
    });
    afterEach(function() {
      mockEventData = undefined;
      CommandManager.addCommand.restore();
      MessageBus.pushMessage.restore();
    });

    describe('handleCommonAction()', function() {

      it('Should provide handleCommonAction', function() {
        assert.isFunction(
          CommonContentMgr.handleCommonAction,
          'CommonContentMgr.handleCommonAction()');
      });

      it('Should handle invalid input gracefully', function() {
        assert.isUndefined(
          CommonContentMgr.handleCommonAction(),
          'Call handleCommonAction with no parameters');
        assert.isUndefined(
          CommonContentMgr.handleCommonAction({}, {}),
          'Call handleCommonAction with empty objects');
        sinon.spy(console, 'warn');
        mockEventData.action = 'unitTest';
        assert.isUndefined(
          CommonContentMgr.handleCommonAction({}, mockEventData),
          'Call handleCommonAction with invalid action');
        assert.isTrue(
          console.warn.calledWith(
            'Common content manager did not handle action unitTest'),
          'Warn message about invalid action');
        console.warn.restore();
      });

      describe('Save actions', function() {
        var addChildStub;
        beforeEach(function() {
          addChildStub = sinon.stub();
          sinon.stub(WriteToUserFileCmd, 'create', function(name) {
            return {
              name: name
            };
          });
          sinon.stub(SaveFileCmd, 'create', function() {
            return {
              name: 'saveFile',
              addChild: addChildStub
            };
          });
        });
        afterEach(function() {
          WriteToUserFileCmd.create.restore();
          SaveFileCmd.create.restore();
          addChildStub = undefined;
        });

        describe('saveAs', function() {
          it('Should handle saveAs action', function() {
            mockEventData.action = 'saveAs';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              SaveFileCmd.create.calledOnce,
              'SaveFile command created');
            assert.isTrue(
              addChildStub.calledWith({name: 'writeToNew'}),
              'WriteToUserFile child command added');
            assert.isTrue(
              CommandManager.addCommand.calledOnce,
              'SaveFile added to command manager');
          });
        });

        describe('autoSave', function() {
          it('Should handle autoSave action for local', function() {
            FileInfo.userFileType = 'local';
            mockEventData.action = 'autoSave';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              SaveFileCmd.create.calledOnce,
              'SaveFile command created');
            assert.isTrue(
              addChildStub.calledWith({name: 'writeToExisting'}),
              'WriteToUserFile child command added');
            assert.isTrue(
              CommandManager.addCommand.calledOnce,
              'SaveFile added to command manager');
            FileInfo.userFileType = undefined;
            delete FileInfo.userFileType;
          });
          it('Should handle autoSave action for drive', function() {
            FileInfo.userFileType = 'drive';
            sinon.stub(WriteToExistingDriveFileCmd, 'create', function() {
              return {
                name: 'writeToExistingDriveFile'
              };
            });
            mockEventData.action = 'autoSave';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              SaveFileCmd.create.calledOnce,
              'SaveFile command created');
            assert.isTrue(
              addChildStub.calledWith({name: 'writeToExistingDriveFile'}),
              'WriteToExistingDriveFile child command added');
            assert.isTrue(
              CommandManager.addCommand.calledOnce,
              'SaveFile added to command manager');
            FileInfo.userFileType = undefined;
            delete FileInfo.userFileType;
            WriteToExistingDriveFileCmd.create.restore();
          });
        });
      });

      describe('downloadFile', function() {
        it('Should handle download action', function() {
          sinon.stub(DownloadFileCmd, 'create', function() {
            return {
              name: 'download'
            };
          });
          mockEventData.action = 'download';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(DownloadFileCmd.create.calledOnce,
              'downloadFile command created');
          assert.isTrue(CommandManager.addCommand.calledWith(
              {name: 'download'}), 'downloadFile added to command manager');
          DownloadFileCmd.create.restore();
        });
      });

      describe('makeCopy', function() {
        it('Should handle makeCopy action', function() {
          sinon.stub(MakeACopyCmd, 'create', function() {
            return {
              name: 'makeCopy'
            };
          });
          mockEventData.action = 'makeCopy';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            MakeACopyCmd.create.calledOnce,
            'MakeACopy command created');
          assert.isTrue(
            CommandManager.addCommand.calledWith({name: 'makeCopy'}),
            'MakeACopy added to command manager');
          MakeACopyCmd.create.restore();
        });
      });

      describe('convertToDocs', function() {
        it('Should handle convertToDocs action', function() {
          sinon.stub(ConvertToDocsCmd, 'create', function() {
            return {
              name: 'convertToDocs'
            };
          });
          mockEventData.action = 'convertToDocs';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            ConvertToDocsCmd.create.calledOnce,
            'ConvertToDocs command created');
          assert.isTrue(
            CommandManager.addCommand.calledWith({name: 'convertToDocs'}),
            'ConvertToDocs added to command manager');
          ConvertToDocsCmd.create.restore();
        });
      });

      describe('share', function() {
        var shownCount, stub, stubData;
        beforeEach(function() {
          shownCount = 0;
          mockEventData.action = 'share';
          stubData = function() {
            return {
              show: function() {
                shownCount++;
              }
            };
          };
          stub = sinon.stub(window, 'QowtPromoDialog', stubData);
        });
        afterEach(function() {
          QowtPromoDialog.restore();
          shownCount = undefined;
          stubData = undefined;
        });
        it('Should handle share action', function() {
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(stub.calledOnce);
          assert.strictEqual(shownCount, 1);
        });
      });

      describe('print', function() {
        it('Should handle print action', function() {
          sinon.stub(window, 'print');
          mockEventData.action = 'print';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            window.print.calledOnce,
            'window.print called');
          window.print.restore();
        });
      });

      describe('Undo/Redo', function() {
        afterEach(function() {
          EnvModel.app = undefined;
          delete EnvModel.app;
        });

        describe('Qowt based', function() {
          beforeEach(function() {
            EnvModel.app = 'sheet';
          });
          it('Should handle undo action', function() {
            sinon.stub(CommandManager, 'undoLastCommand');
            mockEventData.action = 'undo';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              CommandManager.undoLastCommand.calledOnce,
              'CommandManager.undoLastCommand called');
            CommandManager.undoLastCommand.restore();
          });
          it('Should handle redo action', function() {
            sinon.stub(CommandManager, 'redoLastCommand');
            mockEventData.action = 'redo';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              CommandManager.redoLastCommand.calledOnce,
              'CommandManager.redoLastCommand called');
            CommandManager.redoLastCommand.restore();
          });
        });

        describe('Core based', function() {
          beforeEach(function() {
            EnvModel.app = 'word';
          });
          it('Should handle undo action', function() {
            sinon.stub(UndoCmd, 'create', function() {
              return {
                name: 'undo'
              };
            });
            mockEventData.action = 'undo';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              UndoCmd.create.calledOnce,
              'Undo command created');
            assert.isTrue(
              CommandManager.addCommand.calledWith({name: 'undo'}),
              'Undo added to command manager');
            UndoCmd.create.restore();
          });
          it('Should handle redo action', function() {
            sinon.stub(RedoCmd, 'create', function() {
              return {
                name: 'redo'
              };
            });
            mockEventData.action = 'redo';
            CommonContentMgr.handleCommonAction({}, mockEventData);
            assert.isTrue(
              RedoCmd.create.calledOnce,
              'Redo command created');
            assert.isTrue(
              CommandManager.addCommand.calledWith({name: 'redo'}),
              'Redo added to command manager');
            RedoCmd.create.restore();
          });
        });
      });

      describe('reportIssue', function() {
        it('Should handle reportIssue action', function() {
          sinon.stub(UserFeedback, 'reportAnIssue');
          mockEventData.action = 'reportIssue';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            UserFeedback.reportAnIssue.calledOnce,
            'UserFeedback.reportAnIssue called');
          UserFeedback.reportAnIssue.restore();
        });
      });

      describe('helpCenter', function() {
        it('Should handle helpCenter action', function() {
          mockEventData.action = 'helpCenter';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            MessageBus.pushMessage.calledOnce,
            'Signal published by MessageBus');
        });
      });

      describe('commandSequenceStart', function() {
        it('Should handle commandSequenceStart action', function() {
          sinon.stub(CommandSeqStartCmd, 'create', function() {
            return {
              name: 'commandSeqStart'
            };
          });
          mockEventData.action = 'commandSequenceStart';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            CommandSeqStartCmd.create.calledOnce,
            'CommandSeqStart command created');
          assert.isTrue(
            CommandManager.addCommand.calledWith({name: 'commandSeqStart'}),
            'CommandSeqStart added to command manager');
          CommandSeqStartCmd.create.restore();
        });
      });

      describe('commandSequenceEnd', function() {
        it('Should handle commandSequenceEnd action', function() {
          sinon.stub(CommandSeqEndCmd, 'create', function() {
            return {
              name: 'commandSeqEnd'
            };
          });
          mockEventData.action = 'commandSequenceEnd';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            CommandSeqEndCmd.create.calledOnce,
            'CommandSeqEnd command created');
          assert.isTrue(
            CommandManager.addCommand.calledWith({name: 'commandSeqEnd'}),
            'CommandSeqEnd added to command manager');
          CommandSeqEndCmd.create.restore();
        });
      });

      describe('Screen Lock Signals', function() {
        beforeEach(function() {
          sinon.stub(PubSub, 'publish');
        });
        afterEach(function() {
          PubSub.publish.restore();
        });
        it('Should handle lockScreen action', function() {
          mockEventData.action = 'lockScreen';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            PubSub.publish.calledWith('qowt:lockScreen', {}),
            'lockScreen signal published');
        });
        it('Should handle unlockScreen action', function() {
          mockEventData.action = 'unlockScreen';
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(
            PubSub.publish.calledWith('qowt:unlockScreen', {}),
            'unlockScreen signal published');
        });
      });

      describe('officeCompatibilityMode', function() {

        var shownCount, stub, stubData;
        beforeEach(function() {
          shownCount = 0;
          mockEventData.action = 'officeCompatibilityMode';
          stubData = function() {
            return {
              show: function() {
                shownCount++;
              }
            };
          };
          stub = sinon.stub(window, 'QowtPromoDialog', stubData);
        });
        afterEach(function() {
          QowtPromoDialog.restore();
          shownCount = undefined;
          stubData = undefined;
        });

        it('Should handle officeCompatibilityMode action', function() {
          CommonContentMgr.handleCommonAction({}, mockEventData);
          assert.isTrue(stub.calledOnce);
          assert.strictEqual(shownCount, 1);
        });
      });

      describe('keyboardShortcutsDialog', function() {

        var shownCount, stub, stubData;
        beforeEach(function() {
          shownCount = 0;
          mockEventData.action = 'keyboardShortcutsDialog';
          stubData = function() {
            return {
              show: function() {
                shownCount++;
              }
            };
          };
        });

        afterEach(function() {
          shownCount = undefined;
          stubData = undefined;
        });

        it('Should handle keyboardShortcutsDialog action', function() {
          stub = sinon.stub(window, 'QowtKeyboardShortcutsDialog', stubData);
          CommonContentMgr.handleCommonAction({}, mockEventData);

          assert.isTrue(stub.calledOnce);
          assert.strictEqual(shownCount, 1);

          QowtKeyboardShortcutsDialog.restore();
        });

        it('Should do nothing when the dialog already exists', function() {
          var dialog = new QowtKeyboardShortcutsDialog();
          document.body.appendChild(dialog);

          stub = sinon.stub(window, 'QowtKeyboardShortcutsDialog', stubData);
          CommonContentMgr.handleCommonAction({}, mockEventData);

          assert.isFalse(stub.called);
          assert.strictEqual(shownCount, 0);

          window.QowtKeyboardShortcutsDialog.restore();
          dialog.destroy();
        });
      });

      describe('verifyDocStructure', function() {
        var originalDebounce_;
        beforeEach(function() {
          originalDebounce_ = CommonConfig.DOC_VERIFY_DEBOUNCE;
          CommonConfig.DOC_VERIFY_DEBOUNCE = 0;
        });
        afterEach(function() {
          CommonConfig.DOC_VERIFY_DEBOUNCE = originalDebounce_;
          originalDebounce_ = undefined;
        });
        it('Should handle verifyDocStructure action', function() {
          sinon.stub(DocumentChecker, 'setStatePending');
          sinon.stub(DocumentChecker, 'begin');
          mockEventData.action = 'verifyDocStructure';

          CommonContentMgr.handleCommonAction({}, mockEventData);

          assert.isTrue(DocumentChecker.setStatePending.called,
              'DocumentChecker set with pending state');
          assert.isTrue(DocumentChecker.begin.called,
              'DocumentChecker begin called');

          DocumentChecker.setStatePending.restore();
          DocumentChecker.begin.restore();
        });
      });

      describe('logGAEvent', function() {
        it('Should handle logGAEvent action', function() {
          mockEventData.action = 'logGAEvent';
          mockEventData.context.command = {
            category: 'shape',
            action: 'logGAEvent',
            label: 'shape',
            value: 1
          };

          CommonContentMgr.handleCommonAction({}, mockEventData);

          assert.isTrue(
              MessageBus.pushMessage.calledOnce,
              'Signal published by MessageBus');
        });
      });
    });
  });
});
