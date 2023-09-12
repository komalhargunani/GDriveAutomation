define([
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/models/fileInfo',
    'qowtRoot/pubsub/pubsub'
  ], function (
    MessageBus,
    FileInfo,
    PubSub) {

    'use strict';

    var _contentCompleteToken;
    var _startTime;
    var _bucketToken;
    var _bucketData;
    var _loadingTime;
    var _api = {
      init: function () {
        _startTime = Date.now();
        _contentCompleteToken =
          PubSub.subscribe('qowt:contentComplete', logData);
        _bucketToken =
          PubSub.subscribe('qowt:logBucket', logBucketData);
      }
    };

    function logData () {
      var loadingTime = Date.now() - _startTime;
      MessageBus.pushMessage({
        id: 'recordEvent',
        category: 'raw-data',
        action: 'ViewingFullContent',
        label: 'totalLoadingTime_ms',
        value: loadingTime
      });

      PubSub.publish('qowt:logBucket',{
        'from': 'fileLoad',
        'value': loadingTime
      });
      if (FileInfo.app !== 'sheet') {
        PubSub.unsubscribe(_contentCompleteToken);
        _contentCompleteToken = undefined;
      }
    }

    function logBucketData(event, eventData) {
      event = event || '';
      switch (eventData.from) {
        case 'word':
        case 'sheet':
        case 'point':
          _bucketData = eventData.value;
          break;
        case 'fileLoad':
          _loadingTime = eventData.value;
          break;
      }

      if (_bucketData !== undefined && _loadingTime !== undefined) {
        switch (FileInfo.app) {
          case 'word':
            logWordBucketData();
            break;
          case 'sheet':
            logSheetBucketData();
            break;
          case 'point':
            logPointBucketData();
            break;
          default:
            throw new Error('missing app; failed to initialise');
        }
      }
    }

    function logWordBucketData() {
      recordToGA(_bucketData.label + '_loadingTime_ms', _loadingTime);
      recordToGA(_bucketData.label + '_pageCount', _bucketData.pageCount);
      recordToGA(_bucketData.label + '_wordCount', _bucketData.wordCount);
      recordToGA(_bucketData.label + '_imageCount', _bucketData.imageCount);

      PubSub.unsubscribe(_bucketToken);
      _bucketToken = undefined;
    }

    function logSheetBucketData() {
      recordToGA(_bucketData.label + '_loadingTime_ms', _loadingTime);
      recordToGA(_bucketData.label + '_rowsCount', _bucketData.rowsCount);
      recordToGA(_bucketData.label + '_columnsCount', _bucketData.colsCount);
      recordToGA(_bucketData.label + '_imageCount', _bucketData.imageCount);
      recordToGA(_bucketData.label + '_nonEmptyCellsCount',
          _bucketData.nonEmptyCellsCount);
      if(FileInfo.extension === 'csv') {
        recordToGA(_bucketData.label + '_fileSize_bytes', FileInfo.fileSize);
      }
    }

    function logPointBucketData() {
      recordToGA(_bucketData.label + '_loadingTime_ms', _loadingTime);
      recordToGA(_bucketData.label + '_imageCount', _bucketData.imageCount);
      recordToGA(_bucketData.label + '_totalSlidesCount',
          _bucketData.totalSlidesCount);
      recordToGA(_bucketData.label + '_loadedSlidesCount',
          _bucketData.loadedSlidesCount);

      PubSub.unsubscribe(_bucketToken);
      _bucketToken = undefined;
    }

    function recordToGA(label, value) {
      MessageBus.pushMessage({
        id: 'recordEvent',
        category: 'bucketed-data',
        action: 'ViewingFullContent',
        label: label,
        value: value
      });
    }

    return _api;
  });