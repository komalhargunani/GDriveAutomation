
define([
  'common/elements/ui/menuItems/qowt-point-edit-item/qowt-point-edit-item'
  ], function(
    /*QowtPointEditItemBehavior*/
  ) {

  'use strict';

  window.QowtSlideUnhideItem = Polymer({
    is: 'qowt-slide-unhide-item',

    behaviors: [
      QowtPointEditItemBehavior
    ],

    properties: {
      icon: String,
      src: String,
      label: String
    },

    /**
     * @private
     * @override
     * @param {Boolean} isDisabled Sets the menu item disabled state.
     * @param {String} signal The PubSub signal we are handling.
     * @param {Object} signalData
     * @param {Boolean} signalData.hide True if slide is hidden else false.
     */
    enableHandler: function(makeDisabled, signal, signalData) {
      // Lint unreferenced args
      makeDisabled = makeDisabled || '';
      signal = signal || '';

      if (!this.presentationEmpty && signalData &&
          signalData.hide !== undefined) {
        this.disabled = signalData.hide;
      }
    },


    /**
     * @private
     * @override
     * @param {Boolean} isEmpty True if the presentation is empty, else false.
     *     The signals 'qowt:presentationEmpty' and 'qowt:presentationNonEmpty'
     *     drive this value.
     */
    presoEmptyHandler: function(isEmpty) {
      this.presentationEmpty = isEmpty;
      this.disabled = isEmpty;
    }
  });

  return {};
});

