/*
 * Test suite for ToggleNumberFormatDialog command
 */

define([
  'qowtRoot/commands/quicksheet/toggleNumberFormatDialog',
  'qowtRoot/controls/grid/workbook'
], function(
    ToggleNumberFormatDialog,
    Workbook) {

  'use strict';

  describe('ToggleNumberFormatDialog command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = ToggleNumberFormatDialog.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('ToggleNumberFormatDialog');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the workbook', function() {
        var cmd = ToggleNumberFormatDialog.create();
        spyOn(Workbook, 'toggleNumberFormatDialog');
        cmd.doOptimistic();
        expect(Workbook.toggleNumberFormatDialog).toHaveBeenCalled();
      });
    });
  });
});
