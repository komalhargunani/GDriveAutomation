// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'insert text box' toolbar button for presentation by
 * extending the generic toolbar button to include a specific content type.
 * Returns a button configuration.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define(['qowtRoot/pubsub/pubsub'], function(PubSub) {

  'use strict';

  return {
    type: 'button',
    action: 'initAddShape',

    /**
     * This method added as configuration. It behaves as an API which helps the
     * widget to do task specific to itself in case if it gets extended by
     * common widget.
     */
    preExecuteHook: function(/* set */) {
      // This is added to the generic actionData since we needed use the
      // generic button widget and also needed to request the tool to activate.
      PubSub.publish('qowt:clearSlideSelection');
      PubSub.publish('qowt:requestFocus', {contentType: 'slide'});
      return {
        prstId: 88,
        isTxtBox: true
      };
    },
    sticky: true, subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {Object} signalData Contextual information about selection.
       */
      'qowt:addShapeDone': function(/* signal, signalData */) {
        this.setActive(false);
      },
      'qowt:transientActionClear': function(/* signal, signalData */) {
        this.setActive(false);
      },
      'qowt:presentationNonEmpty': function(/* signal, signalData */) {
        this.setEnabled(true);
      },
      'qowt:presentationEmpty': function(/* signal, signalData */) {
        this.setEnabled(false);
      }
    }
  };
});
