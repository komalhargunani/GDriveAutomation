// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for workbook content manager.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/workbookContentMgr',
  'qowtRoot/contentMgrs/quicksheet/textEditorContentMgr',
  'qowtRoot/contentMgrs/quicksheet/sheetContentMgr',
  'qowtRoot/contentMgrs/quicksheet/rowContentMgr',
  'qowtRoot/contentMgrs/quicksheet/columnContentMgr',
  'qowtRoot/contentMgrs/quicksheet/cellContentMgr',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/pubsub/pubsub'
], function(
    WorkbookContentMgr,
    TextEditorContentMgr,
    SheetContentMgr,
    RowContentMgr,
    ColumnContentMgr,
    CellContentMgr,
    SheetSelectionManager,
    PubSub) {

  'use strict';

  describe('Test initialization of Workbook Content Manager', function() {

    it('should initialize workbook Content Manager and call its ' +
        'sub-modules init method properly', function() {
          var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
          var textEditorContentMgrInitSpy =
              spyOn(TextEditorContentMgr, 'init').andCallThrough();
          var sheetContentMgrInitSpy =
              spyOn(SheetContentMgr, 'init').andCallThrough();
          var rowContentMgrInitSpy =
              spyOn(RowContentMgr, 'init').andCallThrough();
          var columnContentMgrInitSpy =
              spyOn(ColumnContentMgr, 'init').andCallThrough();
          var cellContentMgrInitSpy =
              spyOn(CellContentMgr, 'init').andCallThrough();
          var sheetSelectionMgrInitSpy =
              spyOn(SheetSelectionManager, 'init').andCallThrough();
          WorkbookContentMgr.init();
          expect(PubSub.subscribe).wasCalled();
          expect(pubsubSpy.callCount).toEqual(16);
          expect(TextEditorContentMgr.init).wasCalled();
          expect(textEditorContentMgrInitSpy.callCount).toEqual(1);
          expect(SheetContentMgr.init).wasCalled();
          expect(sheetContentMgrInitSpy.callCount).toEqual(1);
          expect(RowContentMgr.init).wasCalled();
          expect(rowContentMgrInitSpy.callCount).toEqual(1);
          expect(ColumnContentMgr.init).wasCalled();
          expect(columnContentMgrInitSpy.callCount).toEqual(1);
          expect(CellContentMgr.init).wasCalled();
          expect(cellContentMgrInitSpy.callCount).toEqual(1);
          expect(SheetSelectionManager.init).wasCalled();
          expect(sheetSelectionMgrInitSpy.callCount).toEqual(1);
        });

    it('should throw WorkbookContentManager.init() when called multiple' +
        ' times', function() {
          expect(function() {
            WorkbookContentMgr.init();
            WorkbookContentMgr.init();
          }).toThrow('Workbook Content manager initialized multiple times.');
        });

  });
});
