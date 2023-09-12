/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): rename 'jus' to 'alignment' in dcp schema, core
 * and everywhere else (eg alignButton, these observe functions etc etc)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'third_party/lo-dash/lo-dash.min'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['jus'],

    observers: [
        'jusChanged_(model.ppr.jus)'
    ],

    get jus() {
      return (this.model &&
              this.model.ppr &&
              this.model.ppr.jus);
    },

    set jus(value) {
      this.setInModel_('ppr.jus', value, Object.keys(dcpToCss_));
    },

    jusChanged_: function(current) {
      if (current !== undefined) {
        this.style.textAlign = dcpToCss_[current];
      } else {
        this.style.textAlign = '';
      }
    },

    computedDecorations_: {
      jus: function(computedStyles) {
        if (!computedStyles) {
          return;
        }
        if (!computedStyles['text-align'] ||
            (computedStyles['text-align'] === 'start')) {
          return 'L';
        }
        return cssToDcp_[computedStyles['text-align']];
      }
    }

  });

  // PRIVATE ===================================================================

  var dcpToCss_ = {
    'C': 'center',
    'R': 'right',
    'L': 'left',
    'J': 'justify'
  };
  // reverse map for css2dcp
  var cssToDcp_ = _.transform(dcpToCss_, function(result, num, key) {
    result[num] = key;
  });

  return api_;

});
