// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for sheet content manager.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/contentMgrs/quicksheet/sheetContentMgr',
  'qowtRoot/pubsub/pubsub'
], function(SheetContentMgr, PubSub) {

  'use strict';

  describe('Test initialization of Sheet Content Manager', function() {

    it('should initialize properly', function() {
      var pubsubSpy = spyOn(PubSub, 'subscribe').andCallThrough();
      SheetContentMgr.init();
      expect(PubSub.subscribe).wasCalled();
      expect(pubsubSpy.callCount).toEqual(2);

    });

    it('should throw SheetContentManager.init() when called multiple times',
       function() {
         expect(function() {
           SheetContentMgr.init();
           SheetContentMgr.init();
         }).toThrow('Sheet Content manager initialized multiple times.');
       });
  });
});
