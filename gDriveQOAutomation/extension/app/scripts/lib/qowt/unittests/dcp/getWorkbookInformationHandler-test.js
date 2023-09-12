// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview tests GetWorkbookInformationHandler
 *
 * @author anchals@google.com (Anchal Sharma)
 */

define([
  'qowtRoot/dcp/getWorkbookInformationHandler',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/fixtures/sheet/getWorkbookInformationResponseFixture',
  'qowtRoot/variants/configs/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/messageBus/messageBus'
], function(
    GetWorkbookInformationHandler,
    Workbook,
    FIXTURES,
    SheetConfig,
    SheetSelectionManager,
    MessageBus) {

  'use strict';

  describe('getWorkbookInformation DCP Handler', function() {
    FIXTURES = FIXTURES || {};

    var handler = GetWorkbookInformationHandler;

    it('should publish recording messages on the bus', function() {
      var se = [
        { ncd: 5,
          ncf: 3
        }
      ];
      var responseEl = FIXTURES.getWorkbookInformationResponseElement(se);
      var v = {el: responseEl};
      SheetConfig.kGRID_DEFAULT_MAX_ROWS = 5000;
      Workbook.setDefaultFormatting = function() {};
      Workbook.setDefaultRowHeight = function() {};
      Workbook.setDefaultColumnWidth = function() {};
      Workbook.ensureMinimalRowCount = function() {};
      Workbook.layoutColumnWidths = function() {};
      SheetSelectionManager.trySeedSelection = function() {};
      SheetSelectionManager.getCurrentSelection = function() {};
      SheetSelectionManager.renderStoredRange = function() {};
      SheetSelectionManager.getStoredSelectionForSheet = function() {};
      spyOn(MessageBus, 'pushMessage');
      handler.visit(v);
      expect(MessageBus.pushMessage).wasCalled();
      var arg = MessageBus.pushMessage.mostRecentCall.args[0];
      expect(arg.id).toBe('recordCount');
      expect(arg.context.dataPoint).toBe('FormattedCellCount');
      expect(arg.context.value).toBe(3);
      arg = MessageBus.pushMessage.argsForCall[
          MessageBus.pushMessage.argsForCall.length - 2];
      expect(arg[0].id).toBe('recordCount');
      expect(arg[0].context.dataPoint).toBe('NonEmptyCellCount');
      expect(arg[0].context.value).toBe(5);
    });
  });
});
