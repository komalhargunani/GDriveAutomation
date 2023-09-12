define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/drawing/removeOverlay',
  'qowtRoot/commands/text/textCommandManifest',
  'qowtRoot/contentMgrs/contentManagerBase'], function(
    CommandManager,
    RemoveOverlay,
    TextCommands,
    ContentManagerBase) {

  'use strict';

  var kContentType_ = 'text';
  var prevContentTypeWasDrawing = false;
  var customCalls_ = {
    breakRun: breakRun_,
    addQowtBreakChar: addQowtBreakChar_
  };

  var TextContentManager = ContentManagerBase.create(kContentType_,
      TextCommands /*supported commands*/);


  TextContentManager.handleAction_ = function(signal, signalData) {
    function actionHasCustomCalls() {
      return _.isFunction(customCalls_[signalData.action]);
    }

    if (signal === 'qowt:doAction') {
      var hasCustomCalls = actionHasCustomCalls();
      var contentType = _.get(signalData, 'context.contentType');
      if (contentType === kContentType_ &&
          TextContentManager.supports[signalData.action] || hasCustomCalls) {
        // insertQowtText and deleteQowtText add a selection or rather select
        // the text based on the range, however for non text elements
        // (ex: drawing elements) this is not true, because there's no range.
        // Such items have an overlay portraying the selection and like
        // insertText, the non text elements have overlays added by respective
        // commands(Ex: addQowtImage). Before processing any text command, such
        // a selection should be removed(if there is any). To do that we add
        // RemoveOverlay command to the command manager.
        if (prevContentTypeWasDrawing) {
          prevContentTypeWasDrawing = false;
          CommandManager.addCommand(RemoveOverlay.create());
        }

        if (hasCustomCalls) {
          customCalls_[signalData.action](signalData);
        } else {
          TextContentManager.createAndAddCmd_(signalData);
        }
      } else if (contentType === 'drawing') {
        prevContentTypeWasDrawing = true;
      }

    }
  };


  function breakRun_(signalData) {
    CommandManager.addCommand(TextCommands.breakRun.create(signalData.context));
  }


  function addQowtBreakChar_(eventData) {
    var cmd;
    if (eventData.context.command.btp === 'pbr') {
      cmd = TextCommands.addQowtPageBreak.create(eventData.context.command);
    } else if (eventData.context.command.btp === 'lbr') {
      cmd = TextCommands.addQowtLineBreak.create(eventData.context.command);
    } else if (eventData.context.command.btp === 'cbr') {
      cmd = TextCommands.addQowtColumnBreak.create(eventData.context.command);
    }
    if (cmd) {
      CommandManager.addCommand(cmd);
    }
  }

  return TextContentManager;
});
