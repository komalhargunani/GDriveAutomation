/**
 * Config file containing default values for configuration variables that are
 * used by Word.
 *
 * These values can be overridden for a specific platform in the file
 * 'src/variants/<PLATFORM>/configs/wordConfig.js'
 */

define([
    'qowtRoot/variants/configs/common',
    'qowtRoot/configs/buttonConfigs/undoButton',
    'qowtRoot/configs/buttonConfigs/redoButton',
    'qowtRoot/configs/buttonConfigs/documentButtons/zoomInButton',
    'qowtRoot/configs/buttonConfigs/documentButtons/zoomOutButton',
    'qowtRoot/configs/buttonConfigs/wordStyleButton',
    'qowtRoot/configs/buttonConfigs/documentButtons/fontFaceButton',
    'qowtRoot/configs/buttonConfigs/fontSizeButton',
    'qowtRoot/configs/buttonConfigs/documentButtons/textColorButton',
    'qowtRoot/configs/buttonConfigs/textHighlightButton',
    'qowtRoot/configs/buttonConfigs/numberListButton',
    'qowtRoot/configs/buttonConfigs/bulletListButton',
    'qowtRoot/configs/buttonConfigs/spacerConfig'
  ], function(
    CommonConfig,
    UndoButtonConfig,
    RedoButtonConfig,
    ZoomInButtonConfig,
    ZoomOutButtonConfig,
    WordStyleButtonConfig,
    FontFaceButtonConfig,
    FontSizeButtonConfig,
    TextColorButtonConfig,
    TextHighlightButtonConfig,
    NumberListButtonConfig,
    BulletListButtonConfig,
    SpacerConfig
  ) {

  'use strict';

    // Create an instance of the common config for use by the word config
    var config = CommonConfig.create();


    // JELTE TODO: why do we still have these booleans?
    // if clients dont want headers/footers, they can use
    // css to turn it off, can't they?
    // Toggle visibility of Header/Footer
    // Header/Footer DIVs are drawn but the content is
    // omitted if these config variables are false
    config.DOC_DRAW_HEADERS = true;
    config.DOC_DRAW_FOOTERS = true;
    // index to the zoom levels array, default to original size i.e. 100%,
    // hence 6
    config.ZOOM.current= 6;
    config.ZOOM.levels= [
      0.25, 0.33, 0.5, 0.66, 0.75, 0.9,
      //default zoom level
      1,
      1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5
    ];

    config.LAYOUT_DEFAULT_MAXZOOM = config.ZOOM.levels[
                                    config.ZOOM.levels.length-1];
    config.LAYOUT_DEFAULT_MINZOOM = config.ZOOM.levels[0];
    config.LAYOUT_DEFAULT_ZOOM_LEVEL = 6;
    config.DOC_LAYOUT_DEFAULT_GUTTER_PERCENTAGE = 0.02;

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
        id: 'doc-buttonbar',
        contentType: 'document',
        items: [
          // TODO(davidshimel): Remove this config by making toolbar
          // declarative after full Polymerization
          'button-print',
          SpacerConfig,
          UndoButtonConfig,
          RedoButtonConfig,
          SpacerConfig,
          // TODO(davidshimel): Remove this config by making toolbar
          // declarative after full Polymerization
          'button-toggleZoom',
          ZoomInButtonConfig,
          ZoomOutButtonConfig,
          SpacerConfig,
          WordStyleButtonConfig,
          SpacerConfig,
          FontFaceButtonConfig,
          SpacerConfig,
          FontSizeButtonConfig,
          SpacerConfig,
          // TODO(davidshimel): Remove this config by making toolbar
          // declarative after full Polymerization
          'button-bold',
          'button-italic',
          'button-underline',
          SpacerConfig,
          TextColorButtonConfig,
          TextHighlightButtonConfig,
          SpacerConfig,
          // TODO(davidshimel): Remove this config by making toolbar
          // declarative after full Polymerization
          'group-justify',
          SpacerConfig,
          NumberListButtonConfig,
          BulletListButtonConfig
        ]
      }
    };

  return config;
});
