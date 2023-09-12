// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Wrapper module for the translators sub system
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */
define([
  'qowtRoot/tools/text/mutations/registry',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/tools/text/mutations/translators/addNodes',
  'qowtRoot/tools/text/mutations/translators/addImageNodes',
  'qowtRoot/tools/text/mutations/translators/deleteNodes',
  'qowtRoot/tools/text/mutations/translators/formatNodes',
  'qowtRoot/tools/text/mutations/translators/formatParaWithRunProps',
  'qowtRoot/tools/text/mutations/translators/moveNodes',
  'qowtRoot/tools/text/mutations/translators/textNodes',
  'qowtRoot/tools/text/mutations/translators/formatUnchangedRunProps'
], function(MutationRegistry, TypeUtils) {

  'use strict';

  /**
   * The instance of mutation registry for translators.
   * @private
   */
  var _translators = MutationRegistry.create();

  /**
   * Registers all translators to mutation registry.
   * @private
   * @param {Object} argumentsObject the Arguments object
   */
  var _registerTranslators = function(argumentsObject) {
    var translatorConfig;

    // Ignore registry and typeUtils modules so that we do not try to
    // register them as translator.
    for (var i = 2; i < argumentsObject.length; i++) {
      var translator = argumentsObject[i];

      if (translator && translator.translatorConfig) {
        translatorConfig = translator.translatorConfig;

        /* If translator config is array then its a configuration for multiple
         * filters. For example, table cell translator has two filters one for
         * paragraph and other for line breaks.
         */
        if (TypeUtils.isList(translatorConfig)) {
          for (var j = 0; j < translatorConfig.length; j++) {
            _translators.registerHandler(translatorConfig[j].filterConfig,
                                         translatorConfig[j].callback,
                                         translatorConfig[j].priority);
          }
        } else {
          _translators.registerHandler(translatorConfig.filterConfig,
                                       translatorConfig.callback,
                                       translatorConfig.priority);
        }
      } else {
        console.warn('Could not register translator.');
      }
    }
  };

  _registerTranslators(arguments);

  return _translators;
});
