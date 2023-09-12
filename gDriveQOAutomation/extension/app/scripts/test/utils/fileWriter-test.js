/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test module for our File Writer
 * utility
 *
 * @author ghyde@google.com (Greg Hyde)
 */
define([
  'utils/fileWriter',
  'test/mocks/mockFileEntry'
  ], function(
    FileWriter,
    EntryMock) {

  describe("FileWriter", function() {

    // all async functions should fulfill within 10 seconds....
    this.timeout(10000);

    beforeEach(function() {
      EntryMock.reset();
    });

    it("should reject the promise and report error message correctly",
        function(done) {
      function onResolve() {
        assert(false);
        done();
      }
      function onReject(err) {
        assert(err.message.should.equal(
            window.__errorMock.currentTarget.error.message));
        done();
      }

      var writer = new FileWriter(window.__entryMock, {});
      writer.writeData(null).then(
          onResolve, onReject);
    });
  });

  return {};
});