define([
  'common/elements/ui/mergeMenuButton/mergeButton/mergeButtonBehavior'
], function(/*mergeButtonBehavior*/) {

  'use strict';
  var kFocusedSiblingClass_ = 'focused-sibling';

  var mergeButtonProto = {
    is: 'qowt-merge-button',
    action: 'merge',
    formatCode: 'merge',
    widgetFormat: 'hasMerge',
    behaviors: [
      QowtMergeButtonBehavior
    ],


    set disable(isDisabled) {
      this.disabled = isDisabled;
      this.fire('siblingDisabled', {disabled: isDisabled});
      if (isDisabled) {
        this.setAttribute('disabled', 'true');
      } else {
        this.removeAttribute('disabled');
      }
    },


    get disable() {
      return this.disabled;
    },


    ready: function() {
      this.icon = 'qo-chrome-icons:merge';
      this.onSiblingFocus = this.onSiblingFocus_.bind(this);
      this.onSiblingBlur = this.onSiblingBlur_.bind(this);
    },


    attached: function() {
      this.sibling = this.parentElement.children['cmd-mergeDropdown'];
      if (this.sibling) {
        this.addListeners_(this.sibling, ['mouseover', 'tap'],
            'onSiblingFocus_');
        this.addListeners_(this.sibling, ['mouseout', 'blur'],
            'onSiblingBlur_');
        this.sibling.addEventListener('siblingFocused', this.onSiblingFocus);
        this.sibling.addEventListener('siblingBlurred', this.onSiblingBlur);
      }
    },


    detached: function() {
      if (this.sibling) {
        this.removeListeners_(this.sibling, ['mouseover', 'tap'],
            'onSiblingFocus_');
        this.removeListeners_(this.sibling, ['mouseout', 'blur'],
            'onSiblingBlur_');
        this.sibling.removeEventListener('siblingFocused', this.onSiblingFocus);
        this.sibling.removeEventListener('siblingBlurred', this.onSiblingBlur);
      }
    },


    get hasSibling() {
      return !!(this.sibling);
    },


    /**
     * Adds focus to this element when sibling is focused
     * @private
     */
    onSiblingFocus_: function() {
      if (!this.disabled) {
        this.classList.add(kFocusedSiblingClass_);
      }
    },


    /**
     * removes focus from this element when sibling is blurred
     * @private
     */
    onSiblingBlur_: function() {
      if (!this.sibling.isOpen()) {
        this.classList.remove(kFocusedSiblingClass_);
      }
    },


    /**
     * Adds event listener on element.
     * @param {Element} elm - element on which event listener is to be added
     * @param {Array} eventsArray - array of event strings
     * @param {String} callBackFuncStr - callback function
     * @private
     */
    addListeners_: function(elm, eventsArray, callBackFuncStr) {
      eventsArray.forEach(function(event) {
        this.listen(elm, event, callBackFuncStr);
      }.bind(this));
    },


    /**
     * removes event listener on element.
     * @param {Element} elm - element on which event listener is to be removed
     * @param {Array} eventsArray - array of event strings
     * @param {String} callBackFuncStr - callback function
     * @private
     */
    removeListeners_: function(elm, eventsArray, callBackFuncStr) {
      eventsArray.forEach(function(event) {
        this.unlisten(elm, event, callBackFuncStr);
      }.bind(this));
    }
  };

  // Every polymer button extended from baseButton is a QowtElement. No need to
  // explicitly mergeMixin QowtElement here
  window.QowtMergeButton = Polymer(mergeButtonProto);

  return {};
});
