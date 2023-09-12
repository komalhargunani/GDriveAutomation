define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/utils/errorUtils',
    'utils/analytics/googleAnalytics'
  ], function(
    PubSub,
    ErrorUtils,
    GA)
 {

  'use strict';

  /**
   * An error observer that logs the callstack of exceptions to GA.
   * @param {Error} error
   */
  function handleError(error) {
    if (state_ === 'idle') {
      var gaError = {
        msg: ErrorUtils.stripStack(error) || error.message ||
             error.name || 'unknown error',
        fatal: error.fatal
      };
      console.log('GA logging as:', gaError);
      GA.sendException(gaError);
      state_ = (error.fatal) ? 'fatal exception logged' : state_;
    }
  }


  /** @private We Son't log more errors to GA after the 1st fatal exception. */
  var state_ = 'idle';

  function resetState_() {
    state_ = 'idle';
  }


  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except subscribe to qowt:init
  // qowt:disable or qowt:destroy.
  (function() {
    PubSub.subscribe('qowt:init', resetState_);
    // We don't do anything on disable; which is called on unit test end, but
    // ALSO on fatal errors... and we don't want to reset our state on fatal
    // errors, as that would mean logging them.
  })();


  return handleError;
});
