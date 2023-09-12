/**
 * This handles the logic to show notifications to the user in a promo message
 * dialog.
 * Any change in the updated QO release can be notified to user with this one
 * time notification. Once shown, user will not be prompted again with the same
 * notification even in the further release.
 *
 * Notifications can be triggered by publishing 'qowt:promoMessage' event.
 * The context for event is populated with the notification details as below:
 *    context.name: A key from promoKeys maps in this handler. This is unique
 *                  for the scenarios where promo message is to be shown.
 *    context.headerText: The title to be set for the promo message dialog.
 *    context.messageText: The message to be shown in the promo message dialog.
 *    context.additionalAction: The action to be taken when the user clicks the
 *                  "Learn more" link in the message body of dialog.
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub'
  ], function(
    Features,
    PubSub) {

  'use strict';

  /**
   * A map which is used for identifying if the promo message dialog is to be
   * shown or already shown.
   * The keys are the names unique for every scenario where promo messages is to
   * be shown.
   * Value against the key is unique for every scenario. The presence of this
   * value in local storage indicates that the promo message for this scenario
   * is NOT to be shown. Prefixing the values with 'promo_' will help in
   * searching the local storage for items related to promo messages.
   * However for a given scenario, if we need to show the promo message again in
   * any further release due to some updates, use a new value in the map against
   * the old key/scenario name.
   * @type {Object.<String, String>}
   */
  var promoKeys = {
    'showShortcutUpdate': 'promo_shortcutUpdate'
  };

  var api_ = {

    /**
     * Indicates if the promo message for the named scenario is to be shown or
     * not.
     * @param name The name which identifies the scenario for which the promo
     * message is to be shown. This name has to be present in the promoKeys map.
     * @returns {boolean} true if promo is yet to be shown to the user.
     */
    isPromoEnabled: function(name) {
      var promoItem = promoKeys[name];
      return !!(subscribedForPromo_ &&
        promoItem && !(window.localStorage.getItem(promoItem) === 'true'));
    },

    /**
     * This is helper function to be used in tests to enable promo messaging.
     */
    subscribeForPromo: function() {
      promosSubscription_ = PubSub.subscribe(
        'qowt:promoMessage', showPromoMessageDialog_);
      subscribedForPromo_ = true;
    }
  };

  var dialog_,
      promosSubscription_,
      currentPromoKey_,
      subscribedForPromo_ = false,
      suppress_ = false;

  function init_() {
    if (!(suppress_ || Features.isEnabled('suppressPromoMessages'))) {
      var earlierVersion = window.localStorage.getItem('qoVersion');
      if (earlierVersion) {
        promosSubscription_ = PubSub.subscribe(
          'qowt:promoMessage', showPromoMessageDialog_);
        subscribedForPromo_ = true;
      } else {
        disablePromoMessages_();
      }
      window.localStorage.setItem('qoVersion',
        chrome.runtime.getManifest().version);
    }
  }

  function showPromoMessageDialog_(signal, signalData) {
    signal = signal || '';
    var promoKey = promoKeys[signalData.name];
    if (promoKey && !dialog_ && !Features.isEnabled('suppressPromoMessages')) {
      currentPromoKey_ = promoKey;
      var storedKey = window.localStorage.getItem(promoKey);
      if (!(storedKey === 'true')) {
        openDialog_(signalData);
      }
    }
  }

  function openDialog_(context) {
    dialog_ = new QowtPromoMessageDialog();
    dialog_.headerText = context.headerText;
    dialog_.messageText = context.messageText;
    dialog_.additionalAction = context.additionalAction;
    dialog_.show();
    dialog_.addEventListener('dialog-closed', storePromoKey_);
  }

  function storePromoKey_() {
    if (dialog_) {
      dialog_.removeEventListener('dialog-closed', storePromoKey_);
      window.localStorage.setItem(currentPromoKey_, 'true');
      dialog_ = undefined;
    }
  }

  /**
   * Disable the showing of promo messages for all scenarios by storing their
   * values in local storage.
   * @private
   */
  function disablePromoMessages_() {
    _.forEach(promoKeys, function(value) {
      window.localStorage.setItem(value, 'true');
    });
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers.
   */
  function disable_() {
    PubSub.unsubscribe(promosSubscription_);
    suppress_ = true;
    subscribedForPromo_ = false;
  }

  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
  })();

  return api_;
});
