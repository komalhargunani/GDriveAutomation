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
 * Config file containing default values for configuration variables that are
 * used by all Apps
 *
 * These values can be overridden for a specific platform in the file
 * 'src/variants/<PLATFORM>/configs/commonConfig.js'
 */
define([
  ], function() {

  'use strict';

  var config = {

    // Which bitmap image file formats are supported
    // This provides a buffer between images that may be embedded
    // in a document and the platform support enabling QOWT to
    // draw an unknown object in place of the image
    SUPPORTED_IMAGE_FORMATS: {
      'jpg': true,
      'jpeg': true,
      'gif': true,
      'png': true,
      'pic': false,
      'pict': false,
      'bmp': true,
      'tif': true,
      'tiff': true
    },
    // all product will define there Zoom level in there respective config
    ZOOM: {current: undefined,
      next: undefined,
      levels: undefined
    },
    // Layout control configuration defaults
    LAYOUT_DEFAULT_MAXZOOM: undefined,
    LAYOUT_DEFAULT_MINZOOM: undefined,
    LAYOUT_DEFAULT_ZOOM_LEVEL: undefined,

    // The default debounce time for doc verification check
    DOC_VERIFY_DEBOUNCE: 50,

    // The default colors to be used for a chart
    DEFAULT_COLORS: [
      "#6B9CD4", "#DE7872", "#B7D37C", "#A48CC2",
      "#6CC7E1", "#F3AB63", "#AEC8EE"
    ],

    // Default values and definitions for text styles
    TEXT_STYLE: {
      defaultHighlightColor: "rgb(255, 255, 255)",
      defaultTxtColor: "rgb(0, 0, 0)",
      shadowText: {
        setValue: "#000000 0.07em 0.07em 0.07em",
        getValue: "rgb(0, 0, 0) 0.07em 0.07em 0.07em"
      },
      outlineText: {
        webkitTextFillColor: "transparent",
        webkitTextStroke: ".05em #000000",
        webkitTextStrokeWidth: "0.05em",
        webkitTextStrokeColor: "rgb(0, 0, 0)"
      },
      embossedText: {
        setColor: "#ffffff",
        getColor: "rgb(255, 255, 255)",
        setShadow: "#000000 1px 1px 2px",
        getShadow: "rgb(0, 0, 0) 1px 1px 2px"
      },
      engravedText: {
        setColor: "#999999",
        getColor: "rgb(153, 153, 153)",
        setShadow: "#000000 -1px -1px 2px",
        getShadow: "rgb(0, 0, 0) -1px -1px 2px"
      }
    },

    /**
     * This defines the deafult blip fill-mode. This default behavior is not
     * given in ECMA, and is derived from MS Office 2007.
     * The default behavior is tiled blip fill, with offsets (0, 0), and scaling
     * (100%, 100%).
     */
    DEFAULT_BLIP_FILL_PROPERTIES: {
      tileProps: {
        Sx: 100,
        Sy: 100,
        Tx: 0,
        Ty: 0,
        align: 'TL'
      },
      type: 'tileFill'
    },

    // The retry interval for message bus connection attempts, in ms
    kMESSAGE_BUS_CONNECTION_RETRY: 10,

    // The timeout for failed message bus connection attempts, in ms
    kMESSAGE_BUS_CONNECTION_TIMEOUT: 30000,

    // The error message for failed message bus connection attempts
    kMESSAGE_BUS_CONNECTION_TIMEOUT_MSG: 'MessageBus: Connection timeout',

    // Used by the app-specific config modules to create their own instance of
    // the common config which they can then indirectly refer to and extend
    // according to the app-specific needs
    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _api = {

          SUPPORTED_IMAGE_FORMATS: config.SUPPORTED_IMAGE_FORMATS,

          DIALOGUE_CONFIG: config.DIALOGUE_CONFIG,

          DEFAULT_COLORS: config.DEFAULT_COLORS,
          ZOOM: config.ZOOM,
          LAYOUT_DEFAULT_MAXZOOM: config.LAYOUT_DEFAULT_MAXZOOM,
          LAYOUT_DEFAULT_MINZOOM: config.LAYOUT_DEFAULT_MINZOOM,
          LAYOUT_DEFAULT_ZOOM_LEVEL: config.LAYOUT_DEFAULT_ZOOM_LEVEL
        };

        return _api;
      };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return config;
});
