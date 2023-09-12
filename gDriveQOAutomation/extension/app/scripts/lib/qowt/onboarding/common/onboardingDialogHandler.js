// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview The Onboarding Dialog Handler contains the logic
 * for greeting the user on first-time-use. By encapsulating the
 * logic inside a module, we make it easier to extend this welcome
 * dialog as well as provide a mechanism to disable the dialog in
 * consistent way.
 *
 * For example, the onboarding dialog should not open as part of
 * standard E2E testing. Otherwise, each test would fail because
 * the welcome dialog is waiting to be clicked.
 *
 * @author jonbronson@google.com (Jonathan Bronson)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/features/utils',
  'qowtRoot/utils/localStorageManager'], function(
  PubSub,
  Features,
  LocalStorageManager) {

  'use strict';

  var api_ = {
    /**
     * Used to suppress the dialog that appears the first
     * time the user opens a document with Quickoffice.
     */
    suppressDialog: function() {
      suppress_ = true;
    },

    /**
     * Used to unsuppress the dialog that appears the first
     * time the user opens a document with Quickoffice.
     */
    unsuppressDialog: function() {
      suppress_ = false;
    },

    /**
     * Shows the onboarding dialog. Only for testing purposes, should not be
     * called in the app.
     */
    showDialog: function() {
      showDialog_();
    }
  };

  // VVVVVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVVVV

  var onboardingComplete_ = false,
      suppress_ = false,
      contentReceivedSubscription_,
      dialog_;

  /**
   *  Presents the dialog to the user if suppression disabled
   */
  var showDialog_ = function() {

    // do not display if suppression is turned on
    if (isSupressed_()) {
      return;
    }

    dialog_ = new QowtOnboardingDialog();
    dialog_.addEventListener('close', storeFirstTimeFlag_);
    dialog_.show();
  };

  /*
   * Helper method to write first usage flag to localStorage
   */
  var storeFirstTimeFlag_ = function() {
    if (dialog_) {
      dialog_.removeEventListener('dialog-closed', storeFirstTimeFlag_);
      dialog_ = undefined;
    }
    LocalStorageManager.setItem('onboardingComplete', 'true');
    onboardingComplete_ = true;
    // TODO: This is a hack to solve
    // https://issues.quickoffice.com/browse/CQO-545.
    // This looks like a bug in chrome. After the onboardingDialogue is closed,
    // it not possible to scroll the document using trackpad. For some reason,
    // chrome feels that there is no content to scroll. Surprisingly it is
    // possible to scroll document using keyboard and scrollbars. The problem
    // goes away if browser relayouts the document. For ex, if the developer
    // window is opened, it causes the browser to relayout the document and the
    // problem goes away. This problem is difficult to reproduce as it is file
    // specific.
    // The following statements are used to cause a relayout. Since this extra
    // relayout happens only once per user, it doesn't hurt the performance as
    // such.
    var element = document.getElementById('qowt-doc-container');
    if (element) {
      element.style.webkitTransform = 'scale(1)';
    }
  };

  /*
   * Helper method to check if dialog is being suppressed
   */
  var isSupressed_ = function() {
    return Features.isEnabled('suppressFirstTimeDialog') ||
           suppress_;
  };

  /**
   * Triggered by qowt:init signals
   * Initializes the module state by checking for first time
   * flag in localStorage and subscribing to content signal.
   */
  var initialized_ = false;
  function init_() {
    onboardingComplete_ = LocalStorageManager.getItem('onboardingComplete');
    if (!onboardingComplete_ && !initialized_) {
      contentReceivedSubscription_ = PubSub.subscribe(
        'qowt:contentReceived', showDialog_,
        {after: false, once: true});
      initialized_ = true;
    }
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners,
   * and reset all internal state.
   */
  function disable_() {
    PubSub.unsubscribe(contentReceivedSubscription_);
    onboardingComplete_ = false;
    suppress_ = false;
    initialized_ = false;
  }

  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except
  // subscribe to qowt:init qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
  })();

  return api_;

});
