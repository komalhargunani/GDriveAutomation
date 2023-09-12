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
  'qowtRoot/dcp/openWorkbookFileHandler',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/sheet'
], function(
    OpenWorkbookFileHandler,
    MessageBus,
    SheetModel
) {

  'use strict';

  describe('dcp/openWorkbookFileHandler', function() {

    var FIXTURES = {}, handler;

    beforeEach(function() {
      // reset our fixtures
      FIXTURES.openWorkbookFileResponse = {
        'el': {
          'etp': 'owb',
          'docId': 666,
          'fn': ['Arial', 'Calibri', 'Verdana'],
          'id': 1,
          'name': 'owb',
          'pa': './foobar.xls',
          'pw': 'bingo',
          'ro': true,
          'sn': ['Sheet1', 'Sheet2', 'Sheet3', 'Sheet name with spaces'],
          'asi': 3
        }
      };

      FIXTURES.failedOpenWorkbookFileResponse = {
        'e': 'some error'
      };

      handler = OpenWorkbookFileHandler;

      spyOn(MessageBus, 'pushMessage');
    });

    afterEach(function() {});

    it('should update the font list in the model', function() {
      handler.visit(FIXTURES.openWorkbookFileResponse);
      expect(SheetModel.fontNames.length).toBe(3);
      expect(SheetModel.fontNames[0]).toBe('Arial');
      expect(SheetModel.fontNames[1]).toBe('Calibri');
      expect(SheetModel.fontNames[2]).toBe('Verdana');
    });

    it('should update the sheet names list in the model', function() {
      handler.visit(FIXTURES.openWorkbookFileResponse);
      expect(SheetModel.sheetNames.length).toBe(4);
      expect(SheetModel.sheetNames[0]).toBe('Sheet1');
      expect(SheetModel.sheetNames[1]).toBe('Sheet2');
      expect(SheetModel.sheetNames[2]).toBe('Sheet3');
      expect(SheetModel.sheetNames[3]).toBe('Sheet name with spaces');
    });

    it('should log number of work sheets', function() {
      handler.visit(FIXTURES.openWorkbookFileResponse);
      expect(MessageBus.pushMessage).wasCalled();
      var arg = MessageBus.pushMessage.mostRecentCall.args[0];
      expect(arg.id).toBe('recordCount');
      expect(arg.context.dataPoint).toBe('SheetCount');
      expect(arg.context.value).toBe(SheetModel.sheetNames.length);
    });

    it('should update the read only state in the model', function() {
      handler.visit(FIXTURES.openWorkbookFileResponse);
      expect(SheetModel.fileIsReadOnly).toBe(true);
    });

    it("should default the read only state to false if it's not set in the " +
        'response', function() {
          var res = FIXTURES.openWorkbookFileResponse;
          res.el.ro = undefined;
          handler.visit(res);
          expect(SheetModel.fileIsReadOnly).toBe(false);
        });

    it('should update the file password in the model', function() {
      handler.visit(FIXTURES.openWorkbookFileResponse);
      expect(SheetModel.filePassword).toBe('bingo');
    });

    it('should update the model with all the relevant sheet names in the ' +
        'workbook', function() {
          handler.visit(FIXTURES.openWorkbookFileResponse);
          expect(SheetModel.sheetNames.length).toBe(4);
          expect(SheetModel.sheetNames[0]).toBe('Sheet1');
          expect(SheetModel.sheetNames[1]).toBe('Sheet2');
          expect(SheetModel.sheetNames[2]).toBe('Sheet3');
          expect(SheetModel.sheetNames[3]).toBe('Sheet name with spaces');
        });

    it('should update the model to have an active sheet index of 3',
        function() {
          handler.visit(FIXTURES.openWorkbookFileResponse);
          expect(SheetModel.activeSheetIndex).toBe(3);
        });

    it("should set active sheet index to zero if it's NOT set in the response",
        function() {
          var res = FIXTURES.openWorkbookFileResponse;
          res.el.asi = undefined;
          handler.visit(res);
          expect(SheetModel.activeSheetIndex).toBe(0);
        });

    it('should set active sheet index to whatever it is set in the response',
        function() {
          var res = FIXTURES.openWorkbookFileResponse;
          res.el.asi = 5;
          handler.visit(res);
          expect(SheetModel.activeSheetIndex).toBe(5);
        });
  });
});
