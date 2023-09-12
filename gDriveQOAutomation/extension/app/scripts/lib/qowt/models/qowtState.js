define([
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub'], function(
  MessageBus,
  PubSub) {
  'use strict';

  /**
   * Model to keep track of qowt state
   * QOWT has the following states:
   *   opening               - we are starting to open the file
   *   viewingPartialContent - initial content is received and rendered
   *   viewingFullContent    - all content has been rendered
   *   editingPartialContent - the user started an edit session before all
   *                           content was loaded
   *   editingFullContent    - user is editing and all content is loaded
   *   saving                - the edits are being saved; once  after which the
   *                           state will change back to partial/fullContent
   *   fatalError            - a fatal error has occurred (eg "Whoops" screen)
   *   verificationError     - the document is out of sync and requires a reload
   *                           (eg "yikes" dialog)
   * Updates to the model will be placed on the message bus so that the app can
   * be aware of qowt state changes (and update it's "app state")
   */
  var api_ = {
    /**
     * Set a new current state
     * @param {String} state The current state, currently defined as one of:
     *  [downloading', 'loading', 'error', 'partialContent', 'idle']
     *  Clients may pass new arbitrary values
     * @param {Object} context A context object relevant to the current state
     */
    set: function(state, context) {
      set_(state, context);
    },

    /**
     * @return {string} The current qowt state.
     */
    get: function() {
      var state;
      if (mode_ && contentState_) {
        state = mode_ + contentState_;
      }
      return state;
    },

    /**
     * Verifies if the current qowt state indicates full contents of the doc are
     * received while viewing/editing.
     * @returns {boolean} true if full content.
     */
    isContentComplete: function() {
      return !!(this.get() && this.get().indexOf(kFullContentState) !== -1);
    }
  };

  /** @private */
  var kViewingMode_ = 'Viewing',
      kEditingMode_ = 'Editing',
      kFullContentState = 'FullContent',
      kSavingMode_ = 'Saving',
      pubSubTokens_ = [],
      mode_ = kViewingMode_,
      contentState_;

  function docIsDirty_() {
    mode_ = kEditingMode_;
    if (contentState_) {
      set_(mode_ + contentState_, {});
    }
  }

  function docIsSaving_(event, eventData) {
    event = event || {};
    if (eventData && eventData.twoPhaseSave) {
      set_(kSavingMode_);
    }
  }

  function docIsSaved_() {
    mode_ = kViewingMode_;
    if(contentState_) {
      set_(mode_ + contentState_, {});
    }
  }

  function contentReceived_(signal) {
    var contentMap = {
      'qowt:contentReceived': 'PartialContent',
      'qowt:contentComplete': kFullContentState
    };
    contentState_ = contentMap[signal];
    set_(mode_ + contentState_, {});
  }

  function set_(state, context) {
    var stateObj = {
      state: state,
      context: context
    };
    MessageBus.pushMessage({
      id:'stateChange',
      data: stateObj
    });
  }

  /**
   * Triggered by qowt:init signals
   * Initialize the module
   */
  var initialized_ = false;
  function init_() {
    if (!initialized_) {
      pubSubTokens_ = [
        PubSub.subscribe('qowt:contentReceived', contentReceived_),
        PubSub.subscribe('qowt:contentComplete', contentReceived_),
        PubSub.subscribe('qowt:ss:dirty', docIsDirty_),
        PubSub.subscribe('qowt:ss:saving', docIsSaving_),
        PubSub.subscribe('qowt:ss:saved', docIsSaved_)
      ];
      initialized_ = true;
    }
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners and reset internal state
   */
  function disable_() {
    pubSubTokens_.forEach(function(token) {
      PubSub.unsubscribe(token);
    });
    pubSubTokens_ = [];
    mode_ = kViewingMode_;
    contentState_ = undefined;
    initialized_ = false;
  }

  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except subscribe to qowt:init
  // qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
  })();

  return api_;
});
