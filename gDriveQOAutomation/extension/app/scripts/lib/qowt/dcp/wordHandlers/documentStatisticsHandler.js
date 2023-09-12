
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview DCP Handler for document statistics elements.
 * This module will log document data to external systems like Google Analytics.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/messageBus/messageBus'
  ], function(
    PubSub,
    MessageBus
  ) {

  'use strict';

  /**
   * @private
   * Subscription tokens.
   */
  var _disableToken;

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'documentStatistics',

    /**
     * Initialisation. Will throw if already initialised. Safe to call if the
     * module was previously disable.
     */
    init: function() {
      if (_disableToken) {
        throw new Error('documentStatisticsHandler.init() ' +
            'called multiple times.');
      }

      _disableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },

    /**
     * Cleanup the resources used in this module.
     * Required by singletons such that we can verify no resources are orphaned.
     * Note init() must be called after disable so the moduler is ready for use.
     *
     */
    disable: function() {
      // It is safe to unsubscribe an undefined token.
      PubSub.unsubscribe(_disableToken);
      _disableToken = undefined;
    },

    /**
     * Process a documentStatistics element.
     * @param {Object} elm Arbitrary DCP.
     * @return {element} Not used currently.
     */
    visit: function(elm) {
      if (!elm || !elm.el || !elm.el.etp || (elm.el.etp !== _api.etp)) {
        return undefined;
      }

      _recordData('ParagraphCount', elm.el.paragraphCount || 0);
      _recordData('SectionCount', elm.el.sectionCount || 0);
    }
  };

  function _recordData(dataPoint, count) {
    MessageBus.pushMessage({
      id: 'recordCount', context: {
        dataPoint: dataPoint,
        value: count
      }
    });
  }

  return _api;
});


