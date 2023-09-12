define([
  'qowtRoot/tools/shape/shapeTool',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/tools/sheet/sheetChartTool',
  'qowtRoot/tools/sheet/sheetImageTool',
  'qowtRoot/tools/sheet/sheetTabTool',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/tools/point/slide'], function() {

  'use strict';

  var manifest_ = [].slice.call(arguments);

  return {
    getTools: function() {
      var tools = {};
      manifest_.forEach(function(toolArg) {
        if (toolArg && toolArg.name && !tools[toolArg.name]) {
          tools[toolArg.name] = toolArg;
        } else {
          throw new Error('Invalid tool in Manifest');
        }
      });
      return tools;
    }
  };

});
