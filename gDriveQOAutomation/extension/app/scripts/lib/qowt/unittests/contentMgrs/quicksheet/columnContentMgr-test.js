// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for Column content manager.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/columnContentMgr',
  'qowtRoot/pubsub/pubsub'
],
function(ColumnContentMgr, PubSub) {

  'use strict';

  describe('Test initialization of Column Content Manager', function() {

    it('should initialize properly', function() {
      var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
      ColumnContentMgr.init();
      expect(PubSub.subscribe).wasCalled();
      expect(pubsubSpy.callCount).toEqual(2);

    });

    it('should throw ColumnContentManager.init() when called multiple' +
       'times',
       function() {
         expect(
              function() {
                ColumnContentMgr.init();
                ColumnContentMgr.init();
              }).toThrow('Column Content manager initialized multiple times.');
       });
  });
});
