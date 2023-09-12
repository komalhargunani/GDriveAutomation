/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for communication
 * with Drive Web UI. Uses sinon to mock out server
 *
 * @author jelte@google.com (Jelte Liebrand)
 */


// make sure both the apiary and firstPartyAuth modules are mocked out
require.config({
  paths: {
    'utils/gdrive/firstPartyAuth': 'test/mocks/mockFirstPartyAuth',
    'utils/gdrive/apiaryLoader': 'test/mocks/mockApiary'
  }
});


define([
  'utils/gdrive/drive',
  'utils/gdrive/driveUtils'
  ], function(
    Drive,
    DriveUtils) {

  'use strict';

  describe("Drive communication", function() {

    afterEach(function() {
      Drive.clearCachedMetaData();
    });

    var VALID_DOC = 'validDoc',
        NOT_FOUND_DOC = 'missingDoc',
        DOC_500_RESPONSE = '500Doc',
        DOC_503_RESPONSE = '503Doc',
        DOC_403_RATE_LIMIT_EXCEEDED_RESPONSE = '403RLDoc',
        DOC_403_USER_RATE_LIMIT_EXCEEDED_RESPONSE = '403URLDoc';

    it("should get metadata in success case", function() {
      var promise = Drive.getMetaData(VALID_DOC);

      return assert.isFulfilled(promise, "get meta should succeed")
          .then(function(meta) {
            assert.equal(meta.id, VALID_DOC);
            assert.equal(meta.mimeType, 'application/msword');
          });
    });

    it("should fail for NOT FOUND doc ids", function() {
      var promise = Drive.getMetaData(NOT_FOUND_DOC);

      return assert.isRejected(promise, "get meta should reject for not found")
          .then(function(response) {
            assert.equal(DriveUtils.getErrorCode(response), 404);
          });
    });

    it("should retry once more after a 500 error", function() {
      sinon.spy(gapi.client, 'request');
      var promise = Drive.getMetaData(DOC_500_RESPONSE);

      return assert.isRejected(promise, "get meta should reject for 500 errors")
        .then(function(response) {
          assert.equal(DriveUtils.getErrorCode(response), 500);
          sinon.assert.calledTwice(gapi.client.request);
          gapi.client.request.restore();
        });
    });

    it("should retry once more after a 503 error", function() {
      sinon.spy(gapi.client, 'request');
      var promise = Drive.getMetaData(DOC_503_RESPONSE);

      return assert.isRejected(promise, "get meta should reject for 503 errors")
        .then(function(response) {
          assert.equal(DriveUtils.getErrorCode(response), 503);
          sinon.assert.calledTwice(gapi.client.request);
          gapi.client.request.restore();
        });
    });

    it("should retry once more after a 403 'rateLimitExceeded' error",
      function() {
      sinon.spy(gapi.client, 'request');
      var promise = Drive.getMetaData(DOC_403_RATE_LIMIT_EXCEEDED_RESPONSE);

      return assert.isRejected(promise, "get meta should reject for 403 " +
        "'rateLimitExceeded' errors")
        .then(function(response) {
          assert.equal(DriveUtils.getErrorCode(response), 403);
          assert.equal(DriveUtils.getErrorReason(response),
            'rateLimitExceeded');
          sinon.assert.calledTwice(gapi.client.request);
          gapi.client.request.restore();
        });
    });

    it("should retry once more after a 403 'userRateLimitExceeded' error",
      function() {
      sinon.spy(gapi.client, 'request');
      var promise = Drive.getMetaData(
        DOC_403_USER_RATE_LIMIT_EXCEEDED_RESPONSE);

      return assert.isRejected(promise, "get meta should reject for 403 " +
        "'userRateLimitExceeded' errors")
        .then(function(response) {
          assert.equal(DriveUtils.getErrorCode(response), 403);
          assert.equal(DriveUtils.getErrorReason(response),
            'userRateLimitExceeded');
          sinon.assert.calledTwice(gapi.client.request);
          gapi.client.request.restore();
        });
    });

    it("should use the public drive v2 api for getMetaData", function() {
      var spy = sinon.spy(gapi.client, 'request');
      var promise = Drive.getMetaData(VALID_DOC);

      return assert.isFulfilled(promise, "get meta data should succeed")
          .then(function() {
            var path = spy.args[0][0].path;
            assert(path.indexOf('/drive/v2/files/') === 0);
            var params = spy.args[0][0].params;
            assert(params.supportsTeamDrives === true);
            gapi.client.request.restore();
          });
    });

    it("should use the public drive v2 api for download", function() {
      var spy = sinon.spy(gapi.client, 'request');
      var promise = Drive.download(VALID_DOC);

      return assert.isFulfilled(promise, "download should succeed")
          .then(function() {
             var path = spy.args[0][0].path;
            assert(path.indexOf('/drive/v2/files/') === 0);
            var params = spy.args[0][0].params;
            assert(params.supportsTeamDrives === true);
            gapi.client.request.restore();
          });
    });

    // TODO(jliebrand): add more unit tests for drive.download and .upload
  });
});

