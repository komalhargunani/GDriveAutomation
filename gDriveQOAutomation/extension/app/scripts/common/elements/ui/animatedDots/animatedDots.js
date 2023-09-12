/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-animated-dots element.
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
    is: 'qowt-animated-dots',

    properties: {
      /**
       * A value that sets an "animated" attribute on each dot if it is true.
       * CSS selectors target that attribute to make this animated or static.
       * @type {Boolean}
       */
      animated: {type: Boolean, value: true, reflectToAttribute: true}
    }
  };

  /* jshint newcap: false */
  window.QowtAnimatedDots = Polymer(MixinUtils.mergeMixin(QowtElement, api_));
  /* jshint newcap: true */

  return {};
});
