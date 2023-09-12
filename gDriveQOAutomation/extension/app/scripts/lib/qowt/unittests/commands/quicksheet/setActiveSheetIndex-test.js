/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/commands/quicksheet/setActiveSheetIndex'], function(
    SetActiveSheetIndex) {

  'use strict';

  describe('SetActiveSheetIndex command', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('creation', function() {
      it('constructor should throw if no sheetIndex is given as ' +
          'an argument', function() {
            expect(function() {
              SetActiveSheetIndex.create();
            }).toThrow('ERROR: SetActiveSheetIndex requires a sheet index');
          });

      it('constructor should create a command if a valid parameters ' +
          'are specified', function() {
            var sheetIndex = 3,
                cmd = SetActiveSheetIndex.create(sheetIndex);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('SetActiveSheetIndex');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.doRevert).toBeDefined();
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.dcpData().name).toBe('sai');
            expect(cmd.dcpData().si).toBe(sheetIndex);
          });
    });
  });

});
