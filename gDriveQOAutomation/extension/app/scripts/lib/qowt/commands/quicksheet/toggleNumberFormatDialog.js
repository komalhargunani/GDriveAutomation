/**
 * @fileoverview Defines a ToggleNumberFormatDialog command including response
 * behaviours. This command instructs the workbook to toggle the visibility of
 * the number format dialog (ie. either hide or show it on the screen)
 *
 * @author Mikko Rintala (mikkor@google.com)
 * @constructor
 * @return {Object} A ToggleNumberFormatDialog command
 */
define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/controls/grid/workbook'
], function (
    CommandBase,
    Workbook) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==true, callsService==false)
        var _api = CommandBase.create('ToggleNumberFormatDialog', true, false);

        _api.doOptimistic = function () {
          Workbook.toggleNumberFormatDialog();
        };

        return _api;
      };

      // We create a new instance of the object by invoking the module
      // constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
