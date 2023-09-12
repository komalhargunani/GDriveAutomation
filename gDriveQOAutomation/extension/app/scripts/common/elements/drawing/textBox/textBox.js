define([
  'common/mixins/decorators/internalMargins',
  'common/mixins/decorators/shapeBackgroundColor',
  'common/mixins/decorators/shapeBorder',
  'common/mixins/decorators/shapeSize',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowChildren',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/i18n'
  ], function(
    InternalMargins,
    ShapeBackgroundColor,
    ShapeBorder,
    ShapeSize,
    MixinUtils,
    QowtElement,
    FlowChildren,
    PubSub,
    I18n) {

  'use strict';

  var textBoxProto = {
    is: 'qowt-text-box',

    // The DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it.
    etp: 'textBox',

    properties: {
      /** @type {Boolean} If text box editing is enabled. */
      editingEnabled: { type: Boolean, value: false, reflectToAttribute: true },

      /** Describes if the textbox is being edited. @type {Boolean} */
      active: { type: Boolean, value: false, reflectToAttribute: true }
    },

    listeners: {
      'click': 'handleClick_'
    },

    hostAttributes: {
      contenteditable: 'false',
      drawingelm: 'true'
    },

    attached: function() {
      if (this.parentNode && this.parentNode.reLayout) {
        this.parentNode.reLayout();
      }
      if (this.editingEnabled_) {
        this.handleMouseDown = this.handleMouseDown_.bind(this);
        document.addEventListener('mousedown', this.handleMouseDown);
        // TODO(cuiffo): Move to html file when editing is enabled.
        this.contentEditable = 'true';
      }
    },


    detached: function() {
      if (this.editingEnabled_) {
        document.removeEventListener('mousedown', this.handleMouseDown);
      }
    },


    /**
     * Handles the click event by opening up a dialog that will allow a user to
     * know that we are working on textbox editing. Clicking on a link in this
     * dialog will allow them to send a feedback report requesting the feature.
     * TODO(cuiffo): Remove this when editing is enabled, as well as making it
     * so that the check for editing is not needed in attached/detached.
     */
    handleClick_: function() {
      var dialog = new QowtRememberDialog();
      dialog.subtype = "textbox_editing";
      dialog.callback = function(type) {
        if (type === 'report') {
          PubSub.publish('qowt:doAction', {
            action: 'reportIssue',
            context: {
              contentType: 'common',
              description: I18n.getMessage('feedback_textbox_editing')
            }
          });
        }
      };
      dialog.showRememberDialog();
    },


    /**
     * Handles the mouse down event by checking if our textbox was in the event
     * path. We must check the entire path because if the textbox is contained
     * in the header/footer, the event target will be modified to be above the
     * shadow DOM. If we were clicked, activate the textbox.
     * @param {MouseEvent} evt The mousedown event.
     */
    handleMouseDown_: function(evt) {
      var context;
      if (evt && evt.path) {

        // Crawl up event path to find if we were clicked.
        for (var i = 0; i < evt.path.length; ++i) {
          if (evt.path[i] === this) {
            context = this.createContext_();
            this.active = true;
            PubSub.publish('qowt:requestFocus', context);
            return;
          }
        }

        if (this.active) {
          context = this.createContext_();
          this.active = false;
          PubSub.publish('qowt:requestFocusLost', context);
        }
      }
    },


    /**
     * Creates a context focused on this text box that can be focused on.
     * @private
     */
    createContext_: function() {
      var context = document.createRange();
      var firstContentElement = this.firstChild || this;
      if (firstContentElement) {
        context.setStart(firstContentElement, 0);
        context.setEnd(firstContentElement, 0);
      }
      context.contentType = 'text';
      context.scope = this;

      /** @return {Boolean} If a new context cannot be stacked on this one. */
      context.preStackAddition = function() {
        this.active = false;
        return true;
      }.bind(this);

      return context;
    }
  };

  window.QowtTextBox = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      FlowChildren,

      // decorator mixins
      InternalMargins,
      ShapeBackgroundColor,
      ShapeBorder,
      ShapeSize,

      textBoxProto));

  return {};
});
