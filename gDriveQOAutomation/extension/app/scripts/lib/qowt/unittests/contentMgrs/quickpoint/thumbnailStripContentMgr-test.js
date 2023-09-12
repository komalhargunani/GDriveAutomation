// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the thumbnail strip content manager.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */


define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/features/utils',
  'qowtRoot/presentation/strategies/slideSelection',
  'qowtRoot/commands/quickpoint/edit/hideUnhideSlide',
  'qowtRoot/commands/quickpoint/edit/insertSlide',
  'qowtRoot/commands/quickpoint/edit/deleteSlide',
  'qowtRoot/commands/quickpoint/edit/moveSlide',
  'qowtRoot/commands/quickpoint/edit/duplicateSlide',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/utils/dataStructures/stackFactory',
  'qowtRoot/commands/quickpoint/edit/clearUndoRedoStack',
  'qowtRoot/models/point'
], function(
    PubSub,
    ThumbnailStripContentMgr,
    ThumbnailStrip,
    Features,
    SelectionStrategies,
    HideUnhideCmd,
    InsertSlideCommand,
    DeleteSlideCommand,
    MoveSlideCommand,
    DuplicateSlideCommand,
    CommandManager,
    TransactionStartCmd,
    TransactionEndCmd,
    SelectionManager,
    StackFactory,
    ClearUndoRedoStackCommand,
    PointModel) {

  'use strict';

  describe('Thumbnail Strip Content Manager Test', function() {

    var _eventData;

    beforeEach(function() {
      ThumbnailStrip.init();
      ThumbnailStrip.createNumOfThumbs(2);

      _eventData = {
        'action': 'slideSelect',
        'context': {
          'contentType': 'slideManagement',
          'index': 1,
          'meta': false,
          'shift': false,
          'type': 'click'
        }
      };
    });

    afterEach(function() {
      _eventData.action = 'resetSlideSelection';
      PubSub.publish('qowt:doAction', _eventData);
    });

    it('should throw error if thumbnailStripContentMgr.init() ' +
        'called multiple times', function() {
          ThumbnailStripContentMgr.init();

          expect(ThumbnailStripContentMgr.init).toThrow(
              'thumbnailStripContentMgr.init() called multiple times.');
        });

    it('should subscribe events on init', function() {
      spyOn(PubSub, 'subscribe').andCallThrough();
      spyOn(SelectionStrategies, 'init');
      ThumbnailStripContentMgr.init();
      expect(SelectionStrategies.init).toHaveBeenCalled();
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:doAction');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual('qowt:disable');
    });

    it('should unSubscribe events on destroy', function() {
      ThumbnailStripContentMgr.init();
      spyOn(PubSub, 'unsubscribe').andCallThrough();
      PubSub.publish('qowt:disable', {});
      expect(PubSub.unsubscribe).toHaveBeenCalled();
    });

    it('should refresh slide menu when there is atleast 1 slide in ' +
        'presentation', function() {
          ThumbnailStripContentMgr.init();
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:doAction', _eventData);
          expect(PubSub.publish.calls[3].args[0]).toEqual(
              'qowt:presentationNonEmpty');
          expect(PubSub.publish.calls[4].args[0]).toEqual(
              'qowt:updateSlideMenu');
        });

    it('should refresh slide menu when there are no slides in presentation',
        function() {
          ThumbnailStrip.createNumOfThumbs(0);
          ThumbnailStripContentMgr.init();
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:doAction', _eventData);
          expect(PubSub.publish.calls[1].args[0]).toEqual(
              'qowt:presentationEmpty');
          expect(PubSub.publish.calls[2].args[0]).toEqual(
              'qowt:updateSlideMenu');
        });

    it('should get appropriate strategies on every selection', function() {
      ThumbnailStripContentMgr.init();
      var _dummyStrategy = {
        select: function() {}
      };
      spyOn(SelectionStrategies, 'getStrategy').andReturn(_dummyStrategy);
      spyOn(_dummyStrategy, 'select');
      PubSub.publish('qowt:doAction', _eventData);
      expect(SelectionStrategies.getStrategy).toHaveBeenCalled();
      expect(_dummyStrategy.select).toHaveBeenCalled();
    });

    it('should clear undo redo stack on every selection', function() {
      ThumbnailStripContentMgr.init();
      spyOn(ClearUndoRedoStackCommand, 'create').andReturn(
          {name: 'clearUndoRedoStack'});
      spyOn(CommandManager, 'addCommand');
      PubSub.publish('qowt:doAction', _eventData);

      var command = CommandManager.addCommand.calls[0].args[0];
      expect(command.name).toBe('clearUndoRedoStack');
    });

    describe('Test reset selection', function() {
      var fakeHighlightedThumbs_ = {
        m_arr: [],
        push: function(thumb) {
          this.m_arr[this.m_arr.length] = thumb;
        },
        clear: function() {
          this.m_arr = [];
        },
        pop: function() {}};

      beforeEach(function() {
        spyOn(StackFactory, 'create').andReturn(fakeHighlightedThumbs_);
        ThumbnailStripContentMgr.init();
      });

      it('should reset the selection array with the last slide selected in ' +
          'presentation when "resetSlideSelection" is fired.', function() {
            var thumb = {};
            spyOn(fakeHighlightedThumbs_, 'pop').andReturn(thumb);
            _eventData.action = 'resetSlideSelection';
            PubSub.publish('qowt:doAction', _eventData);
            expect(fakeHighlightedThumbs_.m_arr[0]).toBe(thumb);
            expect(fakeHighlightedThumbs_.m_arr.length).toBe(1);
          });

      it('should not reset the selection array with anything when last ' +
          'slide selected in the presentation is null and ' +
          '"resetSlideSelection" is fired.', function() {
            spyOn(fakeHighlightedThumbs_, 'pop').andReturn(null);
            _eventData.action = 'resetSlideSelection';
            PubSub.publish('qowt:doAction', _eventData);
            expect(fakeHighlightedThumbs_.m_arr.length).toBe(0);
          });
    });

    describe('Editor mode tests', function() {
      var txStartCommandMockedData = {
        name: 'txStart',
        addChild: function() {},
        getChildren: function() {}
      };

      var txEndCommandMockedData = {
        name: 'txEnd',
        addChild: function() {}
      };

      beforeEach(function() {
        Features.enable('edit');
        Features.enable('pointEdit');
        ThumbnailStripContentMgr.init();
        spyOn(SelectionManager, 'snapshot');

        spyOn(TransactionStartCmd, 'create').andReturn(
            txStartCommandMockedData);
        spyOn(TransactionEndCmd, 'create').andReturn(txEndCommandMockedData);
      });

      afterEach(function() {
        Features.disable('edit');
        Features.disable('pointEdit');
      });

      describe('hide/unhide slides in editor mode', function() {
        var slideHideCommandMockedData = {
          name: 'showSld',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.context.command.type;
            return type !== 'dcpCommand';
          }
        };

        beforeEach(function() {
          // Publish the selection doAction before hide/unhide
          PubSub.publish('qowt:doAction', _eventData);

          _eventData = {
            'action': 'hideSld',
            context: {
              'contentType': 'slideManagement',
              'command': {
                showSlide: false,
                'slideNumbers': ['1']
              }
            }
          };
          spyOn(txStartCommandMockedData, 'getChildren').andReturn([
            slideHideCommandMockedData, txEndCommandMockedData]);
        });

        it('should create and add hide slide command in a transaction for ' +
            'user action', function() {
              spyOn(HideUnhideCmd, 'create').andReturn(
                  slideHideCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('showSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should create and add unhide slide command in a transaction for ' +
            'user action', function() {
              _eventData.action = 'showSld';
              _eventData.context.command.showSlide = true;

              spyOn(ThumbnailStrip.thumbnail(1), 'isHidden').andReturn(true);
              spyOn(HideUnhideCmd, 'create').andReturn(
                  slideHideCommandMockedData);
              spyOn(CommandManager, 'addCommand');

              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('showSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should create and add hide slide command as is for undo initiated' +
            ' command', function() {
              _eventData.context.command.type = 'dcpCommand';

              spyOn(HideUnhideCmd, 'create').andReturn(
                  slideHideCommandMockedData);
              spyOn(CommandManager, 'addCommand');

              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('showSld');
            });

        it('should create and add unhide slide command as is for undo ' +
            'initiated command', function() {
              _eventData.action = 'showSld';
              _eventData.context.command.showSlide = true;
              _eventData.context.command.type = 'dcpCommand';

              spyOn(HideUnhideCmd, 'create').andReturn(
                  slideHideCommandMockedData);
              spyOn(CommandManager, 'addCommand');

              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('showSld');
            });
      });

      describe('Insert slides in editor mode', function() {
        var slideInsertCommandMockedData = {
          name: 'insertSld',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.context.command.type;
            return type !== 'dcpCommand';
          }
        };

        beforeEach(function() {
          _eventData = {
            action: 'insertSlide',
            context: {
              contentType: 'slideManagement'
            }
          };

          spyOn(txStartCommandMockedData, 'getChildren').andReturn([
            slideInsertCommandMockedData, txEndCommandMockedData]);
        });

        it('should create insertSlide with proper context for user action',
            function() {
              spyOn(InsertSlideCommand, 'create').andReturn(
                  slideInsertCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('insertSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should create insertSlide with proper context for undo initiated' +
            ' action', function() {
              _eventData.context.command = {
                sn: 1,
                type: 'dcpCommand'
              };

              spyOn(InsertSlideCommand, 'create').andReturn(
                  slideInsertCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('insertSld');
            });
      });

      describe('Delete slides in editor mode', function() {
        var slideDeleteCommandMockedData = {
          name: 'deleteSld',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.context.command.type;
            return type !== 'dcpCommand';
          }
        };

        beforeEach(function() {
          _eventData = {
            action: 'deleteSlide',
            context: {
              contentType: 'slideManagement'
            }
          };

          spyOn(txStartCommandMockedData, 'getChildren').andReturn([
            slideDeleteCommandMockedData, txEndCommandMockedData]);
        });

        it('should create deleteSlide with proper context for user action',
            function() {
              spyOn(DeleteSlideCommand, 'create').andReturn(
                  slideDeleteCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('deleteSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should create deleteSlide with proper context for undo initiated ' +
            'action', function() {
              _eventData.context.command = {
                slideNumbers: ['1'],
                type: 'dcpCommand'
              };

              spyOn(DeleteSlideCommand, 'create').andReturn(
                  slideDeleteCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('deleteSld');
            });
      });

      describe('Move slides in editor mode', function() {
        var slideMoveCommandMockedData = {
          name: 'moveSld',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.context.command.type;
            return type !== 'dcpCommand';
          }
        };

        beforeEach(function() {
          _eventData = {
            action: 'moveSlide',
            context: {
              contentType: 'slideManagement',
              position: 'down'
            }
          };

          spyOn(txStartCommandMockedData, 'getChildren').andReturn([
            slideMoveCommandMockedData, txEndCommandMockedData]);
        });

        it('should create moveSlide with proper context for user action when' +
            'position(direction of move) is specified',
            function() {
              _eventData.context.command = {};
                spyOn(MoveSlideCommand, 'create').andReturn(
                  slideMoveCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('moveSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should create moveSlide with proper context for user action when' +
            'moveSlideToPosition(actual slide index) is specified',
            function() {
              _eventData.context.position = undefined;
              _eventData.context.command = {
                moveSlideToPosition: 2
              };

              spyOn(MoveSlideCommand, 'create').andReturn(
                  slideMoveCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('moveSld');
              expect(subCommands[1].name).toBe('txEnd');
            });

        it('should not create moveSlide if user tries to move all the slides',
            function() {
              // Publish the selection doAction and both the slides in the
              // presentation
              _eventData = {
                'action': 'slideSelect',
                'context': {
                  'contentType': 'slideManagement',
                  'index': 0,
                  'meta': false,
                  'shift': false,
                  'type': 'click'
                }
              };
              PubSub.publish('qowt:doAction', _eventData);

              _eventData = {
                'action': 'slideSelect',
                'context': {
                  'contentType': 'slideManagement',
                  'index': 1,
                  'meta': true,
                  'shift': false,
                  'type': 'click'
                }
              };
              PubSub.publish('qowt:doAction', _eventData);

              spyOn(CommandManager, 'addCommand');

              //Publish moveSlide doAction
              _eventData = {
                action: 'moveSlide',
                context: {
                  contentType: 'slideManagement',
                  command: {
                    position: 'down'
                  }
                }
              };
              PubSub.publish('qowt:doAction', _eventData);

              expect(CommandManager.addCommand).not.toHaveBeenCalled();
            });

        it('should create moveSlide with proper context for undo initiated ' +
            'action', function() {
              _eventData.context.command = {
                slideNumbers: ['1'],
                moveSlideToPosition: 2,
                type: 'dcpCommand'
              };

              spyOn(MoveSlideCommand, 'create').andReturn(
                  slideMoveCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('moveSld');
            });
      });

      describe('Duplicate slides in editor mode', function() {
        var slideDuplicateCommandMockedData = {
          name: 'duplicateSld',
          addChild: function() {},
          callsService: function() {
            return true;
          }
        };

        beforeEach(function() {
          _eventData = {
            action: 'duplicateSlide',
            context: {
              contentType: 'slideManagement'
            }
          };

          spyOn(txStartCommandMockedData, 'getChildren').andReturn([
            slideDuplicateCommandMockedData, txEndCommandMockedData]);
        });

        it('should create duplicateSlide with proper context for user action',
            function() {
              spyOn(DuplicateSlideCommand, 'create').andReturn(
                  slideDuplicateCommandMockedData);
              spyOn(CommandManager, 'addCommand');
              PubSub.publish('qowt:doAction', _eventData);

              var command = CommandManager.addCommand.calls[0].args[0];
              expect(command.name).toBe('txStart');
              var subCommands = command.getChildren();
              expect(subCommands[0].name).toBe('duplicateSld');
              expect(subCommands[1].name).toBe('txEnd');
            });
      });

      describe('hide hidden slides in presentation mode', function() {

        var dummyStrategy;

        beforeEach(function() {
          _eventData = {
            'action': 'slideSelect',
            'context': {
              'contentType': 'slideManagement',
              'index': 2,
              'meta': false,
              'shift': false,
              'type': 'keydown',
              'keyIdentifier': 'Down'
            }
          };
          PointModel.slideShowMode = true;

          dummyStrategy = {
            select: function() {
            }
          };

          var fakeThumbnail = function(index) {
            return {
              isHidden: function() {
                var hiddenSlideIndices = [2, 4, 5, 6];
                if (hiddenSlideIndices.indexOf(index) !== -1) {
                  return true;
                } else {
                  return false;
                }
              }
            };
          };

          spyOn(SelectionStrategies, 'getStrategy').andReturn(dummyStrategy);
          spyOn(dummyStrategy, 'select');
          spyOn(ThumbnailStrip, 'thumbnail').andCallFake(fakeThumbnail);
        });

        it('should not show the hidden slide in presentation mode', function() {
          PubSub.publish('qowt:doAction', _eventData);
          expect(dummyStrategy.select).toHaveBeenCalledWith(3);
        });

        it('should show the next unhidden slide if there are multiple ' +
            'consecutive hidden slides in presentation mode', function() {
              _eventData.context.index = 4;
              PubSub.publish('qowt:doAction', _eventData);
              expect(dummyStrategy.select).toHaveBeenCalledWith(7);
            });

        it('should show the previous unhidden slide if there are multiple ' +
            'consecutive hidden slides in presentation mode if moved from ' +
            'bottom to top', function() {
              _eventData.context.index = 6;
              _eventData.context.keyIdentifier = 'Up';
              PubSub.publish('qowt:doAction', _eventData);
              expect(dummyStrategy.select).toHaveBeenCalledWith(3);
            });
      });
    });
  });
});
