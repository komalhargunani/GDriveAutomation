define([
  'qowtRoot/pubsub/pubsub',
  'common/elements/ui/menuItems/qowt-point-edit-item/qowt-point-edit-item'
  ], function(
    PubSub
    /*QowtPointEditItemBehavior*/
  ) {

  'use strict';

  window.QowtDuplicateSlideItem = Polymer({
    is: 'qowt-duplicate-slide-item',

    behaviors: [
      QowtPointEditItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String
    },

    /**
     * @override
     * @param {Boolean} isDisabled Sets the menu item disabled state. The item
     *     is disable on a 'qowt:lockScreen' signal and enabled on a
     *     'qowt:unlockScreen' signal.
     */
    enableHandler: function(makeDisabled) {
      this.isEditLocked = makeDisabled;
      this.disabled = makeDisabled || this.presentationEmpty;
    },


    /**
     * @override
     * @param {Boolean} isEmpty True if presentation empty otherwise False.
     *     Set in response to 'qowt:presentationEmpty' and
     *     'qowt:presentationNonEmpty' pubsub signals.
     */
    presoEmptyHandler: function(isEmpty) {
      this.presentationEmpty = isEmpty;
      this.disabled = isEmpty || this.isEditLocked;
    },

    /**
     * Slide duplication is handled by the thumbnailstrip tool. It could be that
     * the slide tool is currently active, so prior to sending a request action
     * we first force the thumbnailstrip tool to be active by requesting a
     * bogus focus change.
     *
     * @public
     * @param {Object} activateEvent A core-activate event.
     */
    onActivate: function(/*acvtivateEvent*/) {
      PubSub.publish('qowt:clearSlideSelection');
      PubSub.publish('qowt:requestFocus', {contentType: 'slideManagement'});
    }
  });

  return {};
});

