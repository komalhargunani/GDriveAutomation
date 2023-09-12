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
 * Defines a command to getMasterLayout
 * @param masterLayoutId master-layout id
 * @param rootEl root-element of the slide
 * @return {Object} getMasterLayout command
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/widgets/point/slidesContainer'
  ], function(
    PubSub,
    CommandBase,
    DeprecatedUtils,
    PointModel,
    ContentRenderError,
    LayoutsManager,
    CSSManager,
    SlidesContainer) {

  'use strict';

  var _factory = {

    create: function(rootEl, slideNumber) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create('getMasterLayout', false, true);

        /**
         * Ensure the command knows the root node to process DCP response
         * in to.
         */
          // for performance boost up we use document fragment,
          // we cache rootNode into _parentNode and on success we
          // append document fragment to rootNode
        var _parentNode = rootEl;
        _api.rootEl = document.createDocumentFragment();

        /**
         * check to see that we have the data for this in the cache
         * if we do - clone and use that instead of sending
         * un-necessary request to the service.
         */
        _api.preExecuteHook = function() {
          LayoutsManager.resetThumbToSlideMaps();

          var slideMasterCache =
              PointModel.masterLayoutMap[PointModel.MasterSlideId];
          if (slideMasterCache !== undefined) {

            var clonedMasterDivId = PointModel.MasterSlideId + 'cloned' +
              slideNumber;
            if (LayoutsManager.isReRenderingCurrentSlide() === false) {

              // we already have this - 'skip' command & clone what we
              // have already to the correct place
              // console.log("GetMasterLayout using cache for slide "
              // + slideNumber);

              _api.makeNullCommand();
              DeprecatedUtils.cloneAndAttach(slideMasterCache.refDiv, rootEl,
                clonedMasterDivId);
            } else {
              //When required to re-render the layout, it removes the
              // already added layout div.
              SlidesContainer.
                  removeAddedLayout(rootEl, PointModel.MasterSlideId);
            }

          }
        };

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
            name: "gSldMt",
            eidmt: PointModel.MasterSlideId
          };
          return payload;
        };

        /**
         * Hook for any command-specific behaviour you may have.
         * Invoked after the framework has processed any DCP response
         * Only called for after successful responses
         *
         * @param   response {DCPresponse}    The newly handled response object
         * @override
         * @see     src/commands/qowtCommand.js
         */
        _api.onSuccess = function(/* response */) {
          // console.log("Inside getMasterLayout - onSuccess " + slideNumber);

          // on success we append document fragment (_api.rootEl) to
          // actual rootNode (_parentNode)
          _parentNode.appendChild(_api.rootEl);
          CSSManager.flushCache();
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
         */
        _api.onFailure = function(response, errorPolicy) {
          console.warn("getMasterLayout command onFailure() called: " +
            response.e);

          var rsp = ContentRenderError.create();
          rsp.fatal = (slideNumber === undefined);
          if (errorPolicy) {
            errorPolicy.eventDispatched = true;
          }

          PubSub.publish('qowt:error', rsp);
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
