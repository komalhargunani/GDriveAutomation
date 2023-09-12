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
 * Defines a command to getSlideLayout
 * @param rootEl root-element of the slide
 * @param slideNumber
 * @return {Object} getSlideLayout command
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/commandBase',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/utils/cssManager',
  'qowtRoot/widgets/point/slidesContainer'
  ], function(
    PubSub,
    CommandBase,
    DeprecatedUtils,
    PointModel,
    LayoutsManager,
    ContentRenderError,
    CSSManager,
    SlidesContainer) {

  'use strict';


  var _factory = {

    create: function(rootEl, slideNumber) {

      // use module pattern for instance object
      var module = function() {

        // extend default command (optimistic==false, callsService==true)
        var _api = CommandBase.create("getSlideLayout", false, true);

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

          var slideLayoutCache =
              PointModel.slideLayoutMap[PointModel.SlideLayoutId];

          if (slideLayoutCache !== undefined) {

            var clonedLayoutDivId = PointModel.SlideLayoutId + 'cloned' +
              slideNumber;

            if (LayoutsManager.isReRenderingCurrentSlide() === false) {
              // we already have this - 'skip' command & clone what we
              // have already to the correct place
              // console.log("GetSlideLayout using cache for slide "
              // + slideNumber);
              _api.makeNullCommand();
              var clonedDiv = DeprecatedUtils.
                  cloneAndAttach(
                  slideLayoutCache.refDiv, rootEl, clonedLayoutDivId);
              var hideParentSpAttribute =
                  slideLayoutCache.refDiv.getAttribute('qowt-hideParentSp');
              if (hideParentSpAttribute === 'true') {
                clonedDiv.setAttribute('qowt-hideParentSp','true');
              }
            } else {
              //When required to re-render the layout, it removes the
              // already added layout div.
              SlidesContainer.
                  removeAddedLayout(rootEl, PointModel.SlideLayoutId);

              if (!SlidesContainer.isThumbClonedCompletely(slideNumber) &&
                slideNumber === 1) {
                SlidesContainer.getCurrentSlideWidget().empty();
              }
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
            name: "gSldLt",
            eidlt: PointModel.SlideLayoutId
          };
          return payload;
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
        _api.onSuccess = function(/* response */) {
          // console.log("Inside getSlideLayout - onSuccess " + slideNumber);

          // on success we attach document fragment (_api.rootEl) to
          // actual rootNode (_parentNode)
          _parentNode.appendChild(_api.rootEl);
          CSSManager.flushCache();
        };


        /**
         * Callback for command-specific failure behaviour
         *
         * @override
         * @see     src/commands/qowtCommand.js
         * @param response {DCP Response | undefined} The failing DCP
         * response from service call
         *         or undefined if optimistic handling failure.
         * @param errorPolicy {object} A policy object used to determine
         * what behaviour to use in
         *         handling the response.
         */
        _api.onFailure = function(response, errorPolicy) {
          console.warn("getSlideLayout command onFailure() called: " +
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
