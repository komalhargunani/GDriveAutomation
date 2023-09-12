// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for row content manager.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/rowContentMgr',
  'qowtRoot/pubsub/pubsub'
], function(RowContentMgr, PubSub) {

  'use strict';

  describe('Test initialization of Row Content Manager', function() {

    it('should initialize properly', function() {
      var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
      RowContentMgr.init();
      expect(PubSub.subscribe).wasCalled();
      expect(pubsubSpy.callCount).toEqual(2);

    });

    it('should throw RowContentManager.init() when called multiple times',
       function() {
         expect(function() {
           RowContentMgr.init();
           RowContentMgr.init();
         }).toThrow('Row Content manager initialized multiple times.');
       });
  });
});
