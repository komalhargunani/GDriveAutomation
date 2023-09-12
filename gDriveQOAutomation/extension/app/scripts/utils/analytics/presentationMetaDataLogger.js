define([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/point',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/env',
  'qowtRoot/utils/domListener',
], function (
  MessageBus,
  PointModel,
  PubSub,
  EnvModel,
  DomListener) {

  'use strict';

  var _contentCompleteToken;
  var _slideLoadedCounter = 0;
  var _api = {
    init: function () {
      _contentCompleteToken =
        PubSub.subscribe('qowt:contentComplete', logData);
      DomListener.add('presentation', EnvModel.rootNode, 'qowt:slideLoaded',
        _slideLoaded);
    }
  };

  function _slideLoaded() {
    _slideLoadedCounter++;
  }

  function calculateImageCount_() {
    return document.querySelectorAll('img').length;
  }

  function logData() {
    var imageCount = calculateImageCount_();
    var totalSlidesCount = PointModel.numberOfSlidesInPreso;
    recordToGA('totalSlidesCount', totalSlidesCount);
    recordToGA('loadedSlidesCount', _slideLoadedCounter);
    recordToGA('imageCount', imageCount);
    var bucketSize = 5;
    var bucketLabel = getBucketLabel(totalSlidesCount, bucketSize);
    PubSub.publish('qowt:logBucket', {
      'from': 'point',
      'value': {
        'label': bucketLabel,
        'imageCount': imageCount,
        'totalSlidesCount': totalSlidesCount,
        'loadedSlidesCount': _slideLoadedCounter
      }
    });

    PubSub.unsubscribe(_contentCompleteToken);
    _contentCompleteToken = undefined;
  }

  function getBucketLabel(count, bucketSize) {
    var floorValue = Math.floor(count/bucketSize);
    var ceilValue = Math.ceil(count/bucketSize);

    var startBucket = 0;
    var endBucket = 0;

    if (floorValue === ceilValue) {
      startBucket = ( floorValue * bucketSize ) - bucketSize + 1;
    } else {
      startBucket = ( floorValue * bucketSize ) + 1;
    }
    endBucket = ( ceilValue * bucketSize );

    return 'bucket_' + startBucket + '_' + endBucket;
  }

  function recordToGA(label, value) {
    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'raw-data',
      action: 'ViewingFullContent',
      label: label,
      value: value
    });
  }

  return _api;
});