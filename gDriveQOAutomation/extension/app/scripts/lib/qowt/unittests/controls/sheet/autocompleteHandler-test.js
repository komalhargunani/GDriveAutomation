// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Autocomplete Handler unit test suite.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/controls/grid/autocompleteHandler',
  'qowtRoot/tools/toolManager',
  'qowtRoot/controls/grid/workbook'
], function(
    AutocompleteHandler,
    ToolsManager,
    Workbook) {

  'use strict';

  describe('Autocomplete Handler', function() {

    var _kSheetTextToolName = 'sheetText';

    beforeEach(function() {
      Workbook.init();
      ToolsManager.setActiveTool();
    });

    afterEach(function() {
      Workbook.reset();
    });

    it('should call the generateCandidateList method when the Sheet Text ' +
        'Tool is activated', function() {
          spyOn(AutocompleteHandler, 'generateCandidateList');
          ToolsManager.setActiveTool(_kSheetTextToolName);

          expect(AutocompleteHandler.generateCandidateList).toHaveBeenCalled();
        });

    it('should call the clearCandidateList method when the Sheet Text ' +
        'Tool is deactivated', function() {
          ToolsManager.setActiveTool(_kSheetTextToolName);
          spyOn(AutocompleteHandler, 'clearCandidateList');
          ToolsManager.setActiveTool();

          expect(AutocompleteHandler.clearCandidateList).toHaveBeenCalled();
        });

    it('should set the num of rows when the generateCandidateList method is' +
        ' called', function() {
          AutocompleteHandler.clearCandidateList();
          spyOn(Workbook, 'getNumOfRows');
          AutocompleteHandler.generateCandidateList();

          expect(Workbook.getNumOfRows).toHaveBeenCalled();
        });
  });
});
