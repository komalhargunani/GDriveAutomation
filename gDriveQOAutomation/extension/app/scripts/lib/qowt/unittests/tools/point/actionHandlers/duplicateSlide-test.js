// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide duplicate action handler
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/point/actionHandlers/duplicateSlide',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
    PubSub,
    SlideDuplicate,
    ThumbnailStrip) {

  describe('duplicate slide action handler test', function() {

    beforeEach(function() {
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(PubSub, 'subscribe').andCallThrough();
    });

    it('should publish doAction event for duplicate slide action', function() {
      var action_ = {
        action: 'duplicateSlide',
        'context': {}
      };

      var dummyThumb = {
        getSlideIndex: function() {return 0;}
      };

      var dummyHighlightedThumbs = {
        m_arr: [dummyThumb],
        iterate: function(callback) {
          var totalCount = this.m_arr.length;
          for (var count = totalCount - 1; count >= 0; count--) {
            if (callback(this.m_arr[count])) {
            }
          }
        }
      };

      var expectedContext_ = {
        action: 'duplicateSlide',
        'context': {
          'contentType': 'slideManagement',
          'command': {
            slideNumbers: ['1']
          }
        }
      };
      spyOn(ThumbnailStrip, 'getHighlightedThumbs').andReturn(
          dummyHighlightedThumbs);
      SlideDuplicate.callback(action_);
      expect(ThumbnailStrip.getHighlightedThumbs).toHaveBeenCalled();
      expect(PubSub.publish.mostRecentCall.args[0]).toEqual('qowt:doAction');
      expect(PubSub.publish.mostRecentCall.args[1]).toEqual(expectedContext_);
    });
  });
});
