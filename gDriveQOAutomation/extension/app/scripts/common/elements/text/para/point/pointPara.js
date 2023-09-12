define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/alignment',
  'common/mixins/decorators/indent',
  'common/mixins/decorators/leftMargin',
  'common/mixins/decorators/rightMargin',
  'common/mixins/decorators/level',
  'common/mixins/decorators/bullet',
  'common/mixins/decorators/bulletColor',
  'common/mixins/decorators/bulletFont',
  'common/mixins/decorators/bulletSize',
  'common/mixins/decorators/point/lineSpacing',
  'common/mixins/decorators/point/paraSpacing',

  'common/mixins/text/firstRunObserver',
  'common/mixins/text/maxParaFontSizeObserver',

  'common/elements/text/para/para'
], function(
    MixinUtils,
    Alignment,
    Indent,
    LeftMargin,
    RightMargin,
    Level,
    Bullet,
    BulletColor,
    BulletFont,
    BulletSize,
    LineSpacing,
    ParaSpacing,

    FirstRunObserver,
    MaxParaFontSizeObserver,

    QowtPara) {

  'use strict';

  var api_ = {
    is: 'qowt-point-para',
    extends: 'p',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'para',

    attached: function() {
      this.addBrIfNeeded_();
      this.onMutation(this, this.handleMutations_);
      this.observeFirstRun_();
      Bullet.attached.call(this);
      LineSpacing.attached.call(this);
      this.updateMaxParaFontSize_();
      this.observeRunFontSize_();
    },

    // ----------------------- private -------------------------

    handleMutations_: function() {
      this.addBrIfNeeded_();
      this.onMutation(this, this.handleMutations_);
      this.observeFirstRun_();
    },

    /**
     * Return endParaRPr from the model
     * @return {object}
     * @private
     */
    getEndParaRunProperties_: function() {
      return this.model && this.model.endParaRPr;
    },

    /**
     * @override
     */
    brRequired_: function() {
      var isBrRequired = false;
      if(this.textContent.length === 0) {
        var directBr = this.querySelectorAll(':scope > br:not([qowt-divtype])');
        var indirectBr = this.querySelectorAll('br');
        if(directBr.length === 1 || indirectBr.length === 0) {
          isBrRequired = true;
        }      
      }
      return isBrRequired;
     }
  };


  window.QowtPointPara = Polymer(MixinUtils.mergeMixin(
      QowtPara,
      // basic functionality
      FirstRunObserver,
      MaxParaFontSizeObserver,

      // decorator mixins:
      Alignment,
      Indent,
      LeftMargin,
      RightMargin,
      Level,
      Bullet,
      BulletColor,
      BulletFont,
      BulletSize,
      LineSpacing,
      ParaSpacing,

      // and finally our own api
      api_));

  return {};
});
