// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for Slide content manager.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/contentMgrs/slideContentMgr',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/drawing/addShape',
  'qowtRoot/commands/drawing/addShapeInit',
  'qowtRoot/commands/drawing/insertSlideNote',
  'qowtRoot/models/transientAction',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/commands/common/transactionEnd',
  'qowtRoot/selection/selectionManager'
], function(
    SlideContentManager,
    PubSub,
    UnittestUtils,
    CommandManager,
    AddShapeCommand,
    AddShapeInitCommand,
    InsertSlideNoteCmd,
    TransientActionModel,
    SlidesContainer,
    TransactionStartCmd,
    TransactionEndCmd,
    SelectionManager) {

  'use strict';

  describe('Slide Content Manager Test', function() {

    var _shapeNode, _eventData, _slideWidget;
    var addShapeCommandMockedData, insertSlideNoteCommandMockedData;

    beforeEach(function() {
      spyOn(PubSub, 'subscribe').andCallThrough();
      SlideContentManager.init();
      _shapeNode = UnittestUtils.createTestAppendArea();
      _eventData = {
        'action': 'addShape',
        'context': {
          'command': {
            'sp': {
              'prstId': 88,
              'transforms': {
                'ext': {
                  'cx': '86px',
                  'cy': '68px'
                },
                'flipH': false,
                'flipV': false,
                'off': {
                  'x': 469,
                  'y': 92
                },
                'rot': 0
              },
              'isTxtBox': true
            }
          },
          'contentType': 'slide'
        }
      };

      _slideWidget = {
        node: function() {
        },
        getSlideIndex: function() {
          return 0;
        },
        generateShapeId: function() {
          return 1;
        },
        getLayoutId: function() {
          return 'E120';
        }
      };

      addShapeCommandMockedData = {
        name: 'insertShape',
        addChild: function() {
        },
        callsService: function() {
          var type = _eventData.context.command.type;
          return type !== 'dcpCommand';
        }
      };

      var addShapeInitCommandMockedData = {
        name: 'addShapeInit',
        callsService: function() {
          return false;
        }
      };
      insertSlideNoteCommandMockedData = {
        name: 'insertSlideNote',
        callsService: function() {
          return false;
        }
      };

      spyOn(TransientActionModel, 'setTransientAction');
      spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(_slideWidget);
      spyOn(_slideWidget, 'node').andReturn(_shapeNode);
      spyOn(AddShapeCommand, 'create').andReturn(addShapeCommandMockedData);
      spyOn(AddShapeInitCommand, 'create').andReturn(
          addShapeInitCommandMockedData);
      spyOn(InsertSlideNoteCmd, 'create').andReturn(
          insertSlideNoteCommandMockedData);
      spyOn(CommandManager, 'addCommand');
    });

    afterEach(function() {
      UnittestUtils.removeTestAppendArea();
      _shapeNode = undefined;
      _slideWidget = undefined;
    });

    it('should throw error if slideContentManager.init() called multiple times',
        function() {
          expect(SlideContentManager.init).toThrow(
              'slideContentManager.init() called multiple times.');
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

    it('should create an add shape init Command', function() {
      _eventData.action = 'initAddShape';
      PubSub.publish('qowt:doAction', _eventData);
      var command = CommandManager.addCommand.calls[0].args[0];
      expect(command.name).toBe('addShapeInit');
    });

    it('should create an add shape Command in a transaction', function() {
      var txStartCommandMockedData = {
        name: 'txStart',
        addChild: function() {},
        getChildren: function() {return [addShapeCommandMockedData,
          txEndCommandMockedData];}
      };

      var txEndCommandMockedData = {
        name: 'txEnd'
      };


      spyOn(TransactionStartCmd, 'create').andReturn(txStartCommandMockedData);
      spyOn(TransactionEndCmd, 'create').andReturn(txEndCommandMockedData);

      spyOn(SelectionManager, 'snapshot');
      _eventData.action = 'addShape';

      PubSub.publish('qowt:doAction', _eventData);
      expect(SlidesContainer.getCurrentSlideWidget).toHaveBeenCalled();
      expect(_slideWidget.node).toHaveBeenCalled();

      var command = CommandManager.addCommand.calls[0].args[0];
      expect(command.name).toBe('txStart');
      var subCommands = command.getChildren();
      expect(subCommands[0].name).toBe('insertShape');
      expect(subCommands[1].name).toBe('txEnd');
    });

    it('should change slide selection if the shape to be added is not on ' +
        'the current slide', function() {
          _eventData.action = 'addShape';
          _eventData.context.command.type = 'dcpCommand';
          _eventData.context.command.cn = 2;

          spyOn(PubSub, 'publish').andCallThrough();

          PubSub.publish('qowt:doAction', _eventData);
          expect(PubSub.publish.calls[1].args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.calls[1].args[1].action).toBe('slideSelect');
          expect(PubSub.publish.calls[1].args[1].context.index).toBe(1);
        });

    it('should not change slide selection if the shape to be added is on ' +
        'the current slide', function() {
          _eventData.action = 'addShape';
          _eventData.context.command.type = 'dcpCommand';
          _eventData.context.command.cn = 1;

          spyOn(PubSub, 'publish').andCallThrough();

          PubSub.publish('qowt:doAction', _eventData);
          //Expect that only publish for add shape action should be called
          expect(PubSub.publish.callCount).toBe(1);
        });

    it('should create an insertSlideNote Command', function() {
      var parentNode = {
        appendChild: function() {
        }
      };
      var _eventData = {
        'action': 'insertSlideNote',
        'context': {
          'command': {
            rootEl: parentNode,
            sn: 1
          },
          'contentType': 'slide'
        }
      };

      PubSub.publish('qowt:doAction', _eventData);
      var command = CommandManager.addCommand.calls[0].args[0];
      expect(command.name).toBe('insertSlideNote');
    });
  });
});
