/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-platform-anchor element.
 *
 * @author cuiffo@google.com (Eric Cuiffo)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/utils/platform'
  ], function(
    MixinUtils,
    QowtElement,
    Platform) {

  'use strict';

  var api_ = {
    is: 'qowt-platform-anchor',

    attached: function() {
      var url = this.getAttribute(Platform.name) || this.getAttribute('OTHER');
      this.$.anchor.setAttribute('href', url);
    }
  };

  var QowtPlatformAnchorProto = MixinUtils.mergeMixin(QowtElement, api_);

  window.QowtPlatformAnchor = Polymer(QowtPlatformAnchorProto);

  return {};
});
