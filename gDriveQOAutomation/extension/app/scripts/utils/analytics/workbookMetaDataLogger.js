define([
    'qowtRoot/controls/grid/workbook',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/models/sheet',
    'qowtRoot/pubsub/pubsub'
  ], function (
    Workbook,
    MessageBus,
    SheetModel,
    PubSub) {

    'use strict';

    var _api = {
      init: function () {
        PubSub.subscribe('qowt:contentComplete', logData);
      }
    };

    function logData () {
      var str = '.qowt-sheet-pane #pane-content ';
      var totalCellsWithContent = document.querySelectorAll(str + 'div').length;
      var imageCount = document.querySelectorAll(str + 'img').length;
      recordToGA('nonEmptyCellsCount', totalCellsWithContent);
      recordToGA('imageCount', imageCount);
      recordToGA('rowsCount', Workbook.getNumOfRows());
      recordToGA('columnsCount', Workbook.getNumOfCols());
      recordToGA('sheetsCount', SheetModel.sheetNames.length);

      var bucketSize = 500;
      var bucketLabel = getBucketLabel(totalCellsWithContent, bucketSize);

      PubSub.publish('qowt:logBucket', {
        'from': 'sheet',
        'value': {
          'label': bucketLabel,
          'rowsCount': Workbook.getNumOfRows(),
          'colsCount': Workbook.getNumOfCols(),
          'imageCount': imageCount,
          'nonEmptyCellsCount': totalCellsWithContent
        }
      });
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