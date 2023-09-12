/**
 * Wrapper module for the dcp handler sub system
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/dcp/pointHandlers/_all',
  'qowtRoot/dcp/pointHandlers/animation/_all',
  'qowtRoot/dcp/wordHandlers/_all',
  'qowtRoot/dcp/bookmarkHandler',
  'qowtRoot/dcp/axisHandler',
  'qowtRoot/dcp/backgroundHandler',
  'qowtRoot/dcp/bulletedListHandler',
  'qowtRoot/dcp/charRunHandler',
  'qowtRoot/dcp/chartDataPointVHandler',
  'qowtRoot/dcp/chartDataPointXHandler',
  'qowtRoot/dcp/chartDataPointXYHandler',
  'qowtRoot/dcp/chartDataPointYHandler',
  'qowtRoot/dcp/chartHandler',
  'qowtRoot/dcp/docHandler',
  'qowtRoot/dcp/fieldHandler',
  'qowtRoot/dcp/fontStyleHandler',
  'qowtRoot/dcp/footerHandler',
  'qowtRoot/dcp/footerItemHandler',
  'qowtRoot/dcp/getModifiedCellsHandler',
  'qowtRoot/dcp/getSheetContentHandler',
  'qowtRoot/dcp/getSheetInformationHandler',
  'qowtRoot/dcp/getWorkbookInformationHandler',
  'qowtRoot/dcp/headerHandler',
  'qowtRoot/dcp/headerItemHandler',
  'qowtRoot/dcp/hyperlinkHandler',
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/dcp/lineSeparatorHandler',
  'qowtRoot/dcp/metaFileHandler',
  'qowtRoot/dcp/numberedListHandler',
  'qowtRoot/dcp/openWorkbookFileHandler',
  'qowtRoot/dcp/paragraphHandler',
  'qowtRoot/dcp/sectionHandler',
  'qowtRoot/dcp/seriesHandler',
  'qowtRoot/dcp/sheetCellHandler',
  'qowtRoot/dcp/sheetChartPositionHandler',
  'qowtRoot/dcp/sheetRowHandler',
  'qowtRoot/dcp/smartArtHandler',
  'qowtRoot/dcp/unknownObjectHandler',
  'qowtRoot/dcp/updateColumnHandler',
  'qowtRoot/dcp/updateRowHandler',
  'qowtRoot/dcp/updateSheetContentHandler',
  'qowtRoot/dcp/wordArtHandler',
  'qowtRoot/dcp/WordChartPositionHandler',
  'qowtRoot/dcp/wordStylesHandler',
  'qowtRoot/dcp/wordStyleHandler',
  'qowtRoot/dcp/sheetImageHandler',
  'qowtRoot/dcp/drawingHandler'
], function(TypeUtils) {

  'use strict';

  var handlers = {};

  /**
   * Register a single handler
   * @param handler the handler to be register
   */
  var registerHandler = function(handler) {
    var type = handler.etp;
    if (type) {
      /**
       * if type is array then its a handler for multiple etps. deal with it.
       * e.g. shape handler which handles pic and sp dcp
       */
      if (TypeUtils.isList(type)) {
        for (var j = 0; j < type.length; j++) {
          handlers[type[j]] = handler;
        }
      } else {
        handlers[type] = handler;
      }
    } else {
      console.warn('Could not register DCP Handler because it does not have ' +
        'an etp property'
      );
    }
  };

  /**
   * Register handlers where input parameter is Arguments object
   * @param arguments the Arguments Object
   */
  var registerHandlers = function(argumentsObj) {
    for (var i = 0; i < argumentsObj.length; i++) {
      var handler = argumentsObj[i];
      if (handler !== undefined) {
        if (TypeUtils.isArgumentsObjectOrList(handler)) {
          registerHandlers(handler);
        } else {
          registerHandler(handler);
        }
      }
    }
  };

  // Remove the first argument so that we do no try to
  // register the typeUtils module as a DCP handler.
  registerHandlers(Array.prototype.slice.call(arguments, 1));

  return handlers;
});
