define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/ui/accessibleBehaviors/keyNavigation/upDownKeys',
  'common/elements/ui/baseMenu/baseDropdown'
], function(
    MixinUtils,
    QowtElement
    /*UpDownArrowKeyBehavior*/
    /*baseDropdown*/) {

  'use strict';
  var kFocusedSiblingClass_ = 'focused-sibling';

  var mergeDropdownProto = {
    is: 'qowt-merge-dropdown',
    name: 'mergeDropdown',
    behaviors: [
      UpDownArrowKeyBehavior,
      QowtBaseDropdownBehavior
    ],


    ready: function() {
      this.disable = this.disable_.bind(this);
      this.onSiblingFocus = this.onSiblingFocus_.bind(this);
      this.onSiblingBlur = this.onSiblingBlur_.bind(this);
    },


    attached: function() {
      this.sibling = this.parentElement.children['cmd-merge'];
      if (this.sibling) {
        this.sibling.addEventListener('siblingDisabled', this.disable);
        this.listen(this.sibling, 'mouseover', 'onSiblingFocus_');
        this.listen(this.sibling, 'mouseout', 'onSiblingBlur_');
        this.sibling.addEventListener('siblingFocused', this.onSiblingFocus);
        this.sibling.addEventListener('siblingBlurred', this.onSiblingBlur);
      }
    },


    detached: function() {
      if (this.sibling) {
        this.sibling.removeEventListener('siblingDisabled', this.disable);
        this.unlisten(this.sibling, 'mouseover', 'onSiblingFocus_');
        this.unlisten(this.sibling, 'mouseout', 'onSiblingBlur_');
        this.sibling.removeEventListener('siblingFocused', this.onSiblingFocus);
        this.sibling.removeEventListener('siblingBlurred', this.onSiblingBlur);
      }
    },


    get hasSibling() {
      return !!(this.sibling);
    },

    getSelectableQuery: function() {
      return 'qowt-merge-menu-item-group > qowt-merge-menu-item';
    },

    /**
     * Callback to disable this element. Called when the
     * sibling(i.e mergeButton) is disabled/ enabled
     *
     * @param {Event} customEvent
     * @private
     */
    disable_: function(customEvent) {
      this.disabled = _.get(customEvent, 'detail.disabled');
      if (this.disabled) {
        this.setAttribute('disabled', 'true');
      } else {
        this.removeAttribute('disabled');
      }
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
     * Removes focus from this element when sibling is blurred
     * @private
     */
    onSiblingBlur_: function() {
      this.classList.remove(kFocusedSiblingClass_);
    },


    getNewItems_: function() {
      return new QowtMergeMenuItemGroup();
    }
  };


  window.QowtMergeDropdown =
      Polymer(MixinUtils.mergeMixin(QowtElement, mergeDropdownProto));

  return {};
});
