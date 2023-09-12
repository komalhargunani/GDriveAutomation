/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * get Slide content command definition
 * @param {Object} rootEl root element of the PPT area.
 * @param {Number} Slide number for which contents are requested.
 * @param {Number} Total number of slides in the PPT
 * @constructor
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/env',
  'qowtRoot/models/point',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/controls/point/animation/animationContainer',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/utils/cssManager'
], function(
    PubSub,
    CommandBase,
    DomListener,
    EnvModel,
    PointModel,
    ContentRenderError,
    AnimationContainer,
    LayoutsManager,
    CSSManager) {

  'use strict';

  var _factory = {

    create: function(rootEl, slideNumber) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create('getSlideContent', false, true);

        /**
         * Ensure the command knows the root node to process DCP response
         * in to.
         */
          // for performance boost up we use document fragment,
          // we cache rootNode into _parentNode and on success we
          // append document fragment to rootNode
        var _parentNode = rootEl;
        _api.rootEl = document.createDocumentFragment();
        // Holds slides transition data map
        var _slideTransitions = PointModel.slideTransitions;
        /**
         * Return an object with the data to be used as the payload of the
         * DCP request.
         * Request manager will add the unique ID to this payload to track
         * and match client-server request-response
         * The name property is mandatory.
         *
         * @return  {Object} The JSON Payload data to send to the dcp service
         * @see     TODO need dcp schema reference!
         */
        _api.dcpData = function() {
          var payload = {
            name: "gSld",
            sn: slideNumber
          };
          return payload;
        };

        /**
         * Saves the slide index in AnimationQueueManager.
         * TODO: Remove this method and the dependency of this module with
         * AnimationContainer and use instead the 'qowt:slideLoaded' signal
         * to send the slide index to AnimationContainer.
         */
        _api.preExecuteHook = function() {
          // Saves the slide index in AnimationContainer
          AnimationContainer.setDcpSlideIndex(slideNumber - 1);
        };

        /**
         * Callback for command-specific failure behaviour
         *
         * @override
         * @see     src/commands/qowtCommand.js
         * @param   response {DCP Response | undefined} The failing DCP
         *          response from service call or undefined if optimistic
         *          handling failure.
         * @param   errorPolicy {object} A policy object used to determine
         *          what behaviour to use in handling the response.
         *
         */
        _api.onFailure = function(response, errorPolicy) {
          console.warn("getSlideContent command onFailure() called: " +
            response.e);

          var rsp = ContentRenderError.create();
          rsp.fatal = (slideNumber === undefined);
          if (errorPolicy) {
            errorPolicy.eventDispatched = true;
          }
          PubSub.publish('qowt:error', rsp);
        };

        /**
         * Hook for any command-specific behaviour you may have.
         * Invoked after the framework has processed any DCP response
         * Only called for after successful responses
         * CommandBase provides a try block to catch exceptions
         * generated herein.
         *
         * @param   response {DCPresponse}    The newly handled response object
         * @override
         * @see     src/commands/qowtCommand.js
         */
        _api.onSuccess = function(response) {
          // console.log("Inside getSlideContent - onSuccess " + slideNumber);

          /**
           * Temporary slide transition data.
           * TODO when DCP is ready to send transition data for a slide
           * remove this temporary data
           */
          var tempTransition = {
            "effect": {
              "type": "cut"
            },
            "spd": "fast" //fast|med|slow. fast is default
            //                    "advTm": "5000"  // advance time
          };

          /**
           * Update slide transition data against slide number.
           * slide number is 1 based, and slide transition data map expects
           * it to be in 0 based.
           */
          if (_slideTransitions[slideNumber - 1] === undefined) {
            //TODO remove temporary transition data when DCP is ready to
            // send it
            _slideTransitions[slideNumber - 1] = response.elm[0].transition ||
              tempTransition;
          }

          // on success we attach document fragment (_api.rootEl) to
          // actual rootNode (_parentNode)
          _parentNode.appendChild(_api.rootEl);

          var _rsp = {"root": rootEl, "sn": slideNumber};

          LayoutsManager.preSlideClone();

          CSSManager.flushCache();

          // TODO: Use PubSub signals instead of DOM events
          DomListener.dispatchEvent(EnvModel.rootNode, 'qowt:slideLoaded',
            _rsp);

          // console.profileEnd("slide " + slideNumber);
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
