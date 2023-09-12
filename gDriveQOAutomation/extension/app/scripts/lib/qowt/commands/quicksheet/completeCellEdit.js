/**
 * @fileoverview Defines a CompleteCellEdit command including response
 * behaviours. This command instructs the workbook layout control to hide the
 * floating editor and to update the text in the formula bar if the edit was
 * cancelled
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @param cancelled {boolean or undefined} Optional flag indicating whether
 *        the edit was cancelled - true if it was, otherwise undefined
 * @param clickObj {obj or undefined} Optional node which we need to click on to
 *        finish the user action
 * @return {Object} A CompleteCellEdit command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/workbook'
], function (
    CommandBase,
    Workbook) {

  'use strict';

  var _factory = {

    create: function(cancelled, clickObj) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('CompleteCellEdit', true, false);

        _api.doOptimistic = function () {
          Workbook.completeCellEdit(cancelled, clickObj);
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
