/*
 * Test suite for UpdateCellsBase command
 */

define([
  'qowtRoot/commands/quicksheet/updateCellsBase',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    UpdateCellsBase,
    Workbook,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('UpdateCellsBase command', function() {

    var constructorThrowCheck = function(config, dcpData, throwMsg) {
      expect(function() {
        UpdateCellsBase.create(config, dcpData);
      }).toThrow(throwMsg);
    };

    beforeEach(function() {
      Workbook.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    describe('creation', function() {
      it('constructor should throw if no command name is given in the ' +
          'config object', function() {
            var config = {
              commandName: undefined,
              errorFactory: {},
              endSignal: 'blah'
            };
            var dcpData = {};
            constructorThrowCheck(config, dcpData,
                'ERROR: updateCellsBase config object is missing fields');
      });


      it('constructor should throw if no error factory is given in the ' +
          'config object', function() {
            var config = {
              commandName: 'blah',
              errorFactory: undefined,
              endSignal: 'blah'
            };
            var dcpData = {};
            constructorThrowCheck(config, dcpData,
                'ERROR: updateCellsBase config object is missing fields');
      });

      it('constructor should create a command successfully with valid ' +
          'parameters', function() {
            var config = {
              commandName: 'commandName',
              errorFactory: {},
              endSignal: 'blah'
            };
            var dcpData = {};
            var cmd = UpdateCellsBase.create(config, dcpData);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('commandName');
            expect(TypeUtils.isFunction(cmd.id)).toBe(true);
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(TypeUtils.isFunction(cmd.doOptimistic)).toBe(true);
            expect(TypeUtils.isFunction(cmd.dcpData)).toBe(true);
            expect(TypeUtils.isFunction(cmd.cancel)).toBe(true);
            expect(TypeUtils.isFunction(cmd.responseHook)).toBe(true);
            expect(TypeUtils.isFunction(cmd.onSuccess)).toBe(true);
            expect(TypeUtils.isFunction(cmd.onFailure)).toBe(true);
      });

      it('doOptimistic() method should dirty the document', function() {
        var config = {
          commandName: 'commandName',
          errorFactory: {},
          endSignal: 'blah'
        };
        var dcpData = {};
        var cmd = UpdateCellsBase.create(config, dcpData);
        expect(SaveStateManager.isSaved()).toBe(true);
        cmd.doOptimistic();
        expect(SaveStateManager.isSaved()).toBe(false);
      });
    });
  });
});
