/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Chrome version of the word config object;
 * Override any word value from the default config, specific for Chrome
 * Note: Configs are different from MODEL in that it is platform configuration,
 * not information on current open file
 */

define(['qowtRoot/configs/word'], function(defaultWordConfig) {

  'use strict';



    var config = defaultWordConfig;


    // DuSk TODO: Review/remove this hardcoded default. What is it?
    // If it is required check if it needs to be shared as a text setting
    // and reused by Point.
    config.DEFAULT_LISTS_INDENT = 18;

    return config;
});
