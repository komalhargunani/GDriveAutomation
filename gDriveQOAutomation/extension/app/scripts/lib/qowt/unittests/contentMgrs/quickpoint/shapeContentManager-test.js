// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for Shape content manager.
 *
 * @author murtaza.haveliwala@synerzip.com (Murtaza Haveliwala)
 */

define([
  'qowtRoot/contentMgrs/shapeContentManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/commands/quickpoint/modifyShapeTransform',
  'qowtRoot/commands/drawing/modifyShapeFill',
  'qowtRoot/commands/drawing/deleteShape',
  'qowtRoot/commands/drawing/formatObject',
  'qowtRoot/widgets/point/slidesContainer'
], function(
    ShapeContentManager,
    PubSub,
    UnittestUtils,
    ShapeWidget,
    CommandManager,
    TransactionStartCmd,
    TransactionEndCmd,
    SelectionManager,
    ModifyShapeTransform,
    ModifyShapeFillCommand,
    DeleteShapeCommand,
    FormatObjectCommand,
    SlidesContainer) {

  'use strict';

  describe('Shape Content Manager Test', function() {

    var _shapeNode, _eventData, _shapeWidget;

    beforeEach(function() {
      spyOn(PubSub, 'subscribe').andCallThrough();
      ShapeContentManager.init();
      _shapeNode = UnittestUtils.createTestAppendArea();
      _eventData = {
        context: {
          'contentType': 'shape',
          'node': _shapeNode
        }
      };

      // Mock a shape widget
      _shapeWidget = {
        select: function() {
        },
        deselect: function() {
        },
        update: function() {
        },
        isSelected: function() {
        },
        getOffsets: function() {
        },
        getExtents: function() {
        }
      };

      spyOn(ShapeWidget, 'create').andReturn(_shapeWidget);
      spyOn(_shapeWidget, 'select');
      spyOn(_shapeWidget, 'deselect');
      spyOn(_shapeWidget, 'getOffsets');
      spyOn(_shapeWidget, 'getExtents');
      spyOn(_shapeWidget, 'isSelected').andReturn(true);
    });

    afterEach(function() {
      UnittestUtils.removeTestAppendArea();
      _shapeNode = undefined;
    });

    it('should throw error if shapeContentManager.init() called multiple times',
        function() {
          expect(ShapeContentManager.init).toThrow(
              'shapeContentManager.init() called multiple times.');
        });

    it('should subscribe events on init', function() {
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:disable');
      expect(PubSub.subscribe.calls[1].args[0]).toEqual('qowt:doAction');
    });

    it('should unSubscribe events on destroy', function() {
      spyOn(PubSub, 'unsubscribe').andCallThrough();
      PubSub.publish('qowt:disable', {});
      expect(PubSub.unsubscribe).toHaveBeenCalled();
    });

    it('should select shape', function() {
      _eventData.action = 'select';
      PubSub.publish('qowt:doAction', _eventData);

      expect(_shapeWidget.select).toHaveBeenCalled();
    });

    it('should deselect shape', function() {
      _eventData.action = 'select';
      PubSub.publish('qowt:doAction', _eventData);

      _eventData.action = 'deselect';
      PubSub.publish('qowt:doAction', _eventData);

      expect(_shapeWidget.deselect).toHaveBeenCalled();
    });

    it('should hide selection while entering into slide show mode', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _eventData.action = 'select';
      PubSub.publish('qowt:doAction', _eventData);
      PubSub.publish('qowt:slideShowStarted');
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:clearSlideSelection');
    });

    describe('Shape Move Tests', function() {
      var shapeMoveCommandMockedData;

      beforeEach(function() {
        _eventData.action = 'modifyTransform';
        _eventData.command = {
          name: 'modTrfm',
              eid: _shapeNode.id,
              xfrm: {
            off: {
              x: 9650,
                  y: 9650
            },
            ext: {
              cx: 9650,
                  cy: 9650
            }
          },
          sn: 1
        };

        shapeMoveCommandMockedData = {
          name: 'modTrfm',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.command.type;
            return type !== 'dcpCommand';
          }
        };

        spyOn(ModifyShapeTransform, 'create').andReturn(
            shapeMoveCommandMockedData);
        spyOn(CommandManager, 'addCommand');
      });


      it('should add move command with provided context', function() {
        var txStartCommandMockedData = {
          name: 'txStart',
          addChild: function() {},
          getChildren: function() {return [shapeMoveCommandMockedData,
            txEndCommandMockedData];}
        };

        var txEndCommandMockedData = {
          name: 'txEnd'
        };

        spyOn(TransactionStartCmd, 'create').andReturn(
            txStartCommandMockedData);
        spyOn(TransactionEndCmd, 'create').andReturn(txEndCommandMockedData);
        PubSub.publish('qowt:doAction', _eventData);

        var command = CommandManager.addCommand.calls[0].args[0];
        expect(command.name).toBe('txStart');
        var subCommands = command.getChildren();
        expect(subCommands[0].name).toBe('modTrfm');
        expect(subCommands[1].name).toBe('txEnd');
      });

      it('should add move command with provided context for undo initiated ' +
          'action', function() {

        _eventData.command.type = 'dcpCommand';

        PubSub.publish('qowt:doAction', _eventData);

        var command = CommandManager.addCommand.calls[0].args[0];
        expect(command.name).toBe('modTrfm');
      });
    });

    describe('Shape Delete Tests', function() {
      var shapeDeleteEventData;
      beforeEach(function() {
        _eventData.command = {};
        shapeDeleteEventData = {
          action: 'deleteShape',
          context: {
            contentType: 'shape',
            command: {
              eid: _shapeNode.id
            }
          }
        };

        var dummySlideWidget = {
          getSlideIndex: function() {
            return 1;
          }
        };

        spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
            dummySlideWidget);
        spyOn(CommandManager, 'addCommand');
      });

      it('should add deleteShape command with provided context', function() {
        var txStartCommandMockedData = {
          name: 'txStart',
          addChild: function() {},
          getChildren: function() {return [shapeDeleteCommandMockedData,
            txEndCommandMockedData];}
        };

        var shapeDeleteCommandMockedData = {
          name: 'deleteShape',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.command.type;
            return type !== 'dcpCommand';
          }
        };

        var txEndCommandMockedData = {
          name: 'txEnd'
        };

        spyOn(SelectionManager, 'snapshot');
        spyOn(TransactionStartCmd, 'create').andReturn(
            txStartCommandMockedData);
        spyOn(DeleteShapeCommand, 'create').andReturn(
            shapeDeleteCommandMockedData);
        spyOn(TransactionEndCmd, 'create').andReturn(txEndCommandMockedData);
        PubSub.publish('qowt:doAction', shapeDeleteEventData);

        var command = CommandManager.addCommand.calls[0].args[0];
        expect(command.name).toBe('txStart');
        var subCommands = command.getChildren();
        expect(subCommands[0].name).toBe('deleteShape');
        expect(subCommands[1].name).toBe('txEnd');
      });

      it('should add modifyShapeFill command with provided context',
          function() {
            _eventData.command = {};
            var shapeColorFilledEventData = {
              action: 'modifyShapeFillColor',
              context: {
                contentType: 'shape',
                command: {
                  eid: _shapeNode.id,
                  sn: 1
                }
              }
            };

            var txStartCommandMockedData = {
              name: 'txStart',
              addChild: function() {},
              getChildren: function() {return [shapeFillCommandMockedData,
                txEndCommandMockedData];}
            };

            var shapeFillCommandMockedData = {
              name: 'modShapeFill',
              addChild: function() {},
              callsService: function() {
                var type = _eventData.command.type;
                return type !== 'dcpCommand';
              }
            };

            var txEndCommandMockedData = {
              name: 'txEnd'
            };

            spyOn(SelectionManager, 'snapshot');
            spyOn(TransactionStartCmd, 'create').andReturn(
                txStartCommandMockedData);
            spyOn(ModifyShapeFillCommand, 'create').andReturn(
                shapeFillCommandMockedData);
            spyOn(TransactionEndCmd, 'create').andReturn(
                txEndCommandMockedData);
            PubSub.publish('qowt:doAction', shapeColorFilledEventData);

            var command = CommandManager.addCommand.calls[0].args[0];
            expect(command.name).toBe('txStart');
            var subCommands = command.getChildren();
            expect(subCommands[0].name).toBe('modShapeFill');
            expect(subCommands[1].name).toBe('txEnd');
          });

      it('should change slide selection if the shape to be deleted is not on ' +
          'the current slide', function() {
            spyOn(PubSub, 'publish').andCallThrough();
            shapeDeleteEventData.context.command.type = 'dcpCommand';
            shapeDeleteEventData.context.command.cn = 1;
            PubSub.publish('qowt:doAction', shapeDeleteEventData);
            expect(PubSub.publish.calls[1].args[0]).toBe('qowt:doAction');
            expect(PubSub.publish.calls[1].args[1].action).toBe('slideSelect');
            expect(PubSub.publish.calls[1].args[1].context.index).toBe(0);
         });

      it('should not change slide selection if the shape to be deleted is on ' +
          'the current slide', function() {
            spyOn(PubSub, 'publish').andCallThrough();
            shapeDeleteEventData.context.command.type = 'dcpCommand';
            shapeDeleteEventData.context.command.cn = 2;

            PubSub.publish('qowt:doAction', shapeDeleteEventData);
            //Expect that only publish for delete shape action should be called
            expect(PubSub.publish.callCount).toBe(1);
          });

      it('should add formatObject command with context', function() {
        var shapeOutlineColorFilledEventData = {
          action: 'formatObject',
          context: {
            contentType: 'shape',
            command: {
              eid: _shapeNode.id,
              sn: 1
            }
          }
        };

        var txStartCommandMockedData = {
          name: 'txStart',
          addChild: function() {},
          getChildren: function() {return [formatObjectCommandMockedData,
            txEndCommandMockedData];}
        };

        var formatObjectCommandMockedData = {
          name: 'formatObject',
          addChild: function() {},
          callsService: function() {
            var type = _eventData.command.type;
            return type !== 'dcpCommand';
          }
        };

        var txEndCommandMockedData = {
          name: 'txEnd'
        };

        spyOn(SelectionManager, 'snapshot');
        spyOn(TransactionStartCmd, 'create').andReturn(
            txStartCommandMockedData);
        spyOn(FormatObjectCommand, 'create').andReturn(
            formatObjectCommandMockedData);
        spyOn(TransactionEndCmd, 'create').andReturn(txEndCommandMockedData);
        PubSub.publish('qowt:doAction', shapeOutlineColorFilledEventData);

        var command = CommandManager.addCommand.calls[0].args[0];
        expect(command.name).toBe('txStart');
        var subCommands = command.getChildren();
        expect(subCommands[0].name).toBe('formatObject');
        expect(subCommands[1].name).toBe('txEnd');
      });
    });
  });
});
