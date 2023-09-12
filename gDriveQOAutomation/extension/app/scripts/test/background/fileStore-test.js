/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha-based unit test suite for the File Store
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'background/store/fileStore',
  'background/store/fileDetails',
  'utils/analytics/googleAnalytics'],
  function(
    FileStore,
    FileDetails,
    GA) {

  'use strict';

  describe("File Store", function() {

    it("should correctly identify orphaned private files", function() {
      FileStore.init().then(function(){
      var kDAYS_IN_MS = 1000 * 60 * 60 * 24;

      // add some entries to the File Store...

      // this entry isn't orphaned as it has a tabId
      var fileDetails1 = new FileDetails({
        driveDocId: 'docId1',
        tabId: 'tab1',
        privateFilePath: '/expenses.xlsx',
        timestamp: new Date().getTime()
      });
      var uuid1 = FileStore.addEntry(fileDetails1);

      // this entry isn't orphaned as it has a tabId
      // (the fact that its timestamp is over 90 days ago is irrelevant)
      var fileDetails2 = new FileDetails({
        driveDocId: 'docId2',
        tabId: 'tab2',
        privateFilePath: '/course.ppt',
        timestamp: new Date().getTime() - (kDAYS_IN_MS * 95)
      });
      var uuid2 = FileStore.addEntry(fileDetails2);

      // this entry isn't orphaned as although it doesn't have
      // a tabId its timestamp is less than 90 days ago
      var fileDetails3 = new FileDetails({
        driveDocId: 'docId3',
        privateFilePath: '/report.docx',
        timestamp: new Date().getTime() - (kDAYS_IN_MS * 89)
      });
      var uuid3 = FileStore.addEntry(fileDetails3);

      // this entry isn't orphaned as although it doesn't have
      // a tabId its timestamp is less than 90 days ago and has a downloadFile
      var fileDetails4 = new FileDetails({
        driveDocId: 'docId4',
        downloadFilePath: '/report.docx',
        timestamp: new Date().getTime() - (kDAYS_IN_MS * 89)
      });
      var uuid4 = FileStore.addEntry(fileDetails4);

      // this entry is orphaned as it doesn't have a
      // tab id and its timestamp is over 90 days ago
      var fileDetails5 = new FileDetails({
        driveDocId: 'docId5',
        privateFilePath: '/population.xls',
        timestamp: new Date().getTime() - (kDAYS_IN_MS * 91)
      });
      var uuid5 = FileStore.addEntry(fileDetails5);

      // this is an orphan as it doesn't have a file store entry at all
      var file6 = '/essay.doc';

      // now ask the File Store to determine the orphans correctly
      var fileEntries = [
        {fullPath: fileDetails1.privateFilePath},
        {fullPath: fileDetails2.privateFilePath},
        {fullPath: fileDetails3.privateFilePath},
        {fullPath: fileDetails4.downloadFilePath},
        {fullPath: fileDetails5.privateFilePath},
        {fullPath: file6}
      ];
      var orphans = FileStore.deleteOrphans(fileEntries);

      assert.equal(isAnOrphan_(orphans, fileDetails1.privateFilePath), false);
      assert.equal(isInStore_(uuid1), true);
      assert.equal(isAnOrphan_(orphans, fileDetails2.privateFilePath), false);
      assert.equal(isInStore_(uuid2), true);
      assert.equal(isAnOrphan_(orphans, fileDetails3.privateFilePath), false);
      assert.equal(isInStore_(uuid3), true);
      assert.equal(isAnOrphan_(orphans, fileDetails4.downloadFilePath), false);
      assert.equal(isInStore_(uuid4), true);
      assert.equal(isAnOrphan_(orphans, fileDetails5.privateFilePath), true);
      assert.equal(isInStore_(uuid5), false);
      assert.equal(isAnOrphan_(orphans, file6), true);
    });
    });

    it("should be successful if window is valid when persisting store",
      function() {
      FileStore.init().then(function(){
        persistNewStoreEntry_(true);
      });
    });

    var isAnOrphan_ = function(list, target) {
      return list.indexOf(target) !== -1;
    };

    var isInStore_ = function(uuid) {
      return FileStore.getEntry(uuid) !== undefined;
    };

    var persistNewStoreEntry_ = function(expectSuccess) {
      var fileDetails = new FileDetails({
        driveDocId: 'docIdA',
        tabId: 'tabA',
        privateFilePath: '/stock.docx',
        timestamp: new Date().getTime()
      });

      sinon.spy(localStorage, 'setItem');
      sinon.spy(GA, 'sendException');

      // add an entry, which will then try to persist the updated store
      FileStore.addEntry(fileDetails);

      if(expectSuccess) {
        sinon.assert.called(localStorage.setItem);
        sinon.assert.notCalled(GA.sendException);
      } else {
        sinon.assert.notCalled(localStorage.setItem);
        sinon.assert.called(GA.sendException);
      }

      localStorage.setItem.restore();
      GA.sendException.restore();
    };

  });
});
