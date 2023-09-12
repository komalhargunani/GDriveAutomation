define([
  'qowtRoot/commands/drawing/drawingCommandManifest',
  'qowtRoot/contentMgrs/contentManagerBase',
  'qowtRoot/pubsub/pubsub'], function(
    DrawingCommands,
    ContentManagerBase) {

  'use strict';

  var kContentType_ = 'drawing';
  var DrawingContentManager = ContentManagerBase.create(kContentType_,
      DrawingCommands /*supported commands*/);


  DrawingContentManager.handleAction_ = function(signal, signalData) {
    if (signal === 'qowt:doAction') {
      if (_.get(signalData, 'context.contentType') === kContentType_ &&
          DrawingContentManager.supports[signalData.action]) {
        DrawingContentManager.createAndAddCmd_(signalData);
      }
    }
  };

  return DrawingContentManager;
});
