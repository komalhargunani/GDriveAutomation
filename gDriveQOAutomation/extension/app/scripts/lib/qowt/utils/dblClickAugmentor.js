/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * simple module which augments the mouse down events on the window
 * object. If two mouse down events happen withing a given time
 * threshold and within a given location threshold (hit area), then it
 * will augment the mouse down event with a dblClick === true boolean
 */
define([
  'qowtRoot/utils/domListener'], function(DomListener) {

  'use strict';

  // default time threshold is 500 ms
  // default hit threshold is 5 px (either side)
  var _kDefaultTimeThreshold = 500,
      _kDefaultHitThreshold = 5;

  var _api = {
    /**
     * start augmenting mouse down events
     *
     * @param timeThreshold {number} optional time threshold in ms. Defaults to
     *                               500ms
     * @param hitThreshold {number} optional value for hit area to count
     *                              the second mouse down as being in the same
     *                              place. Defaults to 5 (px either side)
     */
    start: function(timeThreshold, hitThreshold) {
      _timeThreshold = timeThreshold || _kDefaultTimeThreshold;
      _hitThreshold= hitThreshold || _kDefaultHitThreshold;

      DomListener.addListener(window, 'mousedown', _augmentMouseDown, true);
    },

    /**
     * stop augmenting mouse down events
     */
    stop: function() {
      _cache = {
        timestamp: undefined,
        x: undefined,
        y: undefined
      };
      DomListener.removeListener(window, 'mousedown', _augmentMouseDown, true);
    }
  };


  // vvvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  var _timeThreshold = _kDefaultTimeThreshold,
      _hitThreshold = _kDefaultHitThreshold,
      _cache = {
        timestamp: undefined,
        x: undefined,
        y: undefined
      };

  function _augmentMouseDown(event) {
    var date = new Date();
    var currentTime = date.getTime();

    // do we have any cached mouse down info?
    if (_cache.timestamp !== undefined) {

      // check to see if this mouse down occured within our threshold
      var timeTaken = currentTime - _cache.timestamp;
      if (timeTaken < _timeThreshold) {

        // now check to see if the location is within our hitThreshold
        if ((_cache.x !== undefined) && (_cache.y !== undefined)) {

          var offsetX = Math.abs(_cache.x - event.x);
          var offsetY = Math.abs(_cache.y - event.y);

          if ((offsetX < _hitThreshold) && (offsetY < _hitThreshold)) {
            event.dblClick = true;
          }
        }
      }
    }
    _cache.timestamp = currentTime;
    _cache.x = event.x;
    _cache.y = event.y;
  }

  return _api;
});