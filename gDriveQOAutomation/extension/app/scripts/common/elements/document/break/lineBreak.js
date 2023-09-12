define([
  'common/mixins/decorators/boldText',
  'common/mixins/decorators/fontFace',
  'common/mixins/decorators/fontSize',
  'common/mixins/decorators/italicText',
  'common/mixins/decorators/allCapsText',
  'common/mixins/decorators/blinkText',
  'common/mixins/decorators/embossText',
  'common/mixins/decorators/engraveText',
  'common/mixins/decorators/fontBackground',
  'common/mixins/decorators/fontColor',
  'common/mixins/decorators/hiddenText',
  'common/mixins/decorators/outlineText',
  'common/mixins/decorators/overlineText',
  'common/mixins/decorators/runStyle',
  'common/mixins/decorators/shadowText',
  'common/mixins/decorators/smallCapsText',
  'common/mixins/decorators/strikethroughText',
  'common/mixins/decorators/subscriptText',
  'common/mixins/decorators/superscriptText',
  'common/mixins/decorators/underlineText',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'],
    function(
        BoldText,
        FontFace,
        FontSize,
        ItalicText,
        AllCapsText,
        BlinkText,
        EmbossText,
        EngraveText,
        FontBackground,
        FontColor,
        HiddenText,
        OutlineText,
        OverlineText,
        RunStyle,
        ShadowText,
        SmallCapsText,
        StrikethroughText,
        SubscriptText,
        SuperscriptText,
        UnderlineText,
        MixinUtils,
        QowtElement) {

      'use strict';

      var api_ = {
        is: 'qowt-line-break',
        extends: 'span',

        etp: 'brk',

        created: function() {
          var br = document.createElement("BR");
          this.appendChild(br);
        }

      };

      window.QowtLineBreak = Polymer(MixinUtils.mergeMixin(
          QowtElement,
          BoldText,
          FontFace,
          FontSize,
          ItalicText,
          AllCapsText,
          BlinkText,
          EmbossText,
          EngraveText,
          FontBackground,
          FontColor,
          HiddenText,
          OutlineText,
          OverlineText,
          RunStyle,
          ShadowText,
          SmallCapsText,
          StrikethroughText,
          SubscriptText,
          SuperscriptText,
          UnderlineText,
          api_));

      return {};
    });
