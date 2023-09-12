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
 * DateFormatter class handles the formatting of date value according to the
 * given format.
 *
 * @author upasana.kumari
 * @date  9/14/12
 */

define(['qowtRoot/utils/qoIntlFallback'],
  function(QOIntlFallback) {

  'use strict';

    var _languageFormatter = window.v8Intl || window.Intl || QOIntlFallback;

    /**
     * Formats the date value to a specific format.
     * Note:
     * Other considerations include the format or "datepart" specifiers: none
     * other than 'yyyy' and 'yy' will be parsed as the year; months and days
     * have the usual four flavors of fullname (mmmm), three-letter (mmm) ,
     * numeric (mm - single value month will be prefixed by zero like 8 becomes
     * 08, but 11 will be 11), numeric single(m - here 8 will be displayed as 8
     * and 11 as 11, won't prefixed by zero), same four formats will be adhered
     * by Day.hours (hh) can be rectified to the 12-hour format with the am/pm
     * specifier, and minutes (nn) and seconds (ss) may also be specified.
     *
     * @param format desired date format
     * @param dateObj date object which needs to be formatted
     * @param lang formatting language. If not provided, default is english.
     */

    var _api = {


      formatDate: function(format, dateObj, lang) {
        var date;
        /*
         * languageSet is collection of language code in an array.
         * V8Intl / Intl uses it for fallback mechanism among specified
         * languages.
         * (priority is from lower index to higher)
         */
        var languageSet = [];

        if (typeof lang === 'string') {
          languageSet.push(lang);
        }
        /*
         * To ensure that we fallback to english when v8Intl/Intl is not able
         * to consume DCP sent language,
         * we explicitly add english to the language set.
         */
        languageSet.push("en");

        if (!(dateObj instanceof Date)) {
          throw "Exception: This is not a date object";
        } else {
          date = dateObj;
        }
        /**
         * A date with a value of 0 returns a non-breaking space.
         */
        if (!dateObj.valueOf()) {
          return  ' ';
        }
        /*
         * if date format is not present the default format is m/d/yy.
         * Microsoft office uses this format as default fortmat.
         */
        if (!format) {
          format = 'M/d/yy';
        }

        /*The regular expression looks for any of the bracketed pattern
         * characters, or for the very specific am/pm match.
         */
        return format.
          replace(/(yyyy|yy|y|MMMM|MMM|MM|M|dddd|ddd|dd|d|hh|h|mm|ss|am\/pm)/gi,
          function($1) {
          var h;
          switch ($1) {
            case 'yyyy':
              return date.getFullYear();
            case 'y':
            case 'yy':
              return (date.getFullYear() % 100);
            case 'MMMM':
              return _languageFormatter.DateTimeFormat(languageSet,
                {month: 'long'}).format(date);
            case 'MMM':
              return _languageFormatter.DateTimeFormat(languageSet,
                {month: 'short'}).format(date);
            case 'MM':
              return _padZero((date.getMonth() + 1), 2);
            case 'M':
              return _padZero((date.getMonth() + 1), 1);
            case 'dddd':
              return _languageFormatter.DateTimeFormat(languageSet,
                {weekday: 'long'}).format(date);
            case 'ddd':
              return _languageFormatter.DateTimeFormat(languageSet,
                {weekday: 'short'}).format(date);
            case 'dd':
              return _padZero(date.getDate(), 2);
            case 'd':
              return _padZero(date.getDate(), 1);
            case 'HH':
              return _padZero(((h = date.getHours()) ? h : 12), 2);
            case 'h':
              return _padZero(((h = date.getHours() % 12) ? h : 12), 1);
            case 'mm':
              return _padZero((date.getMinutes()), 2);
            case 'ss':
              return _padZero((date.getSeconds()), 2);
            case 'am/pm':
              return (date.getHours() < 12 ? 'AM' : 'PM');
            default:
              return undefined;
          }
        });
      }
    };


    /**
     * prefixes a number with zero the specified number of times, up to the
     * number's character length, i.e. 8 turns into 08, but 11 remains 11.
     *
     * @param val value of the date i.e. month, day, or year.
     * @param opt_len length of the value, for example if val is 'dd' then its
     *        length will be 2.
     * Note: Argument len is optional, with default value 2.
     */
    var _padZero = function(val, opt_len) {
      val = String(val);
      opt_len = opt_len || 2;
      while (val.length < opt_len) {
        val = "0" + val;
      }
      return val;
    };

    return _api;

  });









