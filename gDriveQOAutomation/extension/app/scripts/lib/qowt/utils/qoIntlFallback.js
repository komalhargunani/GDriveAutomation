// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Fallback for v8Intl / Intl, if not available in platform; with english as
 * the only language
 *
 * @author rahul.tarafdar@quickoffice.com (Rahul Tarafdar)
 * @date  17/01/13
 */
define([],
  function() {

  'use strict';

    var _kMonths = ["January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"];
    var _kWeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday" ];


    var _api = {
      /**
       * Constructs DateTimeFormat object given optional locales and options
       * parameters.
       *
       * @constructor
       * @param langSet langSet the language collection in array form.
       *        It is not used, but present here for signature purpose.
       * @param config the formatting configuration.
       * Note: Currently {weekday : "short"}, {weekday : "long"},
       * {month : "short"}, and {month : "short"} configs are supported
       */
      DateTimeFormat: function(langSet, config) {
        langSet = langSet || [];
        var _apiDateTimeFormat = {
          /**
           * Returns a String value representing the result of date
           * according to the english locale and the formatting options of this
           * DateTimeFormat.
           * @param date
           */
          format: function(date) {
            var toReturn;
            if (config.month) {
              toReturn = _kMonths[date.getMonth()];
            } else if (config.weekday) {
              toReturn = _kWeekDays[date.getDay()];
            }
            if (toReturn) {
              switch (config.month || config.weekday) {
                case 'short':
                  toReturn = toReturn.substr(0, 3);
                  break;
                case 'long':// do nothing
                  break;
                default: // do nothing
                  break;
              }
            }
            return toReturn;
          }
        };
        return _apiDateTimeFormat;
      }

    };

    return _api;

  }
);