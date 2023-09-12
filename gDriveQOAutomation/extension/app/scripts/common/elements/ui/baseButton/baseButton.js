define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/ui/verbalizationHelper',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n'
  ], function(
    MixinUtils,
    QowtElement,
    VerbalizationHelper,
    MessageBus,
    EnvModel,
    PubSub,
    I18n) {

  'use strict';

  window.QowtBaseButtonBehaviorImpl = {
    properties: {
      icon: String,
      src: String,
      blurOnClick: {
        type: Boolean,
        value: true
      }
    },

    listeners: {
      mouseover: 'showToolTip',
      mouseout: 'hideToolTip',
      'blur': 'onBlur_'
    },

    keyBindings: {
      // NOTE(elqursh): Here we modify the enter handler to additionally handle
      // the event.
      'enter:keydown': 'onEnterKey_'
    },

    hostAttributes: {
      'role': 'button',
      'tabindex': '-1'
    },

    action: '',
    formatCode: '',

    /**
     * Polymer callback on element creation.
     * @private
     */
    created: function() {
      this.id = 'cmd-' + this.action;
    },

    ready: function() {
      // Default buttons to toggle
      this.toggles = true;

      if (this.action !== '') {
        var ariaLabel = I18n.getMessage(this.action.toLowerCase() +
            '_aria_spoken_word');
        if (this.shortCut) {
          var shortCutLabel = VerbalizationHelper.getShortCutLabel_(this);
          this.setAttribute('aria-label', ariaLabel + ' ' + shortCutLabel);
        } else {
          this.setAttribute('aria-label', ariaLabel);
        }
      }
    },

    /** @param {boolean} active Whether the button should be active or not. */
    setActive: function(active) {
      this.active = !!active;
    },

    /**
     * Needed for legacy support (e.g., in tests that check isActive()).
     * return {boolean} Whether the button is active or not.
     */
    isActive: function() {
      return this.active;
    },

    isToggleButton: function() {
      return this.toggles;
    },

    onBlur_: function(event) {
      if(event && event.relatedTarget &&
        !this.checkJustifyButton_(event.relatedTarget)) {
        if((this.checkJustifyButton_(this)) && this.active) {
          this.parentElement.parentElement._setFocusedItem(null);
        }
      }
    },

    checkJustifyButton_: function(element) {
      return (element.tagName === 'QOWT-JUSTIFY-RIGHT-BUTTON' ||
      element.tagName === 'QOWT-JUSTIFY-FULL-BUTTON' ||
      element.tagName === 'QOWT-JUSTIFY-CENTER-BUTTON' ||
      element.tagName === 'QOWT-JUSTIFY-LEFT-BUTTON');
    },

    /** @override */
    _tapHandler: function(event) {
      Polymer.IronButtonStateImpl._tapHandler.apply(this, arguments);
      this.triggerAction_(event);
      if (this._loseFocus(event)) {
        PubSub.publish('qowt:buttonbar:button:actionPerformed', {});
        if (document.activeElement.tagName === 'QOWT-TOOLBAR') {
          document.activeElement.blur();
        }
      }
    },
    /**
     * If the event is click or tap or the button pressed is print then we 
     * should lose focus.
     * @param {*} event 
     */
     _loseFocus: function(event) {
      return event && (event.type === 'tap' || event.type === 'click' ||
        (event.detail && event.detail.keyboardEvent && 
        (event.detail.keyboardEvent.target.id === 'cmd-print' ||
        (event.detail.keyboardEvent.target
          instanceof QowtMergeButton &&
          (document.activeElement.parentElement
          .classList.contains('qowt-dialog-menu')))
        ))
      );
    },
    onEnterKey_: function(event) {
      event.detail.keyboardEvent.preventDefault();
      var currentTarget = event.detail.keyboardEvent.currentTarget;
      if(currentTarget &&
        (currentTarget instanceof QowtMergeButton ||
        (currentTarget.classList.contains('qowt-button-addShape-dropdown') ||
        (currentTarget instanceof QowtBoldButton) ||
        (currentTarget instanceof QowtUnderlineButton) ||
        (currentTarget instanceof QowtStrikethroughButton) ||
        (currentTarget instanceof QowtItalicButton) ||
        (currentTarget instanceof QowtZoomToFitButton)))) {
          event.detail.keyboardEvent.stopPropagation();
      }
      this._tapHandler(event);
    },

    /** @protected */
    triggerAction_: function(/* event */) {
      var actionContext = {
        formatting: {}
      };
      this.setFormattingByButtonState_(actionContext.formatting, this.active);

      if (EnvModel.app === 'sheet' || EnvModel.app === 'point') {
        actionContext.set = this.active;
      }

      // Some actions are not possible on current selection(Ex: merging partial
      // selection). And some actions show a confirm dialog, user has an option
      // to accept the action or cancel it. Toggling the state of button on such
      // scenarios is tricky. We could verify such actions beforehand/ aftermath
      // by introducing functions like isActionPossible_/ wasActionPerformed_
      // and toggle the state of the button accordingly. They are tricky
      // because some actions are core driven(Ex: actions in sheet) and some are
      // not; wasActionPerformed_() would have to wait until core responds. This
      // complicates things. Instead toggle the button before publishing the
      // action and let the setActiveByContext_ set the state if the action is
      // performed.
      this.setActive(!this.active);
      PubSub.publish('qowt:requestAction', {
        action: this.action,
        context: actionContext
      });

      // Check if we track the interaction within Analytics.
      // The message must specify at least an Analytics category and
      // the action itself.
      MessageBus.pushMessage({
        id: 'recordEvent',
        category: 'button-bar',
        action: this.action});
    },

    /**
     * @protected
     */
    setFormattingByButtonState_: function(formatting, buttonState) {
      formatting[this.formatCode] = buttonState;
    },

    /**
     * This will show the toolTip for the baseButton.
     */
    showToolTip: function() {
      var button = {
        name: this.id.slice(4),
        dimensions: this.getBoundingClientRect(),
        shortCut: this.shortCut
      };

      var mainToolbar = document.getElementById('main-toolbar');
      var toolTip = mainToolbar.$.tooltip;
      toolTip.show(button);
    },

    /**
     * This will hide the toolTip for all the QOWT Base buttons on mouse hover.
     */
    hideToolTip: function() {
      var mainToolbar = document.getElementById('main-toolbar');
      var toolTip = mainToolbar.$.tooltip;
      toolTip.hide();
    }
  };

  // Behaviors have to be defined on the global object
  window.QowtBaseButtonBehavior = [
    Polymer.IronButtonState,
    Polymer.IronControlState,
    MixinUtils.mergeMixin(QowtElement, window.QowtBaseButtonBehaviorImpl)
  ];

  return {};
});
