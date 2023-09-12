define([], function() {
  'use strict';
  var _api = {
    name: 'contentMgrs',
    suites: [
      'unitTestRoot/contentMgrs/quickpoint/presentationContentMgr-test',
      'unitTestRoot/contentMgrs/quickpoint/shapeContentManager-test',
      'unitTestRoot/contentMgrs/quickpoint/thumbnailStripContentMgr-test',
      'unitTestRoot/contentMgrs/quickpoint/slideContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/cellContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/workbookContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/textEditorContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/rowContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/columnContentMgr-test',
      'unitTestRoot/contentMgrs/quicksheet/sheetContentMgr-test',
      'unitTestRoot/contentMgrs/quickword/documentContentMgr-test',
      'unitTestRoot/contentMgrs/quickword/mutationMgr-test'
    ]
  };
  return _api;
});
