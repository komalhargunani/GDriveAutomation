/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileOverview Office Styles Polymer element.
 * Container for all styles in the Office document and exposes
 * API to add and query the Office document styles.
 * Responsible to write out CSS rules from the Office document styles.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/content/styles/officeStylesBehavior'
], function(
    MixinUtils,
    QowtElement
    /* OfficeStylesBehavior */) {

  'use strict';

  var officeStylesProto = {
    is: 'qowt-office-styles',
    extends: 'style',
    behaviors: [OfficeStylesBehavior],

    ready: function() {
      this.id = 'qowtOfficeStyles';
    }
  };

  /* jshint newcap: false */
  window.QowtOfficeStyles =
      Polymer(MixinUtils.mergeMixin(QowtElement, officeStylesProto));
  /* jshint newcap: true */

  return {};
});
