define([
  'common/mixins/decorators/bulletDecoratorBase',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/mixinUtils',
  'qowtRoot/drawing/color/colorUtility'
], function(BulletDecoratorBase, DecoratorBase, MixinUtils, ColorUtility) {

  'use strict';


  var api_ = MixinUtils.mergeMixin(DecoratorBase, BulletDecoratorBase, {

    supports_: ['bulletColor', 'bulletColorFollowText'],

    observers: [
      'colorChanged_(model.ppr.bulletColor)',
      'colorChanged_(model.ppr.bulletColorFollowText)'
    ],

    get bulletColor() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletColor);
    },

    set bulletColor(value) {
      this.setInModel_('ppr.bulletColor', value);
    },

    get bulletColorFollowText() {
      return (this.model && this.model.ppr &&
          this.model.ppr.bulletColorFollowText);
    },

    set bulletColorFollowText(value) {
      this.setInModel_('ppr.bulletColorFollowText', value);
    },

    colorChanged_: function(/* current */) {
      var beforeRule = this.getBulletStyle() || {};
      delete beforeRule.color;
      if (this.bulletColor) {
        var rgbaColor = ColorUtility.getColor(this.bulletColor);
        if (rgbaColor) {
          beforeRule.color = rgbaColor + ' !important';
        }
      }
      this.setBulletStyle(beforeRule);
    },

    computedDecorations_: {
      bulletColor: function(/* computedStyles */) {
        // Get computed styles for before pseudo class for this paragraph.
        var computedStylesBefore = window.getComputedStyle(this, 'before');
        return computedStylesBefore.color;
      },
      bulletColorFollowText: function(/* computedStyles */) {
        return !!this.bulletColorFollowText;
      }
    },

    onFirstRunChanged_: {
      bulletColor: function() {
        // If explicit bullet color is not specified then we will fallback to
        // first run's color.
        if (this.firstChild && this.firstChild instanceof QowtPointRun) {
          var beforeFollowTextRule = this.getFollowStyle();
          var rgbaColor =
              this.firstChild.getComputedDecorations().fill.color.clr;
          beforeFollowTextRule.color = rgbaColor;
          if (this.bulletColorFollowText) {
            // bulletColorFollowText property is set for the bullet so
            // take that as highest priority
            beforeFollowTextRule.color += ' !important';
          }
          this.setFollowStyle(beforeFollowTextRule);
        }
      }
    }
  });

  return api_;

});
