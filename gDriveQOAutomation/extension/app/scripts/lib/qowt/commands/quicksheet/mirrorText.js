/**
 * @fileoverview Defines a MirrorText command including response behaviours.
 * This command instructs the workbook layout control to mirror the text in the
 * formula bar and in the floating editor
 *
 * @author Lorraine Martin (lorrainemartin@google.com)
 * @constructor
 * @return {Object} A MirrorText command
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
        var _api = CommandBase.create('MirrorText', true, false);

        _api.doOptimistic = function () {
          Workbook.mirrorText();
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
