// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview Defines a getDocFonts command factory.
 * This command queries for the font list contained within the document.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/errors/unique/corruptFileError'], function(
    CommandBase,
    CorruptFileError) {

  'use strict';


  var _factory = {

    /**
     * Factory method.
     * @return {object} a new instance of the getDocFonts command.
     */
    create: function() {

      // use module pattern for instance object
      var module = function() {

          // extend default command (optimistic==false, callsService==true)
          var _api = CommandBase.create('getDocFonts', false, true);


          /**
           * HACK ALERT; legacy core does not send "proper" dcp for
           * getDocFonts.... we need to convert it to proper dcp so
           * that our dcp handlers visit and handle it correctly
           *
           * JELTE TODO: Once either legacy core has been fixed, and/or
           * replace by the new pronto core (which should also make sure to
           * send this in proper dcp format), then we can remove this
           * response hook hack
           */
          _api.responseHook = function(response) {
            var rsp = response;
            if (!rsp.elm) {
              // response is not proper dcp; fix it
              // by adding a proper font list dcp element
              // which contains a flat array of font names (strings)
              var fontEtp = {
                etp: 'dfl',
                fl: []
              };
              rsp.f.forEach(function(font) {
                fontEtp.fl.push(font.fn);
              });
              rsp.elm = [];
              rsp.elm.push(fontEtp);
            }
            return rsp;
          };


          /**
           * Return the data to be used as the payload of the command.
           * The name property is mandatory.
           *
           * @return  {object} The JSON Payload to send to the dcp service
           */
          _api.dcpData = function() {
            return({
              name: "getDocFonts"
            });
          };

          /**
           * Throw a fatal error if the core failed.
           *
           * NOTE: this uses the new error handling (eg throw an exception)
           * and since that is a fatal exception, we no longer need to use
           * the old "errorPolicy" object anymore.
           *
           * @param {object} response The recevied DCP response.
           */
          _api.onFailure = function(response) {
            var failureMsg = _api.name + " command - failed: " + response.e;
            console.error(failureMsg);

            throw new CorruptFileError(failureMsg);
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