/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Point model to store data
 */
define([], function() {

  'use strict';

  var _model = {

    // cache variable for themes, master layout and slide layout, to reduce
    // getElementById calls
    masterLayoutMap: {},
    slideLayoutMap: {},

    /**
     * 'isExplicitTextBody' variable is used in textParagraphHandler and
     * textRunHandler.
     * It is set/reset in shapeTextBodyHandler and placeHolderTextBodyHandler.
     * This variable descibes whether the current text-body is explicit (in
     * either master, layout or slide), or is a place-holder text-body which
     * should not be visible.
     */
    isExplicitTextBody : true,

    /**
     * the below variables - are used in presentation opening
     * MasterSlideId & SlideLayoutId - are the id's for each slides' Master &
     * Slide Layouts
     * these are set on the return of the getSlideContent command - before
     * getMasterLayout / getSlideLayout commands are called
     *
     * numberOfSlidesInPreso - is the total number of slides withn a
     * presentation
     * this is set on the return of the openPresentation command - used to
     * create correct number of slides in the presentation.
     *
     * filePath - is the path of the file used during save command
     */
    filePath: undefined,

    MasterSlideId: undefined,
    SlideLayoutId: undefined,

     // TODO(bhushan.shitole): rename this to last fetched slide-id
    SlideId: undefined,

    // This is the eid of current slide.
    currentSlideEId: undefined,

    numberOfSlidesInPreso: undefined,

    chartIdArrayInFirstSlide: [],

    ThemeId: undefined,

    slideColorMap: {},

    //TODO (pankaj.avhad)If slide zoom manager provides api to access current
    //zoom scale then we do not need to maintain this currentZoomScale in model.
    //Cached variable used for calculating event co-ordinates with respect to
    //scaling.
    currentZoomScale: 1,

    /**
     * keeps the current level of the Place-holder(PH) - master-layout(sldmt) or
     * slide-layout(sldlt)
     */
    currentPHLevel: undefined,

    /**
     * Holds place-holder type and place-holder index for current place-holder
     * at slide level.
     */
    CurrentPlaceHolderAtSlide: {
      phTyp: undefined,
      phIdx: undefined
    },

    /**
     * Holds place-holder type and place-holder index for current place-holder
     * at slide master/slide layout level.
     */
    CurrentPlaceHolderAtLayouts: {
      phTyp: undefined,
      phIdx: undefined
    },

    /**
     * This variable is used for enabling transition manager is slideShow mode
     * is ON
     */
    slideShowMode: false,

    /**
     * Holds slide transition animation data against slide index.
     * slide index is 0 based.
     */
    slideTransitions: {},

    /**
     * Holds the current shape or place-holder dimensions.
     * It actually holds the value of -spPr.xfrm- attribute.
     */
    shapeDimensions: {},

    maxParaFontSize: 0,

    /**
     * Holds body properties of current shape text body e.g. wrap, anchor center
     * etc.
     */
    textBodyProperties: {
      wrap: true,
      anchorCtr: false,
      lnSpcReduction: undefined
    },

    currentTable :{
      /**
       * Holds the current table properties.
       */
      tableProps: {
        bandCol: false,
        bandRow: false,
        firstCol:false,
        firstRow:false,
        lastCol:false,
        lastRow:false
      },

      /**
       * Holds the flag for determine if the table style is being processed
       */
      isProcessingTable: false,

      /**
       * Holds the (row,col) of current table cell
       */
      noOfRows: undefined,
      noOfCols: undefined,

      /**
       *  Holds the current row and column of the table.
       */
      currentRow: undefined,
      currentCol: undefined,

      /**
       * Indicates whether the table style to which the table refers is defined
       */
      isTableStyleDefined: true
    },

    /**
     * Holds dummy placeholder text bodies.
     */
    placeholderTextBody: {},

    /**
     * Indicates if current shape is of placeholder type. It's set in
     * shapeHandler.
     */
    isPlaceholderShape: false,

    /**
     * Holds the list of all the fonts used in rendering - explicit as well as
     * from theme
     */
    fontList: []
  };

  return _model;
});
