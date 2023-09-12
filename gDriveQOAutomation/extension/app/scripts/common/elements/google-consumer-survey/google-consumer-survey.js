define([
  'qowtRoot/utils/localStorageManager',
  'qowtRoot/utils/uuid',
  'third_party/seedrandom/seedrandom.min',
  'utils/timeUtils'
  ], function(LocalStorageManager, UUIDUtils, seedRandom, TimeUtils) {

  'use strict';

  var PROD_SERVER = 'https://www.google.com';

  var SURVEY_URL = PROD_SERVER +
      '/insights/consumersurveys/async_survey?force_http=1&site=';
  var GRACE_PERIOD = 90 * TimeUtils.DAY_IN_MS;
  var PREFIX = '__GCS_';
  var MAX_UNSIGNED_SHORT = 65535;


  window.GoogleConsumerSurvey = Polymer({
    is: 'google-consumer-survey',
    properties: {
      /**
       * Mandatory siteId. Unique identifier for the survey to run
       *
       * @attribute siteId
       * @type string
       * @default ''
       */
      siteId: {reflect: false, value: ''},

      /**
       * Specifies the percentage of users that should be surveyed. If not
       * defined then it will always survey the user.
       *
       * @attribute targetPercentage
       * @type number
       * @default undefined
       */
      targetPercentage: {reflect: false, value: undefined},

      /**
       * Number of weeks to "bucket" users in to. This ensures that anyone that
       * is sampled for a survey will not be sampled again for n weeks. This is
       * disabled (eg value: undefined) by default. When it is disabled, the
       * user will not be surveyed more than once within the GRACE_PERIOD
       *
       * NOTE: when using bucketing the targetPercentage is calculated over the
       * bucket size, not the total users...
       *
       * @attribute bucketing
       * @type number
       * @default undefined
       */
      bucketing: {reflect: false, value: undefined}

    },


    created: function() {
      var existingUUID = LocalStorageManager.getItem(PREFIX + 'uuid');
      this.UUID = existingUUID || UUIDUtils.generateUUID();
      LocalStorageManager.setItem(PREFIX + 'uuid', this.UUID);
      window._402 = window._402 || {};
      window._402.promptHandlerUrl =
          "https://www.google.com/insights/consumersurveys/gk/prompt";
    },


    attached: function() {
      if (this.shouldLaunchSurvey_()) {
        this.launchSurvey_();
      }
    },

    // ------------------------ private ---------------------------

    shouldLaunchSurvey_: function() {
      var shouldLaunch = false;
      if (this.targetPercentage || this.bucketing) {
        // Sample the user if the results have been stale for one week
        if (this.surveyResultsStale_(TimeUtils.WEEK_IN_MS)) {
          shouldLaunch = this.sampleUser_();
        }
      } else {
        shouldLaunch = this.surveyResultsStale_(GRACE_PERIOD);
      }
      return shouldLaunch;
    },


    // Determine if this user should be sampled and thus shown a survey. We use
    // the second part of the UUID as it handily provides us with a range
    // between 0-65535. We divide that up in to the required buckets. We take
    // the bucket for the current week number, and then only 'sample' users that
    // fall within our desired target percentage of that particular bucket.
    sampleUser_: function() {
      var userSampled = false;
      var idPart = parseInt(this.UUID.split('-')[1], 16);
      var bucketSize = this.bucketing ? (MAX_UNSIGNED_SHORT / this.bucketing) :
          MAX_UNSIGNED_SHORT;

      var week = TimeUtils.weekSinceEpoch();
      var weekMod = week % (this.bucketing || 1);
      var lower = weekMod * bucketSize;
      var higher = lower + bucketSize;

      // only consider user if he falls in "this weeks bucket"
      if (idPart >= lower && idPart < higher) {
        this.fire('user-considered-for-sampling');
        // use pseudo random number generator, seed with idPart * weekNumber
        // to see if this user falls within our targetPercentage
        var pseudoRndGen = seedRandom(idPart * week);
        var rnd = pseudoRndGen();
        var rate = this.targetPercentage === undefined ?
            1 : (this.targetPercentage / 100);
        if (rnd < rate) {
          this.fire('user-sampled-for-survey');
          userSampled = true;
        }
      }
      return userSampled;
    },


    /**
     * @param {Number} periodInMs the number of miliseconds after which to
     *     determine the results are stale; and that thus we should survey again
     * @return {Boolean} true if the results are stale relative to the given
     *     periodInMs. Note, if the user was never surveyed before, we also
     *     return true
     */
    surveyResultsStale_: function(periodInMs) {
      var stale = true;
      var itemKey = PREFIX + 'site_' + this.siteId;
      var lastSurveyedTimestamp = LocalStorageManager.getItem(itemKey);
      if (lastSurveyedTimestamp) {
        var timeSincePrevious = (Date.now() - lastSurveyedTimestamp);
        stale = timeSincePrevious > periodInMs;
      }
      return stale;
    },


    launchSurvey_: function() {
      if (!this.siteId || this.siteId.length === 0 || !this.parentNode) {
        console.warn('<google-consumer-survey>: missing siteId!');
      } else {
        this.scriptTag = document.createElement('script');
        this.scriptTag.src = SURVEY_URL + this.siteId;
        this.appendChild(this.scriptTag);
        this.userSurveyed = true;
        LocalStorageManager.setItem(PREFIX + 'site_' + this.siteId, Date.now());
      }
    }

  });


  return {};
});
