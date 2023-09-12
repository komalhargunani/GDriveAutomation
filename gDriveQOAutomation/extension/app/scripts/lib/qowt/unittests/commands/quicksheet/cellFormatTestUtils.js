define([
  'qowtRoot/models/sheet',
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/commandManager',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/messageBus/messageBus'
], function(
    SheetModel,
    CommandBase,
    CommandManager,
    SheetConfig,
    MessageBus) {

  'use strict';

  var _sheetIndex = 3;

  beforeEach(function() {
    SheetModel.activeSheetIndex = _sheetIndex;
    spyOn(MessageBus, 'pushMessage');
  });

  afterEach(function() {
  });

  var _api = {
    getTestSuite: function(values, config) {
      describe('creation', function() {
        var fromColIndex = 2;
        var fromRowIndex = 3;
        var toColIndex = 4;
        var toRowIndex = 5;

        var _getOptions = function(i) {
          var options = Object.create(config);
          options.fromColIndex = fromColIndex;
          options.fromRowIndex = fromRowIndex;
          options.toColIndex = toColIndex;
          options.toRowIndex = toRowIndex;
          options.value = values[i];
          return options;
        };

        it('should create a valid command with the given parameters',
           function() {
             for (var i = 0; i < values.length; i++) {
               _buildAndCheckCommand(_getOptions(i));
             }
           });
        it('inverse should create an UndoCommand', function() {
          for (var i = 0; i < values.length; i++) {
            var options = _getOptions(i);
            var cmd = _buildCmd(options);
            CommandManager.addCommand(cmd);
            var inverse = cmd.getInverse();
            expect(inverse.name).toBe('UndoCommand');
          }
        });
        it('should throw on undefined value', function() {
          expect(config.factory.create.bind(this, fromColIndex, fromRowIndex,
              toColIndex, toRowIndex)).toThrow();
        });

        it('should accept missing row or column values', function() {
          expect(config.factory.create.bind(this, undefined, fromRowIndex,
              undefined, toRowIndex, values[0])).not.toThrow();
          expect(config.factory.create.bind(this, fromColIndex, undefined,
              toColIndex, undefined, values[0])).not.toThrow();
        });

        it('should throw on missing index values', function() {
          expect(config.factory.create.bind(this, undefined, fromRowIndex,
              toColIndex, toRowIndex, values[0])).toThrow();
          expect(config.factory.create.bind(this, fromColIndex, undefined,
              toColIndex, toRowIndex, values[0])).toThrow();
          expect(config.factory.create.bind(this, fromColIndex, fromRowIndex,
              undefined, toRowIndex, values[0])).toThrow();
          expect(config.factory.create.bind(this, fromColIndex, fromRowIndex,
              toColIndex, undefined, values[0])).toThrow();
        });
      });
    }
  };

  var _buildAndCheckCommand = function(options) {
    var cmd = _buildCmd(options);
    _checkCommand(cmd, options);
  };

  var _unrollCommand = function(cmd, acc) {
    if (acc === undefined) {
      acc = [];
    }

    acc.push(cmd);
    var children = cmd.getChildren();
    for (var i = 0; i < children.length; i++) {
      _unrollCommand(children[i], acc);
    }

    return acc;
  };

  var _buildCmd = function(options) {
    return options.factory.create(options.fromColIndex,
        options.fromRowIndex, options.toColIndex, options.toRowIndex,
        options.value);
  };

  var _checkCommand = function(cmd, options) {
    expect(CommandBase.isCommand(cmd)).toBe(true);
    expect(cmd).toBeDefined();
    expect(cmd.name).toBe(options.name);
    expect(cmd.id()).toBeDefined();
    expect(cmd.isOptimistic()).toBe(true);
    expect(cmd.callsService()).toBe(true);
    expect(cmd.onFailure).toBeDefined();
    expect(cmd.onSuccess).toBeDefined();
    expect(cmd.dcpData().name).toBe('scf');
    expect(cmd.dcpData().si).toBe(_sheetIndex);
    expect(cmd.dcpData().r1).toBe(options.fromRowIndex);
    expect(cmd.dcpData().c1).toBe(options.fromColIndex);
    expect(cmd.dcpData().r2).toBe(options.toRowIndex);
    expect(cmd.dcpData().c2).toBe(options.toColIndex);
    expect(cmd.dcpData().bs).toBe(
        SheetConfig.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE);
    expect(cmd.canInvert).toBe(true);
  };

  return _api;
});
