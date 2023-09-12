/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-conversion-animation element.
 *
 * @author cuiffo@google.com (Eric Cuiffo)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  ], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-conversion-animation',

    properties: {
      /**
       * Value of the animated attribute on the <qowt-animated-dots> element.
       * @type {Boolean}
       * @public
       */
      animated: {type: Boolean, value: true},


      /**
       * The name of the app currently running, used to set the images.
       * @type {String}
       * @public
       */
      app: {
        type: String,
        value: '',
        observer: 'appChanged'
      }
    },

    /**
     * If app is changed (or set), this will update the classnames of the icon
     * elements. These classnames point to images for the icons.
     * @public
     */
    appChanged: function(current, previous) {
      if (previous) {
        this.$.leftIcon.classList.remove('icon-' + previous);
        this.$.rightIcon.classList.remove('icon-' + previous + '-gdocs');
      }

      if (current) {
        this.$.leftIcon.classList.add('icon-' + current);
        this.$.rightIcon.classList.add('icon-' + current + '-gdocs');
      }
    }
  };

  /* jshint newcap: false */
  window.QowtConversionAnimation =
      Polymer(MixinUtils.mergeMixin(QowtElement, api_));
  /* jshint newcap: true */

  return {};
});
