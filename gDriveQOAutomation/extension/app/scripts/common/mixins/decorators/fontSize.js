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
  'qowtRoot/utils/converters/converter',
  'qowtRoot/models/env',
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
  Converter,
  EnvModel,
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['siz'],

    observers: [
      'sizChanged_(model.rpr.siz)'
    ],

    get siz() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.siz);
    },

    set siz(value) {
      this.setInModel_('rpr.siz', value ? parseFloat(value) : undefined);
    },

    sizChanged_: function(current) {
      // TODO(jliebrand): this unit information should be part of
      // this elements model?
      var unit = EnvModel.fontUnit || 'pt';

      if (current !== undefined) {
        switch (unit) {
          case 'pt':
            break;
          case 'em':
            current = Converter.pt2em(current);
            break;
          default:
            throw new Error('Unsupported font unit conversion.');
        }

        this.style.fontSize = parseFloat(current) + unit;
      } else {
        this.style.fontSize = '';
      }

      // If the font size for whole paragraph changes only then it should
      // affect the bullet size. This is inline with Google Docs and MSO.
      if (this.parentElement && this.parentElement.nodeName === 'P' &&
          this.parentElement.getAttribute('qowt-list-type') &&
          this.isParagraphFontSizeChanged() &&
          this.parentElement.customStyle) {
        this.parentElement.customStyle['--paragraph-font-size'] =
            current + 'pt';
        this.parentElement.updateStyles();
      }
    },

    /**
     * Check the font size for all spans in paragraph.
     * @return {boolean} True if font size for all spans has changed,
     * otherwise false
     */
    isParagraphFontSizeChanged: function() {
      var paraFontSizeChanged = true;
      Array.from(this.parentElement.children).forEach(function(span) {
        if (span && span.style && span.style.fontSize !== this.style.fontSize) {
          paraFontSizeChanged = false;
        }
      }, this);
      return paraFontSizeChanged;
    },

    computedDecorations_: {
      siz: function(computedStyles) {
        // if this element has the value in it's model then we do not need to
        // look in to the computed style at all, otherwise use computedStyles.
        // Note: computedStyle is ALWAYS in px, but there are rounding issues
        // Thus the pt value we get back can be a float, which should be
        // rounded as needed by the client calling this function. See:
        // http://jsbin.com/cikamibapi/1/edit?html,css,js,console,output
        var computedVal = this.siz ||
            Converter.cssSize2pt(computedStyles.fontSize);

        return computedVal;
      }
    }

  });

  return api_;

});
