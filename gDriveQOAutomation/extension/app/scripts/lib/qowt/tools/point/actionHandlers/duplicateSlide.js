// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file is handles slide duplicate action.
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
    PubSub, ThumbnailStrip) {

  'use strict';

  /**
   * Handles slide duplicate from context and adds contentType and slides to the
   * command context.
   *
   * @param {object} actionData context of slide
   */
  var handleSlideDuplicate_ = function(actionData) {
    actionData.context = actionData.context || {};
    actionData.context.contentType = 'slideManagement';

    //set the slides
    var slidesToBeDuplicated = [];
    var highlightedThumbs = ThumbnailStrip.getHighlightedThumbs();
    highlightedThumbs.iterate(function(thumb) {
      slidesToBeDuplicated.push(thumb.getSlideIndex() + 1);
    });
    slidesToBeDuplicated = slidesToBeDuplicated.sort(function(a, b) {
      return a - b;
    });

    //TODO kunjan.thakkar: Currently, DCP does not support an array of
    //integers. Once the support is available the casting of indices to
    //string needs to be removed.
    slidesToBeDuplicated = slidesToBeDuplicated.toString().split(',');
    actionData.context.command = {
      slideNumbers: []
    };
    actionData.context.command.slideNumbers = slidesToBeDuplicated;

    PubSub.publish('qowt:doAction', actionData);
  };

  var api_ = {
    supportedActions: ['duplicateSlide'],

    callback: handleSlideDuplicate_
  };

  return api_;
});
