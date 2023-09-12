/**
 * @fileoverview A Text Tool action handler to handle requestAction for
 * setting any of the paragraph formatting like style, alignment, etc on the
 * current selection.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'common/elements/customSelector',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/textTool'], function(
    CustomSelector,
    PubSub,
    TextTool) {

  'use strict';

  // PRIVATE ===================================================================

  var _supportedActions = [
      'style',
      'textAlignLeft',
      'textAlignCenter',
      'textAlignRight',
      'textAlignJustify',
      'toggleBulleted',
      'toggleNumbered',
      'pointToggleBullet',
      'pointToggleNumber',
      'formatParagraph'];

  /**
   * Register our supported actions with the tool.
   *
   * @private
   */
  function _onLoad() {
    TextTool.registerActionHandler(
      _supportedActions,
      _handleFormatting);
  }

  /**
   * Generate actions for every selected element that supports
   * the particular requested formatting
   *
   * @param {object} actionData
   * @private
   */
  function _handleFormatting(actionData) {
    if (actionData.context.formatting) {
      var formattingActions = Object.keys(actionData.context.formatting);
      var elements = CustomSelector.findAllInSelectionChain(formattingActions);
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];

        PubSub.publish('qowt:doAction', {
          'action': 'format',
          'context': {
            contentType: 'text',
            command: {
              eid: el.getAttribute('qowt-eid'),
              formatting: actionData.context.formatting
            }
          }
        });
      }
    }
  }

  // register when this module is loaded - it has no public api.
  _onLoad();
  return {};

});
