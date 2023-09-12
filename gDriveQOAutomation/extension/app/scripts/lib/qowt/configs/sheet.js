/**
 * Config file containing default values for configuration variables that are
 * used by Sheet.
 *
 * These values can be overridden for a specific platform in the file
 * 'src/variants/<PLATFORM>/configs/sheetConfig.js'
 */

define([
    'qowtRoot/variants/configs/common',
    'qowtRoot/configs/buttonConfigs/sheetButtons/undoButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/redoButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/zoomInButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/zoomOutButton',
    'qowtRoot/configs/buttonConfigs/fontFaceButton',
    'qowtRoot/configs/buttonConfigs/fontSizeButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/textColorButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/backgroundColorButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/wrapTextButton',
    'qowtRoot/configs/buttonConfigs/spacerConfig'
  ], function(
    CommonConfig,
    UndoButtonConfig,
    RedoButtonConfig,
    ZoomInButtonConfig,
    ZoomOutButtonConfig,
    FontFaceButtonConfig,
    FontSizeButtonConfig,
    TextColorButtonConfig,
    BackgroundColorButtonConfig,
    WrapTextButtonConfig,
    SpacerConfig
  ) {

  'use strict';

    // Create an instance of the common config for use by the sheet config
    var config = CommonConfig.create();


  /* Default number of columns and rows in a grid, and their default width
   * and height
   */
    config.kGRID_DEFAULT_COLS = 256;
    config.kGRID_DEFAULT_ROWS = 500;
    config.kGRID_DEFAULT_COL_WIDTH = 200;
    config.kGRID_DEFAULT_ROW_HEIGHT = 40;

    /* Maximum number of rows to have in a grid */
    config.kGRID_DEFAULT_MAX_ROWS = 5000;

    /* Cap which we cannot exceed by inserting rows or cols
     * These are defined in SpreadSheetConstants.h in Legacy Core
     */
    config.kGRID_DEFAULT_ABS_MAX_COLS = 256; // KDefaultCols
    config.kGRID_DEFAULT_ABS_MAX_ROWS = 65536; // KDefaultRows

  /* Number of empty rows that we would like to display after the last
   * non-empty row
   */
    config.kGRID_EMPTY_ROWS_BUFFER = 100;

    /**
      * Border size of the grid. This value is used to calculate positioning
      * of the grid *and* the cells. The calculation ensures a simulated
      * border-collapse model, to ensure the gridlines dont 'double' up.
      */
    config.kGRID_GRIDLINE_WIDTH = 1;

  /* The number of rows whose content will be requested as soon as a sheet
   * is opened
   */
    config.kGRID_INITIAL_ROW_CHUNK_SIZE = 100;

  /* The number of rows whose content will be requested from then on, in
   * chunks
   */
    config.kGRID_NORMAL_ROW_CHUNK_SIZE = 500;

  /* The number of cells of updated content which will be returned in a
   *  single bucket
   */
    config.kGRID_UPDATE_CONTENT_CELL_BUCKET_SIZE = 500;

    /**
     * The max number of suggestions shown by the autocomplete handler
     * It is the same limit implemented in MS Excel for Mac 2011
     */
    config.kMAX_NUM_SUGGESTIONS = 122;
    /*
      The actual size of the hit area. The value is divided by two and used as
      a hit area either side of the gridline for resizing rows and columns.
     */
    config.ColRowResizeHitArea = 10;

    config.ZOOM = {};
    config.ZOOM.current= 6; // index to the zoom levels array
    config.ZOOM.levels = [
      0.52, 0.6, 0.68, 0.76, 0.84, 0.92,
      //default zoom level
      1,
      1.08, 1.16, 1.24, 1.32
    ];

    config.LAYOUT_DEFAULT_MAXZOOM = config.ZOOM.levels[
                                    config.ZOOM.levels.length - 1];

    config.LAYOUT_DEFAULT_MINZOOM = config.ZOOM.levels[0];
    config.LAYOUT_DEFAULT_ZOOM_LEVEL = 5;

    config.MAIN_TOOLBAR = {
      ACTIVITYBAR: {
        items: [
          {
          is: 'QOWTDownloadButton',
          type: 'button',
          action: 'download'
          },
          {
          is: 'QOWTShareButton',
          /*
           * TODO(dskelton) We shouldn't need to define type and action here
           * that is present within the custom element implementation directly.
           * This is used by the maintoolbar code during config processing.
           */
          type: 'button',
          action: 'share'
        }]
      },
      BUTTONBAR: {
        id: 'sheet-buttonbar',
        contentType: 'workbook',
        items: [
          // TODO(davidshimel): Remove this config by making toolbar
          // declarative after full Polymerization
/*          'button-print',*/
          UndoButtonConfig,
          RedoButtonConfig,
          SpacerConfig,
          ZoomInButtonConfig,
          ZoomOutButtonConfig,
          SpacerConfig,
          FontFaceButtonConfig,
          SpacerConfig,
          FontSizeButtonConfig,
          SpacerConfig,
          // TODO(davidshimel): Remove this config by making toolbar declarative
          // after full Polymerization
          'button-bold',
          'button-italic',
          'button-underline',
          'button-strikethrough',
          TextColorButtonConfig,
          SpacerConfig,
          BackgroundColorButtonConfig,
          SpacerConfig,
          'button-border',
          SpacerConfig,
          'button-merge',
          'button-merge-dropdown',
          SpacerConfig,
          WrapTextButtonConfig,
//          SpacerConfig,
//          AutoFilterButtonConfig,
//          ChartButtonConfig,
          SpacerConfig,
          'button-cellAlign'
        ]
      }
    };

    /**
     * The size factor of the chart in a chart sheet.
     * The value is an integer and the higher the value the higher the
     * dimensions (width and height) of the chart in a chart sheet
     */
    config.kCHART_SHEET_CHART_SIZE_FACTOR = 12;

    /* The size of the scrollbars in a sheet, in pixels */
    config.kSCROLLBAR_SIZE = 14;

    // The characters that can prefix a cell reference in a formula
    config.VALID_CELL_REF_PREFIX_CHARS = [
      '(', ',', '.', ':', '<', '>', '=',
      '^', '!', '&', '*', '+', '-', '/',
      String.fromCharCode(32), // space key
      String.fromCharCode(160) // non-breaking space key
    ];

    // The colors to be used for highlighting cells during a formula edit
    config.FORMULA_HIGHLIGHT_COLORS = [
      "rgb(16, 150, 24)",
      "rgb(221, 85, 17)",
      "rgb(140, 109, 140)",
      "rgb(112, 131, 168)",
      "rgb(102, 51, 204)",
      "rgb(204, 51, 51)",
      "rgb(34, 170, 153)",
      "rgb(136, 136, 136)",
      "rgb(176, 139, 89)",
      "rgb(153, 68, 153)"
    ];

    return config;
});
