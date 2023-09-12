// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to update hidden state of slides
 *
 * @author amol.kulkarni@synerzip.com (Amol Kulkarni)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
    CommandBase,
    ThumbnailStrip) {

  'use strict';

  var _factory = {
    /**
     * Creates a new showSld command and returns it.
     *
     * @param {Object} command command data for the command
     * @return {Object} command object
     */
    create: function(command) {
      // don't try to execute if it's missing crucial data
      if (command === undefined) {
        throw new Error('Hide slide cmd missing command');
      }
      if (command.slideNumbers === undefined) {
        throw new Error('Hide slide cmd missing slideNumbers');
      }
      if (command.showSlide === undefined) {
        throw new Error('Hide slide cmd missing showSlide state');
      }

      // use module pattern for instance object
      var module = function() {
        var callsService = (command.type && command.type === 'dcpCommand') ?
                           false :
                           true;
        // extend edit base command
        var _api = CommandBase.create('showSld', true, callsService);

        /**
         * @override
         */
        _api.changeHtml = function() {
          var slides = command.slideNumbers;
          var numberOfSlides = slides.length;
          for (var i = 0; i < numberOfSlides; i++) {
            var slideNumber = slides[i] - 1;
            var slideWidget = ThumbnailStrip.thumbnail(slideNumber);
            var toHide = !(command.showSlide);
            slideWidget.setHiddenInSlideShow(toHide);
          }
        };

        if (command.type !== 'dcpCommand') {
          /**
           * Reverts the optimistic part of the request if the request fails
           */
          _api.doRevert = function() {
            var slides = command.slideNumbers;
            var numberOfSlides = slides.length;
            for (var i = 0; i < numberOfSlides; i++) {
              var slideNumber = slides[i] - 1;
              var slideWidget = ThumbnailStrip.thumbnail(slideNumber);
              var toHide = command.showSlide;
              slideWidget.setHiddenInSlideShow(toHide);
            }
          };

          /**
           * Return an object with the data to be used as the payload of
           * the DCP request.
           * Request manager will add the unique ID to this payload to
           * track and match client-server request-response
           * The name property is mandatory.
           *
           * @see qodcp/schemas/requests/show-slide-request-schema.json
           * @return  {Object} The JSON Payload data to send to the dcp service
           */
          _api.dcpData = function() {
            command.name = 'showSld';
            return command;
          };
        } else {
          // If its a Core generated command then the operation has already been
          // performed on Core so doRevert should not be defined.
          _api.doRevert = undefined;
        }

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
