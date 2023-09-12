// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Wrapper module for the cleaners sub system
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */
define([
  'qowtRoot/tools/text/mutations/registry',
  'qowtRoot/utils/typeUtils',

  'qowtRoot/tools/text/mutations/cleaners/alignmentRemover',
  'qowtRoot/tools/text/mutations/cleaners/emptySection',
  'qowtRoot/tools/text/mutations/cleaners/emptyTableRemover',
  'qowtRoot/tools/text/mutations/cleaners/fontSizeCleaner',
  'qowtRoot/tools/text/mutations/cleaners/fontTagRemover',
  'qowtRoot/tools/text/mutations/cleaners/localDOMRemover',
  'qowtRoot/tools/text/mutations/cleaners/loneBR',
  'qowtRoot/tools/text/mutations/cleaners/loneQowtDrawing',
  'qowtRoot/tools/text/mutations/cleaners/nestedSpans',
  'qowtRoot/tools/text/mutations/cleaners/newElements',
  'qowtRoot/tools/text/mutations/cleaners/orphanedText',
  'qowtRoot/tools/text/mutations/cleaners/paragraphFormatting',
  'qowtRoot/tools/text/mutations/cleaners/resetIds',
  'qowtRoot/tools/text/mutations/cleaners/softLineBreak',
  'qowtRoot/tools/text/mutations/cleaners/tableCell',
  'qowtRoot/tools/text/mutations/cleaners/unsupportedElements'
], function(MutationRegistry, TypeUtils) {

  'use strict';

  /**
   * The instance of mutation registry for cleaners.
   * @private
   */
  var _cleaners = MutationRegistry.create();

  /**
   * Registers all cleaners to mutation registry.
   * @private
   * @param {Object} argumentsObject the Arguments object
   */
  var _registerCleaners = function(argumentsObject) {
    var cleanerConfig;

    // Ignore registry and typeUtils modules so that we do not try to
    // register them as cleaner.
    for (var i = 2; i < argumentsObject.length; i++) {
      var cleaner = argumentsObject[i];

      if (cleaner && cleaner.cleanerConfig) {
        cleanerConfig = cleaner.cleanerConfig;

        /* If cleaner config is array then its a configuration for multiple
         * filters. For example, table cell cleaner has two filters one for
         * paragraph and other for line breaks.
         */
        if (TypeUtils.isList(cleanerConfig)) {
          for (var j = 0; j < cleanerConfig.length; j++) {
            _cleaners.registerHandler(cleanerConfig[j].filterConfig,
                                      cleanerConfig[j].callback,
                                      cleanerConfig[j].priority);
          }
        } else {
          _cleaners.registerHandler(cleanerConfig.filterConfig,
                                    cleanerConfig.callback,
                                    cleanerConfig.priority);
        }
      } else {
        console.warn('Could not register cleaner.');
      }
    }
  };

  _registerCleaners(arguments);

  return _cleaners;
});
