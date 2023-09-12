/*
 * Test suite for the Sheet Chart Tool
 */
define([
  'qowtRoot/tools/toolManager',
  'qowtRoot/controls/grid/workbook'
], function(
    ToolsManager,
    Workbook) {

  'use strict';

  describe('The sheet chart tool', function() {

    var _kSheetChartToolName = 'sheetFloaterChart';

    beforeEach(function() {
      Workbook.init();
      ToolsManager.setActiveTool();
    });

    it('should be able to be activated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetChartToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetChartToolName);
    });

    it('should disable formula bar edits when activated', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      spyOn(Workbook, 'disableFormulaBarEdits');
      ToolsManager.setActiveTool(_kSheetChartToolName);
      expect(Workbook.disableFormulaBarEdits).toHaveBeenCalled();
    });

    it('should be able to be deactivated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetChartToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetChartToolName);
      ToolsManager.setActiveTool();
      expect(ToolsManager.activeTool).not.toBe(_kSheetChartToolName);
    });

    it('should enable formula bar edits when deactivated', function() {
      ToolsManager.setActiveTool(_kSheetChartToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetChartToolName);
      spyOn(Workbook, 'enableFormulaBarEdits');
      ToolsManager.setActiveTool();
      expect(Workbook.enableFormulaBarEdits).toHaveBeenCalled();
    });

  });
});
