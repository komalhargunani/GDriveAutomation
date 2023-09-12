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
 * Chrome version of the sheet config object;
 * Override any sheet value from the default config, specific for Chrome
 * Note: Configs are different from MODEL in that it is platform configuration,
 * not information on current open file
 */

define(['qowtRoot/configs/sheet'], function(defaultSheetConfig) {

  'use strict';



    var config = defaultSheetConfig;

    /* The number of rows whose content will be requested as soon as a sheet is
     opened */
    config.kGRID_INITIAL_ROW_CHUNK_SIZE = 30;

    /* The number of rows whose content will be requested from then on, in
     chunks */
    config.kGRID_NORMAL_ROW_CHUNK_SIZE = 300;

    /* The number of cells whose content will be requested from then on, in
     buckets */
    /* test on NACL => should be smaller ?!!! */
    config.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE = 500;

    config.kGRID_DEFAULT_ROWS = 300;

    /* The time between two clicks to consider them a double click */
    config.kDOUBLE_CLICK_INTERVAL = 300;

    /* The default padding for cells in pixels */
    config.kDEFAULT_CELL_PADDING = 3;

    return config;
});
