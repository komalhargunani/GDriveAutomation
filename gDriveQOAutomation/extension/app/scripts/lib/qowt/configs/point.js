/*
 Config is different from MODEL in that it is platform configuration,
 not information on current open file
 */
define([
  'qowtRoot/variants/configs/common',
  'qowtRoot/configs/buttonConfigs/undoButton',
  'qowtRoot/configs/buttonConfigs/redoButton',
  'qowtRoot/configs/buttonConfigs/presentationButtons/zoomInButton',
  'qowtRoot/configs/buttonConfigs/presentationButtons/zoomOutButton',
  'qowtRoot/configs/buttonConfigs/presentationButtons/fontFillButton',
  'qowtRoot/configs/buttonConfigs/documentButtons/fontFaceButton',
  'qowtRoot/configs/buttonConfigs/fontSizeButton',
  'qowtRoot/configs/buttonConfigs/drawing/insertTextBoxButton',
  'qowtRoot/configs/buttonConfigs/drawing/addShapeButton',
  'qowtRoot/configs/buttonConfigs/drawing/shapeFillColorButton',
  'qowtRoot/configs/buttonConfigs/drawing/shapeOutlineColorButton',
  'qowtRoot/configs/buttonConfigs/drawing/shapeOutlineWidthButton',
  'qowtRoot/configs/buttonConfigs/drawing/shapeOutlineStyleButton',
  'qowtRoot/configs/buttonConfigs/presentationButtons/bulletListButton',
  'qowtRoot/configs/buttonConfigs/presentationButtons/numberListButton',
  'qowtRoot/configs/buttonConfigs/spacerConfig'
], function(
  CommonConfig,
  UndoButtonConfig,
  RedoButtonConfig,
  ZoomInButtonConfig,
  ZoomOutButtonConfig,
  TextColorButtonConfig,
  FontFaceButtonConfig,
  FontSizeDropdownButtonConfig,
  InsertTextBoxButtonConfig,
  AddShapeButtonConfig,
  ShapeFillColorButtonConfig,
  ShapeOutlineColorButtonConfig,
  ShapeOutlineWidthButtonConfig,
  ShapeOutlineStyleButtonConfig,
  BulletListButtonConfig,
  NumberListButtonConfig,
  SpacerConfig
) {

  'use strict';

  // Create an instance of the common config for use by the point config
  var config = CommonConfig.create();

  // The default number of thumbnails to load at once (we don't load all the
  // thumbnails to improve performance). The actual number is calculated in the
  // presentation control and it is relative to window.innerHeight
  config.THUMBNAILS_TO_LOAD = 6;

  // Used by _calculateThumbnailsWindow() in the presentation control
  config.kTHUMBNAILS_EXTRA_BUFFER = 2;

  // The zoom scale for the thumbnails (thumbnails are like normal slides
  // but we apply a webkit-transform to make them smaller)
  config.kTHUMBNAIL_ZOOMSCALE = 0.2;

  // The space in pixels between thumbnails
  config.kGAP_BETWEEN_THUMBNAILS = 10;

  // JELTE TODO: added this to the default point config since it is seemingly
  // used in the code.
  // This needs to change to conform to coding styles.
  config.kDEFAULT_BULLET_CHARACTER = '•';

  //the adjustment needed in order that we don't show any background in the
  // thumbnails - in the thumbnail strip
  config.kTHUMBNAIL_SIZE_ADJUST = 3;

  // additional scaling factor when re-sizing slides to place in the
  // thumbnail strip
  config.kTHUMBNAIL_RESIZE_SCALE = 0.8;

  // additional scaling factor when re-sizing slides to place in the
  // thumbnail strip
  // any change in this needs to changed mirrored in
  // point.css : qowt-point-thumbnails-container-open
  config.kTHUMBNAIL_STRIP_WIDTH = 250;

  // the flag that controls whether the thumbnail strip is open or closed on
  // presentation open
  config.kThumbnailOpenAtStart = true;

  // The top containment when dragging the slide notes splitter (in px).
  config.kNOTES_SPLITTER_CONTAINMENT_TOP = 100;

  // Indicates presentation is loading and used in presentation control
  config.kIs_PresentationLoading = true;

  // The default height (in px) of slide notes when some notes are present.
  config.kNOTES_DEFAULT_HEIGHT = 90;

  // The default value of wrap for text body properties.
  config.kDEFAULT_IS_BODY_PROPERTY_WRAP = true;

  // The default value of anchor center for text body properties.
  config.kDEFAULT_IS_BODY_PROPERTY_ANCHOR_CENTER = false;

  // The default value of left inset (in EMU) for text body properties.
  config.kDEFAULT_LEFT_INSET = 91440;

  // The default value of top inset (in EMU) for text body properties.
  config.kDEFAULT_TOP_INSET = 45720;

  // The default value of right inset (in EMU) for text body properties.
  config.kDEFAULT_RIGHT_INSET = 91440;

  // The default value of bottom inset (in EMU) for text body properties.
  config.kDEFAULT_BOTTOM_INSET = 45720;

  // The default value of font size in pixels.
  config.kDEFAULT_FONT_SIZE = 18;

  // default line height for text run is 120% which is equivalent to 12 points
  config.kDEFAULT_LINE_SPACING_VALUE = 12;

  // String prepended to the IDs of all the elements inside a thumbnail.
  // See changeSlideInnerElementsId() in the Slide widget.
  config.kTHUMB_ID_PREFIX = 't-';

  // The default value of autoType for auto numbered bullet which is
  // 'counter(item, decimal)"."',  i.e. 1., 2., 3.,
  config.kDEFAULT_BULLET_AUTO_TYPE = 21;

  // The maximum value of auto number for bullet
  config.kMAX_BULLET_NUMBER = 32767;

  // overriding common-config
  // It defines the scale-factor for each zoom-level. For instance,
  // if the zoom-level is 0,
  // the scale-factor should be 0.25, and so on.
  config.ZOOM.levels = [
    0.25, 0.33, 0.5, 0.66, 0.75, 0.9,
    //default zoom level
    1,
    1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5
  ];

  // overriding common-config
  // index to the zoom levels array, default to original size i.e. 100%, hence 6
  config.ZOOM.current = 6;

  // overriding common-config
  //
  config.LAYOUT_DEFAULT_MAXZOOM =
    config.ZOOM.levels[config.ZOOM.levels.length - 1];

  // overriding common-config
  config.LAYOUT_DEFAULT_MINZOOM = config.ZOOM.levels[0];

  // overriding common-config
  config.LAYOUT_DEFAULT_ZOOM_LEVEL = 6;

  // chart background color
  config.CHART_BACKGROUND_COLOR = "transparent";

  config.MAIN_TOOLBAR_HEIGHT = 97;

  config.MAIN_TOOLBAR = {
      ACTIVITYBAR: {
        items: [
          {
          is: 'QOWTDownloadButton',
          type: 'button',
          action: 'download'
          },
          {
          is: 'QOWTPresentButton',
          /*
           * TODO(dskelton) We shouldn't need to define type and action here
           * that is present within the custom element implementation directly.
           * This is used by the maintoolbar code during config processing.
           */
          type: 'button',
          action: 'startSlideshow'
        }, {
          is: 'QOWTShareButton',
          type: 'button',
          action: 'share'
        }]
      },
    BUTTONBAR: {
      id: 'ppt-buttonbar',
      contentType: 'presentation',
      items: [
        // TODO(davidshimel): Remove this config by making toolbar declarative
        // after full Polymerization
        'button-print',
        SpacerConfig,
        UndoButtonConfig,
        RedoButtonConfig,
        SpacerConfig,
        ZoomInButtonConfig,
        ZoomOutButtonConfig,
        SpacerConfig,
        InsertTextBoxButtonConfig,
        AddShapeButtonConfig,
        SpacerConfig,
        ShapeFillColorButtonConfig,
        ShapeOutlineColorButtonConfig,
        ShapeOutlineWidthButtonConfig,
        ShapeOutlineStyleButtonConfig,
        SpacerConfig,
        FontFaceButtonConfig,
        SpacerConfig,
        FontSizeDropdownButtonConfig,
        SpacerConfig,
        // TODO(davidshimel): Remove this config by making toolbar declarative
        // after full Polymerization
        'button-bold',
        'button-italic',
        'button-underline',
        SpacerConfig,
        TextColorButtonConfig,
        SpacerConfig,
        // TODO(davidshimel): Remove this config by making toolbar declarative
        // after full Polymerization
        'group-justify',
        SpacerConfig,
        NumberListButtonConfig,
        BulletListButtonConfig
      ]
    }
  };

  return config;
});
