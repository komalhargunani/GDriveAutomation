define([
  'qowtRoot/utils/typeUtils',
  'utils/analytics/googleAnalytics'
], function(
    TypeUtils,
    GA) {

  'use strict';

  var api_ = {
    /**
     * Get the correct localised version of the string identified by strId.
     *
     * @param {String} strId A valid string identifier.
     * @param {Array<String>} substitutions Array of strings to be placed within
     *                        the message as it is. The order of strings in
     *                        array is same as order of appearance in message.
     * eg. If the message is "Hello John. Welcome to Paris" and you would like
     * to substitute the names (John/Paris) dynamically. We can use placeholders
     * in the localised message, like "Hello $USER$. Welcome to $LOCATION$". The
     * substitutions here would be ['John','Paris]. This will result in final
     * expected localised string.
     *
     * @return {String} The correctly localised string, or the string Id
     *                  or an empty string on failure.
     */
    getMessage: function(strId, substitutions) {
      var result = '????';
      if (!chrome || !chrome.i18n) {
        // we're not running in Chrome, this are likely to be unit tests
        return strId;
      }

      if (TypeUtils.isString(strId)) {
        result = chrome.i18n.getMessage(strId, substitutions);
        if (!result) {
          result = strId;
          api_.logError_('Missing translation', strId);
        }
      } else {
        api_.logError_('Invalid string translation Id', strId);
      }
      return result;
    },

    // --------------------- PRIVATE --------------------

    /**
     * Log a localisation failure to the console and to GA.
     *
     * @param {String} message A string to display on the console and GA.
     * @param {String} strId A string identifier, only shown on the console
     */
    logError_: function(message, strId) {
      console.error(message + ' ' + strId);
      // do not include strId in the GA error to protect against accidentally
      // calling getMessage() with text containing user data
      GA.sendException({
        msg: message,
        fatal: false
      });
    }
  };

  return api_;
});
