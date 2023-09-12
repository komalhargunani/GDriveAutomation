define(['qowtRoot/configs/point',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/cssManager',
  'common/elements/text/run/point/pointRun',
  'third_party/lo-dash/lo-dash.min'], function(
    PointConfig,
    Converter,
    CssManager
    /* QowtPointRun */) {

  'use strict';

  return {
    properties: {
      maxParaFontSize: { type: Number, value: 0 }
    },


    /**
     * This object consists of functions to be invoked when the maxParaFontSize
     * changes. Subscribers who want to observe the maxParaFontSize must add
     * handler functions to this object.
     */
    onMaxParaFontSizeChanged_: {},

    observers: [
      'maxParaFontSizeChanged_(maxParaFontSize)'
    ],

    /**
     * Update the maxParaFontSize. Iterate over all child QowtRun elements.
     */
    updateMaxParaFontSize_: function() {
      // This check is required here, as it is observed that mutation observer
      // callbacks are triggered even after the element is no longer in the dom

      // offsetParent returns the first positioned parent element
      // There are a few cases when offsetParent is null
      // 1. if the position of the element itself is 'fixed'
      // 2. if the display of the element or any of it's ancestors
      //    is set to 'none'
      // 3. if the element is not added in the dom
      if (this.offsetParent) {
        var maxSize = 0;
        _.forEach(this.childNodes, function(child) {
          if (child instanceof QowtPointRun) {
            var fontSize = child.getComputedDecorations().siz;
            maxSize = fontSize > maxSize ? fontSize : maxSize;
          }
        });
        this.maxParaFontSize = maxSize || this.getCascadedFontSize_();
      }
    },

    getCascadedFontSize_: function() {
      var endParaRunProps = this.getEndParaRunProperties_();
      var fontSize = endParaRunProps && endParaRunProps.siz;
      if (!fontSize) {
        var levelSelector = this.getAttribute('qowt-level') ?
            '[qowt-level="' + this.getAttribute('qowt-level') + '"]' :
            ':not([qowt-level])';
        var selector = '.' + this.parentNode.id.replace(/t-/, '') +
            ' p' + levelSelector + ' span';
        var rule = CssManager.getRuleAsString(selector);
        var match = rule && rule.match(/(font-size:)(\d*\.{0,1}\d*\w{2})(;)/);
        fontSize = match ? Converter.cssSize2pt(match[2]) :
            PointConfig.kDEFAULT_FONT_SIZE;
      }
      return fontSize;
    },

    maxParaFontSizeChanged_: function(/*current*/) {
      for (var prop in this.onMaxParaFontSizeChanged_) {
        var propFunc = this.onMaxParaFontSizeChanged_[prop];
        propFunc.call(this);
      }
    },

    observeRunFontSize_: function() {
      var config = {attributeFilter: ['style'], subtree: true};
      this.subtreeStyleObserver =
          new MutationObserver(this.updateMaxParaFontSize_.bind(this));
      this.subtreeStyleObserver.observe(this, config);
    }
  };
});
