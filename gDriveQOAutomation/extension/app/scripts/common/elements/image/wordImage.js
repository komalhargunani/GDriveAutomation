define([
  'common/mixins/decorators/backgroundImage',
  'common/mixins/decorators/backgroundSize',
  'common/mixins/decorators/cropImage',
  'common/mixins/decorators/imageHeight',
  'common/mixins/decorators/imageWidth',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/converters/converter'
], function(
    BackgroundImage,
    BackgroundSize,
    CropImage,
    ImageHeight,
    ImageWidth,
    MixinUtils,
    QowtElement,
    PubSub,
    Converter) {

  'use strict';

  var api_ = {
    is: 'qowt-word-image',
    extends: 'span',

    hostAttributes: {
      'contenteditable': 'false',
      'drawingelm': 'true'
    },

    attached: function() {
      if (this.parentNode && this.parentNode.reLayout) {
        this.parentNode.reLayout();
      }
    },

    resize: function(context) {
      this.hgt = this.hgt + Converter.px2twip(context.heightAlteredBy);
      this.wdt = this.wdt + Converter.px2twip(context.widthAlteredBy);
      this.informCore_();
    },

    informCore_: function() {
      var kMutation = 'mutation';
      PubSub.publish('qowt:doAction', {
        action: 'startTransaction',
        context: {contentType: kMutation}
      });

      PubSub.publish('qowt:doAction', {
        action: 'formatElement',
        context: {
          contentType: kMutation,
          eid: this.parentNode.id,
          dpr: this.parentNode.model
        }
      });

      PubSub.publish('qowt:doAction', {
        action: 'formatElement',
        context: {
          contentType: kMutation,
          eid: this.id,
          ipr: this.model.imageProperties
        }
      });

      PubSub.publish('qowt:doAction', {
        action: 'endTransaction',
        context: {contentType: kMutation}
      });
    },

    etp: 'img'
  };

  window.QowtWordImage = Polymer(MixinUtils.mergeMixin(
      // decorator mixins:
      QowtElement,
      BackgroundImage,
      CropImage,
      ImageHeight,
      ImageWidth,
      BackgroundSize,
      api_));

  return {};
});
