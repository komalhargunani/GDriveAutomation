define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase',
  'qowtRoot/utils/converters/converter',
  'third_party/lo-dash/lo-dash.min'], function(
    MixinUtils,
    DecoratorBase,
    Converter
    /*lo-dash*/) {

  'use strict';

  var tabIndex_, tab_, customTabs_;

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['tabs'],

    observers: [
      'tabChanged_(model.ppr.tabs)'
    ],

    attached: function() {
      this.updateParagraphTabStopRuns_();
    },

    get tabs() {
      return _.get(this, 'model.ppr.tabs');
    },

    set tabs(value) {
      this.setInModel_('ppr.tabs', value);
    },

    tabChanged_: function(current) {
      if (current) {
        this.updateParagraphTabStopRuns_();
      }
    },

    computedDecorations_: {
      tab: function(/* computedStyles */) {
        return _.get(this, 'model.ppr.tabs');
      }
    },

    /**
     * The custom tab stop details are in paragraph's ppr property or in
     * office styles.This function calculates the padding value based on the
     * tab style and the tab value. This padding value is applied to run which
     * represents tab char.
     */
    updateParagraphTabStopRuns_: function() {
      // tab stop will work for header and footer content only
      if (this.getAttribute('qowt-paratype') === 'hf-para') {
        var tabs = this.querySelectorAll('span[qowt-runtype=qowt-tab]');
        if (tabs.length > 0) {
          var prevTab;
          tabIndex_ = 0;
          this.setCustomTabStops_();
          this.clearTabStops_();
          _.forEach(tabs, function(tab) {
            tab_ = tab;
            this.calculateTabIndex_(prevTab);
            this.calculateAndApplyPadding_();
            tabIndex_++;
            prevTab = tab_;
          }.bind(this));
        }
      }
    },

    calculateTabIndex_: function(prevTab) {
      if (this.isTabStartsOnNewLine_(prevTab)) {
        tabIndex_ = 0;
      }
      var previousSibling = tab_.previousSibling;
      if (customTabs_ &&
          previousSibling && previousSibling instanceof QowtWordRun) {
        var parentLeft = this.parentNode.getBoundingClientRect().left;
        var previousSiblingRight =
            previousSibling.getBoundingClientRect().right;
        while ((tabIndex_ < customTabs_.length) &&
            (previousSiblingRight >
            Converter.twip2px(customTabs_[tabIndex_].pos) + parentLeft)) {
          tabIndex_++;
        }
      }
    },

    /**
     * Returns true if current tab starts on new line.
     *
     * @param {element} prevTab - previous tab element
     * @returns {boolean} Returns true if current tab starts on new line
     */
    isTabStartsOnNewLine_: function(prevTab) {
      return (prevTab && (this.getElementsRectValue_(prevTab, 'top') <
          this.getElementsRectValue_(tab_, 'top')));
    },

    /**
     * This function calls getBoundingClientRect() api on provided element and
     * returns corresponding value.
     *
     * @param {element} elm - HTML element
     * @param {element} side - one of dimension from DOMRect (left/right/top/
     * bottom/height/width)
     * @returns {number} Returns corresponding value from DOMRect
     */
    getElementsRectValue_: function(elm, side) {
      var rect = elm && elm.getBoundingClientRect();
      return rect[side];
    },

    /**
     * Sets custom tabs stop information from paragraphs model or office
     * styles.
     */
    setCustomTabStops_: function() {
      var customTabStops = this.tabs;
      var tabStops = this.getTabsFromStyle();
      if (tabStops) {
        customTabStops = customTabStops ? customTabStops : [];
        _.forEach(tabStops, function(tab) {
          if (!_.find(customTabStops, ['pos', tab.pos])) {
            customTabStops.push(tab);
          }
        });
        customTabStops = _.sortBy(customTabStops, ['pos']);
      }
      customTabs_ = customTabStops;
    },

    /**
     * Returns tabs stop information from office styles.
     * @return {object}
     */
    getTabsFromStyle: function() {
      var tabStops;
      var classNames = this.classList;
      var stylePrefix = 'qowt-stl-', styles;
      var officeStyles = document.getElementById('qowtOfficeStyles');
      for (var i = 0; i < classNames.length && !tabStops; i++) {
        // remove the style prefix 'qowt-stl-' from class name
        var className = classNames[i].substring(stylePrefix.length);
        styles = officeStyles.getStyle(className);
        tabStops = _.get(styles, 'ppr.tabs');
      }
      return tabStops;
    },

    /**
     * It calculates and apply the padding value to run which represents
     * tab char.
     */
    calculateAndApplyPadding_: function() {
      // default tab width is 48px.
      var defaultTabWidth = 48;
      var tabPaddingValue, tabPos = defaultTabWidth, customTab = false,
          tabType = 'left';
      if (customTabs_ && (tabIndex_ < customTabs_.length)) {
        // Custom tab stop positions are in twips
        tabPos = Converter.twip2px(customTabs_[tabIndex_].pos);
        tabType = customTabs_[tabIndex_].align;
        customTab = true;
      }
      var section = this.parentNode;
      if (customTab && this.isTabRequiresPadding_(section, tabPos)) {
        tabPaddingValue = tabPos - this.calculateTabPosWRTSection_(section) -
            this.getElementsRectValue_(tab_, 'width');
      } else {
        // tab is of type default. Subtract the tab width from default tab
        // width.
        tabPaddingValue =
            defaultTabWidth - this.getElementsRectValue_(tab_, 'width');
      }
      var trailingSpansWidth = this.getTrailingSpansWidth_();
      switch (tabType) {
        case 'center' :
          tabPaddingValue = tabPaddingValue - (trailingSpansWidth / 2);
          break;
        case 'right' :
          tabPaddingValue = tabPaddingValue - trailingSpansWidth;
          break;
      }
      tab_.style.paddingLeft = tabPaddingValue + 'px';
    },

    /**
     * Returns width of trailing spans that cover all the text to be shown after
     * the specified tab element.
     *
     * @returns {number} returns width of trailing spans of tab element
     */
    getTrailingSpansWidth_: function() {
      var rightSiblingWidth = 0;
      var rightSibling = tab_.nextElementSibling;
      while (rightSibling &&
          rightSibling.getAttribute('qowt-runtype') !== 'qowt-tab') {
        rightSiblingWidth += this.getElementsRectValue_(rightSibling, 'width');
        rightSibling = rightSibling.nextElementSibling;
      }
      return rightSiblingWidth;
    },

    /**
     * This function checks if tab is custom tab stop and it requires padding
     * value.
     *
     * @param {element} section - section element
     * @param {number} tabPos - custom tab stop position
     * @returns {boolean} return the true if tab is custom and it requires
     * padding value.
     */
     isTabRequiresPadding_: function(section, tabPos) {
        return (this.calculateTabPosWRTSection_(section) < tabPos);
     },

    /**
     * This function returns horizontal tab element position w.r.t section.
     *
     * @param {element} section - section element
     * @returns {number} return horizontal tab element position w.r.t section.
     */
    calculateTabPosWRTSection_: function(section) {
      return (this.getElementsRectValue_(tab_, 'right') -
          this.getElementsRectValue_(section, 'left'));
    },

    /**
     * It removes the entry from the object where tab style is 'clear'.
     */
    clearTabStops_: function() {
      // <w:tab w:val="clear" w:pos="2160" />
      // For value 'clear', ECMA says that the current tab stop is cleared
      // and shall be removed and ignored when processing the
      // contents of this document
      for (var ind = customTabs_ && customTabs_.length - 1; ind >= 0; ind--) {
        if (customTabs_[ind].align === 'clear') {
          customTabs_.splice(ind, 1);
        }
      }
    }
  });

  return api_;

});
