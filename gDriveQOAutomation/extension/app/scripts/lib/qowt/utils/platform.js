define([], function() {
  'use strict';

  /**
   * @constructor
   * Platform information, provides:
   *    Platform.name;      {String}
   *    Platform.locale;    {String}
   *    Platform.isOther;   {Boolean}
   *    Platform.isUnix;    {Boolean}
   *    Platform.isWindows; {Boolean}
   *    Platform.isOsx;     {Boolean}
   *    Platform.isLinux;   {Boolean}
   *    Platform.isCros;    {Boolean}
   */
  var Platform = Object.create(
    Object.prototype,
    {
      name:      { get: function() { return platform_; }},
      locale:    { get: function() { return locale_; }},
      isOther:   { get: function() { return (platform_ === 'OTHER'); }},
      isUnix:    { get: function() { return (platform_ === 'UNIX'); }},
      isWindows: { get: function() { return (platform_ === 'WINDOWS'); }},
      isOsx:     { get: function() { return (platform_ === 'OSX'); }},
      isLinux:   { get: function() { return (platform_ === 'LINUX'); }},
      isCros:    { get: function() { return (platform_ === 'CROS'); }}
    }
  );

  /** @private */

  var platform_,
      locale_;

  (function init_() {
    platform_ = 'OTHER';
    var appVersion = navigator.appVersion.toLowerCase();
    if (appVersion.indexOf('x11') !== -1) {
      platform_ = 'UNIX';
    }
    if (appVersion.indexOf('win') !== -1) {
      platform_ = 'WINDOWS';
    }
    if (appVersion.indexOf('mac') !== -1) {
      platform_ = 'OSX';
    }
    if (appVersion.indexOf('linux') !== -1) {
      platform_ = 'LINUX';
    }
    if (appVersion.indexOf('cros') !== -1) {
      platform_ = 'CROS';
    }
    locale_ = navigator.language.toUpperCase();
  })();

  return Platform;
});
