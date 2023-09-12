/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview API for the qowt-color-swatch element use within color picker
 * widgets (e.g., for choosing text color or highlighting color).
 *
 * @author davidshimel@google.com (David Shimel)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/accessibilityUtils',
  'qowtRoot/utils/navigationUtils',
  ], function(
    MixinUtils,
    QowtElement,
    PubSub,
    AccessibilityUtils,
    NavigationUtils) {

  'use strict';

  var colorSwatchProto = {
    is: 'qowt-color-swatch',

    properties: {
        rgb: { type: String, value: '', observer: 'rgbChanged'},
        selected: {type: Boolean, value: false, observer: 'selectedChanged'},
        formattingProp: { type: String },
        action: {type: String }
    },

    hostAttributes: {
      'role': 'gridcell'
    },

    listeners: {
      'click': 'select'
    },

    focusedPointElement: null,

    ready: function() {
      PubSub.subscribe('qowt:focusedElementInPoint',
        this.setFocusedElementInPoint.bind(this));
    },

    rgbChanged: function(newValue /*, oldValue */) {
      this._getSwatch().style.backgroundColor = newValue;
    },

    // TODO(elqursh): Refactor to use an attribute selector instead of
    // programatically add/remove class
    selectedChanged: function(newValue /*, oldValue */) {
      if(newValue) {
        this._getSwatch().classList.add('selected');
      }
      else {
        this._getSwatch().classList.remove('selected');
      }
    },
    // TODO(elqursh): Remove the transformFunction and create a point specific
    // color swatch. Leaving for now as the colorDropDown is yet to be
    // refactored into a polymer element (crbug/438716).
    /** {function(Object): Object} Function that transforms the RGB color */
    transformFunction: undefined,
    getNode: function() {
      return this;
    },

    addFocus: function() {
      this._getSwatch().classList.remove('blur');
      this._getSwatch().classList.add('focus');
      this._getSwatch().focus();
    },

    removeFocus: function() {
      this._getSwatch().classList.remove('focus');
      this._getSwatch().classList.add('blur');
      this._getSwatch().blur();
    },

    _getSwatch: function() {
      return this.$._swatch;
    },

    getColor: function() {
      return this._getSwatch().style.backgroundColor;
    },

    isSelected: function() {
      return this._getSwatch().classList.contains('selected');
    },

    setFocusedElementInPoint: function(event, eventData) {
      event = event || {};
      this.focusedPointElement = eventData;
    },

    select: function(event) {
      this.selected = true;
      var formatting = {};
      formatting[this.formattingProp] = this.transformFunction ?
          this.transformFunction(this.rgb) : this.rgb;

      PubSub.publish('qowt:requestAction', {
        action: this.action,
        context: {
          formatting: formatting
        }
      });

      // TODO(elqursh): Find a cleaner way to loose focus.
      if (event && (event.type === 'click' || event.type === 'tap') &&
      NavigationUtils.isTargetWithinMainToolbar(document.activeElement)) {
        document.activeElement.blur();
      }

      if(!(event && (event.type === 'keydown'
        && event.detail.key === 'enter'))) {
        AccessibilityUtils.setApplicationSpecificFocusedElement(
          this.focusedPointElement);
      }
    }
  };

  window.QowtColorSwatch =
      Polymer(MixinUtils.mergeMixin(QowtElement, colorSwatchProto));

  return {};
});
