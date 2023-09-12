/*
 * Test suite for the Sheet Image Tool
 */
define([
  'qowtRoot/tools/toolManager',
  'qowtRoot/controls/grid/workbook'
], function(
    ToolsManager,
    Workbook) {

  'use strict';

  describe('The sheet image tool', function() {

    var _kSheetImageToolName = 'sheetFloaterImage';

    beforeEach(function() {
      Workbook.init();
      ToolsManager.setActiveTool();
    });

    it('should be able to be activated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetImageToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetImageToolName);
    });

    it('should disable formula bar edits when activated', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      spyOn(Workbook, 'disableFormulaBarEdits');
      ToolsManager.setActiveTool(_kSheetImageToolName);
      expect(Workbook.disableFormulaBarEdits).toHaveBeenCalled();
    });

    it('should be able to be deactivated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetImageToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetImageToolName);
      ToolsManager.setActiveTool();
      expect(ToolsManager.activeTool).not.toBe(_kSheetImageToolName);
    });

    it('should enable formula bar edits when deactivated', function() {
      ToolsManager.setActiveTool(_kSheetImageToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetImageToolName);
      spyOn(Workbook, 'enableFormulaBarEdits');
      ToolsManager.setActiveTool();
      expect(Workbook.enableFormulaBarEdits).toHaveBeenCalled();
    });

  });
});
