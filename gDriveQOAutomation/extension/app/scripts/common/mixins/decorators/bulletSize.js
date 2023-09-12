define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'common/mixins/decorators/bulletDecoratorBase',
  'qowtRoot/utils/converters/converter'
], function(MixinUtils, DecoratorBase, BulletDecoratorBase, Converter) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, BulletDecoratorBase, {

    supports_: ['bulletSizePoints', 'bulletSizeFollowText',
      'bulletSizePercentage'],

    observers: [
      'bulletSizeChanged_(model.ppr.bulletSizePoints)',
      'bulletSizeChanged_(model.ppr.bulletSizeFollowText)',
      'bulletSizeChanged_(model.ppr.bulletSizePercentage)'
    ],

    get bulletSizePoints() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletSizePoints);
    },

    set bulletSizePoints(value) {
      this.setInModel_('ppr.bulletSizePoints', value);
    },

    get bulletSizePercentage() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletSizePercentage);
    },

    set bulletSizePercentage(value) {
      this.setInModel_('ppr.bulletSizePercentage', value);
    },

    get bulletSizeFollowText() {
      return (this.model &&
          this.model.ppr &&
          this.model.ppr.bulletSizeFollowText);
    },

    set bulletSizeFollowText(value) {
      this.setInModel_('ppr.bulletSizeFollowText', value);
    },


    bulletSizeChanged_: function() {
      var sizePts;

      if (this.bulletSizePoints !== undefined) {
        // As per ECMA, points are specified in increments of 100 starting
        // with 100 being a point size of 1. So divide by 100 to get actual
        // point value;
        sizePts = this.bulletSizePoints / 100;
      } else {
        if (this.firstChild && this.firstChild instanceof QowtPointRun) {
          sizePts = this.firstChild.getComputedDecorations().siz;
        }
      }

      var beforeRule = this.getBulletStyle() || {};
      delete beforeRule['font-size'];
      if (sizePts) {
        var sizeEm = Converter.pt2em(sizePts);
        if (this.bulletSizePercentage !== undefined) {
          // change the sizeEm value as per bulletSizePercentage
          sizeEm = sizeEm * this.bulletSizePercentage / 100;
        }
        beforeRule['font-size'] = sizeEm + 'em !important';
      }
      this.setBulletStyle(beforeRule);
    },

    computedDecorations_: {
      bulletSizePoints: function(/* computedStyles */) {
        if (this.bulletSizePoints) {
          // Get computed styles for before pseudo class for this paragraph.
          var computedStylesBefore = window.getComputedStyle(this, 'before');
          return Converter.cssSize2pt(computedStylesBefore.fontSize);
        }
      },
      bulletSizeFollowText: function() {
        // TODO (tushar.bende): Rectify below logic.
        return (this.bulletSizeFollowText || (!this.bulletSizePoints &&
            !this.bulletSizePercentage));
      },
      bulletSizePercentage: function(/* computedStyles */) {
        var textSizeInPoint;
        if (this.bulletSizePercentage) {

          if (this.firstChild && this.firstChild instanceof QowtPointRun) {
            textSizeInPoint = this.firstChild.getComputedDecorations().siz;
          }

          var computedStylesBefore = window.getComputedStyle(this, 'before');
          var bulletSizeInPoint =
              Converter.cssSize2pt(computedStylesBefore.fontSize);
          return Math.round(bulletSizeInPoint * 100 / textSizeInPoint);
        }
      }
    },

    onFirstRunChanged_: {
      bulletSize: function() {
        this.bulletSizeChanged_();
      }
    }
  });
  return api_;
});
