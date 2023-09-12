/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename dcp properties to something readable in
 * dcp schema, core and everywhere else
 * (eg toolbar buttons, these observe functions, addNodes/formatNodes etc etc)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/utils/converters/converter'], function(
  MixinUtils,
  DecoratorBase,
  Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['clr'],

    observers: [
      'clrChanged_(model.rpr.clr)'
    ],

    get clr() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.clr);
    },

    set clr(value) {
      this.setInModel_('rpr.clr', value);
    },

    clrChanged_: function(current) {
      if (!current) {
        this.style.color = '';
      } else if (current === 'auto') {
        this.style.color = '#000000';
      } else {
        this.style.color = current;
      }
      // If the font color for whole paragraph changes only then it should
      // affect the bullet color. This is inline with Google Docs and MSO.
      if (this.parentElement && this.parentElement.nodeName === 'P' &&
          this.parentElement.getAttribute('qowt-list-type') &&
          this.isParagraphFontColorChanged() &&
          this.parentElement.customStyle) {
        this.parentElement.customStyle['--paragraph-text-color'] =
            current;
        this.parentElement.updateStyles();
      }
    },

    /**
     * Check the font color for all spans in paragraph.
     * @return {boolean} True if font color for all spans has changed,
     * otherwise false.
     */
    isParagraphFontColorChanged: function() {
      var paraFontColorChanged = true;
      Array.from(this.parentElement.children).forEach(function(span) {
        if (span && span.style &&
            span.style.color !== this.style.color) {
          paraFontColorChanged = false;
        }
      }, this);
      return paraFontColorChanged;
    },

    computedDecorations_: {
      clr: function(computedStyles) {
        // if this element has color in it's model then we do not need to look
        // in to the computed style at all
        var computedVal = this.clr ||
            Converter.colorString2hex(computedStyles.color);

        return computedVal;
      }
    }

  });

  return api_;

});
