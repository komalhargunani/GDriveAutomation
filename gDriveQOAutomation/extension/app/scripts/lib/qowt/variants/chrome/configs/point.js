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
 * Chrome version of the point config object;
 * Override any point value from the default config, specific for Chrome
 * Note: Configs are different from MODEL in that it is platform configuration,
 * not information on current open file
 */

define(['qowtRoot/configs/point'], function(defaultPointConfig) {

  'use strict';



    var config = defaultPointConfig;

    // TODO : As Chrome-Book is not supporting certain bullet characters on
    // slate(which make use of Windings font), we fallback some pre defined
    // bullet characters, depending on the paragraph level. We use following
    // variable to whether bullet characters are supported or not on platform.
    config.kIS_BULLET_CHAR_NOT_SUPPORTED = false;

    // This Array will be used only for the platform when bullet characters are
    // not supported, these characters are basic MS bullet characters
    //  \\25cf  - black circle
    //  \\3bf - omicron (black circle without fill)
    //  \\2012 - dash
    //  \\2666 - black diamond suit
    //  \\21D2 - rightwards double arrow
    config.supportedBulletChars = new Array('\\25cf', '\\3bf', '\\2012' ,
        '\\2666', '\\21D2' );

    return config;
});
