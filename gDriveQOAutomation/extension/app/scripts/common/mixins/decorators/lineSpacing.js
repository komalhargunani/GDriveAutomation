/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename 'lsp' to 'lineSpacing',
 * 'lsp.m' to 'mode', 'lsp.v' to 'value' in dcp schema, core
 * and everywhere else
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/converters/converter'], function(
  MixinUtils,
  DecoratorBase,
  ErrorCatcher,
  QOWTSilentError,
  TypeUtils,
  Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['lsp'],

    observers: [
      'lspChanged_(model.ppr.lsp)'
    ],

    get lsp() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.lsp);
    },

    set lsp(value) {
      this.setInModel_('ppr.lsp', value);
    },

    lspChanged_: function(current) {
      if (current !== undefined) {
        setLineSpacing_(this, current.m, current.v);
      } else {
        clearLineSpacing_(this);
      }
    },

    computedDecorations_: {
      lsp: function(computedStyles) {
        if (!computedStyles) {
          return;
        }
        var lsp;
        var value;
        if (this.model.ppr && this.model.ppr.lsp) {
          switch (this.model.ppr.lsp.m) {
            case 'minimum':
              lsp = {
                m: 'minimum',
                v: this.model.ppr.lsp.v
              };
              break;
            case 'exact':
              if (computedStyles.lineHeight === 'normal') {
                value = 'normal';
              } else {
                value = cssToExact_(cssLineHeightAsPoints_(computedStyles));
              }
              lsp = {
                m: 'exact',
                v: value
              };
              break;
            case 'multiplier':
              if (computedStyles.lineHeight === 'normal') {
                value = 'normal';
              } else {
                value = cssToMultiplier_(cssLineHeightAsMultiplier_(
                    computedStyles));
              }
              lsp = {
                m: 'multiplier',
                v: value
              };
              break;
            default:
              lsp = {
                m: this.model.ppr.lsp.m,
                v: this.model.ppr.lsp.v
              };
              break;
          }
        }
        return lsp;
      }
    }

  });

  // PRIVATE ===================================================================

  /**
   * Apply the correct line-spacing CSS value
   * based on the line-spacing mode.
   * @param {this} elm The element this decorator was mixed into.
   * @param {String} mode The line-spacing mode.
   * @param {Number} value The line-spacing value.
   */
  function setLineSpacing_(elm, mode, value) {
    switch (mode) {
      case 'minimum':
        setMinimumLineSpacing_(elm);
        break;
      case 'exact':
        setExactLineSpacing_(elm, value);
        break;
      case 'multiplier':
        setMultiplierLineSpacing_(elm, value);
        break;
      default:
        // Invalid data does not cause exceptions just warnings,
        // this is similar to how the browser handles invalid CSS.
        console.warn('invalid line spacing mode');
        break;
    }
  }


  function setMinimumLineSpacing_(elm) {
    // CSS has no concept of a minimum line-height. You can specify a
    // fixed height, or a line-height multiplier. For now, we will render
    // all 'minimum' lineSpacing settings with normal, single-spaced line
    // spacing.
    elm.style.lineHeight = 'normal';
  }


  function setExactLineSpacing_(elm, value) {
    if (!TypeUtils.isNumber(value)) {
      console.warn('invalid exact line spacing value');
      return;
    }
    if (!TypeUtils.isInteger(value)) {
      console.warn('non-integer exact line spacing value');
      value = parseInt(value, 10);
    }
    elm.style.lineHeight = exactToCss_(value);
  }


  function setMultiplierLineSpacing_(elm, value) {
    if (!TypeUtils.isNumber(value)) {
      console.warn('invalid multiplier line spacing value');
      return;
    }
    elm.style.lineHeight = multiplierToCss_(value);
  }


  function clearLineSpacing_(elm) {
    elm.style.lineHeight = '';
  }


  /* @return {Float} returns the line height in points */
  function cssLineHeightAsPoints_(computedStyles) {
    try {
      var value = Converter.cssSize2pt(computedStyles.lineHeight);
    } catch (e) {
      ErrorCatcher.handleError(
          new QOWTSilentError('Unable to get cssLineHeight as Pts: ' + e));
    }
    return value;
  }


  /* @return {Float} returns the line height computed as a multiplier of the
   * font-size in points */
  function cssLineHeightAsMultiplier_(computedStyles) {
    try {
      var fontSizePT = Converter.cssSize2pt(computedStyles.fontSize);
      var value = (cssLineHeightAsPoints_(computedStyles) / fontSizePT);
    } catch (e) {
      ErrorCatcher.handleError(new QOWTSilentError(
          'Unable to get cssLineHeight as Multiplier: ' + e));
    }
    return value;
  }


  /* Convert exact line-spacing DCP as twips to CSS points. */
  function exactToCss_(value) {
    return Converter.twip2pt(value) + 'pt';
  }


  /* Convert exact line-spacing CSS points to DCP twips. */
  function cssToExact_(value) {
    return Converter.pt2twip(value);
  }


  /* Convert multiplier line-spacing DCP 1/240th to CSS points multiple. */
  function multiplierToCss_(value) {
    var multiple = (value / 240);
    // Correction factor of 1.2. Apparently, a MS Office single line
    // height is a CSS 120% line height. This observation was first noted
    // in Point's textSpacingHandler.
    return (multiple * 1.2);
  }


  /* Convert multiplier line-spacing CSS points multiple to DCP 1/240th. */
  function cssToMultiplier_(value) {
    var multiple = (value / 1.2);
    return (multiple * 240);
  }

  return api_;

});
