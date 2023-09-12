/*
 * Test suite for MirrorText command
 */

define([
  'qowtRoot/commands/quicksheet/mirrorText',
  'qowtRoot/controls/grid/workbook'
], function(
    MirrorText,
    Workbook) {

  'use strict';

  describe('MirrorText command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var cmd = MirrorText.create();
        expect(cmd).toBeDefined();
        expect(cmd.name).toBe('MirrorText');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBe(true);
        expect(cmd.callsService()).toBe(false);
        expect(cmd.doOptimistic).toBeDefined();
      });

      it('doOptimistic() method should talk to the workbook layout control',
         function() {
           var cmd = MirrorText.create();
           spyOn(Workbook, 'mirrorText');
           cmd.doOptimistic();
           expect(Workbook.mirrorText).toHaveBeenCalled();
         });
    });
  });
});
