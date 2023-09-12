define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n'
], function(
    PubSub,
    I18n) {

  'use strict';

  /**
   * Create the context and publish the event to show the promo message for
   * shortcut keys updates.
   * @private
   */
  function publishShortcutUpdatePromo_() {
    var context = {};
    context.name = 'showShortcutUpdate';
    context.headerText = I18n.getMessage('updated_shortcut_title');
    context.messageText = I18n.getMessage('updated_shortcut_message');
    context.additionalAction = function() {
      var dialog = new QowtKeyboardShortcutsDialog();
      dialog.show();
    };
    PubSub.publish('qowt:promoMessage', context);
  }

  (function() {
    PubSub.subscribe('qowt:contentReceived', publishShortcutUpdatePromo_);
  })();

  return;
});
