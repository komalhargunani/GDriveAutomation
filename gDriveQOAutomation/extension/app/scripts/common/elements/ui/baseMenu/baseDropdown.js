define([
  'qowtRoot/utils/converters/caseConverter',
  'qowtRoot/utils/i18n',
  'common/elements/ui/focus-manager-behavior/focus-manager-behavior'
], function(
    CaseConverter,
    I18n
    /* FocusManagerBehavior */) {

  'use strict';

  var kCmd_ = 'cmd-';

  window.QowtBaseDropdownBehaviorImpl = {
    properties: {
      icon: String,
      src: String,
      active: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        observer: 'activeChanged_'
      }
    },

    hostAttributes: {
      'role': 'button',
      'actsAs': 'dropdown',
      'aria-haspopup': 'true'
    },

    listeners: {
      'blur': 'onBlur_',
      'click': 'onDropdownClick_',
      'mouseover': 'showToolTip_',
      'mouseout': 'hideToolTip_',
      'tap': 'hideToolTip_'
    },

    itemsGroup_: '',

    ready: function() {
      this.selectable = this.getSelectableQuery();
      this.focusOnHover = true;
      this.focusItemOnFocusReceived = false;

      var ariaLabel = CaseConverter.camelCase2_(this.name) +
          '_aria_spoken_word';
      this.setAttribute('aria-label', I18n.getMessage(ariaLabel));
      this.setAttribute('tabindex', "-1");
      this.id = kCmd_ + this.name;
      this.itemsGroup_ = this.getNewItems_();
      Polymer.dom(this).appendChild(this.itemsGroup_);
      Polymer.dom(this).flush();
    },

    /**
     * Deactivate the sub-menu/ drop down
     * @private
     */
    onBlur_: function(event) {
      window.FocusManagerBehaviorImpl.onBlur_.apply(this, arguments);
      // Force menu to close on focus lost
      if(!event || !event.currentTarget.contains(event.relatedTarget)) {
        this.itemsGroup_.blurAllItems && this.itemsGroup_.blurAllItems();
        this.active = false;
      }
    },

    /**
     * On active, displays the drop-down, collapses otherwise
     * @param {Boolean} active - button state
     * @private
     */
    activeChanged_: function(active) {
      if (this.isOpen() || !this.disabled) {
        this.$.collapse.style.display = active ? 'block' : 'none';
        this.setAttribute('aria-expanded', active ? 'true' : 'false');
      }
    },

    /**
     * This function is used in E2E's
     * @return {Object} - items in this element
     */
    getItemsGroup: function() {
      return this.itemsGroup_;
    },

    /**
     * TODO(umesh.kadam): change the function name to getNewItemsGroup_
     * Returns the new button group.
     * Note: This function should be overridden
     * @private
     */
    getNewItems_: function() {
      throw (new Error('getNewItems_ is not overridden for ' +
          this.name));
    },

    isOpen: function() {
      return _.get(this.$, 'collapse.style.display') === 'block';
    },

    isActive: function() {
      return this.active;
    },

    isOkayToNavigate_: function() {
      return this.isOpen();
    },

    /**
     * This will show the toolTip for the dropdown button.
     * @private
     */
    showToolTip_: function(/*evt*/) {
      if (!this.disabled && !this.isOpen()) {
        var button = {
          name: this.id.slice(kCmd_.length),
          dimensions: this.getBoundingClientRect(),
          shortCut: this.shortCut
        };

        var mainToolbar = document.getElementById('main-toolbar');
        var toolTip = mainToolbar.$.tooltip;
        toolTip.show(button);
      }
    },

    /**
     * This will hide the toolTip for drop down
     * @private
     */
    hideToolTip_: function() {
      var mainToolbar = document.getElementById('main-toolbar');
      var toolTip = mainToolbar.$.tooltip;
      toolTip.hide();
    },

    toggleActive_: function(event) {
      var key = _.get(event, 'detail.key');
      var isUpDownKey = (key === 'down' || key === 'up');
      if (isUpDownKey && !this.isOpen() || key === 'enter') {
        this.active = !this.active;
      }
    },

    onDropdownClick_: function() {
      this.focus();
    }
  };

  window.QowtBaseDropdownBehavior = [
    FocusManagerBehavior,
    window.QowtBaseDropdownBehaviorImpl
  ];

  return {};
});
