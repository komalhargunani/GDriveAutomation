define([  'qowtRoot/utils/platform',], function(Platform) {

'use strict';

  var _api = {

    /**
     * Platform independent function to determine if the keys pressed
     * is a save key compbo
     * @returns {boolean} True if key press is 's' and
     *    if platform is OSX, metaKey flag is true
     *    for other platform, ctrlKey flag is true
     */
      isSaveKeyCombo: function(event) {
        var keyS = event.key && event.key.toLowerCase() === 's';
        var metaKey = Platform.isOsx ? event.metaKey : event.ctrlKey;
        return keyS && metaKey;
      },
      isUndoRedoCombo: function(event) {
        var keyS = event.key &&
          (event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'y');
        var metaKey = Platform.isOsx ? event.metaKey : event.ctrlKey;
        return keyS && metaKey;
      }
  };
  return _api;
});