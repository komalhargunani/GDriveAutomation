define([], function() {

  'use strict';

  var api_ =  {
    DAY_IN_MS: 86400000, // 1000 * 60 * 60 * 24
    WEEK_IN_MS: 604800000, // 1000 * 60 * 60 * 24 * 7

    /**
     * @return {Number} returns the week number since epoch
     */
    weekSinceEpoch: function() {
      var msSinceEpoch = Date.now();
      var weeksSinceEpoc = msSinceEpoch / this.WEEK_IN_MS;
      return Math.ceil(weeksSinceEpoc);
    }

  };

  return api_;
});
