// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview DCP Manager; DCP Manager is responsible for
 * initialising the various handlers. It also includes the routine to actually
 * iterate through a nested DCP element stream to handle the content.
 * Lastly, it provides a simple routine to produce a wrapper "scrollable" div.
 * This can be used by the handlers if they render content that is likely to
 * require scrolling.
 *
 * @author jliebrand@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/models/env',
  'qowtRoot/models/fileInfo',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/dcp/dcpHandlersManifest',
  'qowtRoot/dcp/utils/appUtils'], function(
  EnvModel,
  FileInfo,
  PubSub,
  TypeUtils,
  PromiseUtils,
  AllHandlers,
  AppUtils) {

  'use strict';

  /**
   * @private Constant used to split processing of DCP Response into time-bound
   *          chunks to allow other JS code to run.
   *
   * This used to be 40ms for all apps, but for the new polymer word, this was
   * non optimal. After manual testing, we found we got a much smoother and
   * non-janky app at 10ms. However, that caused a massive delay in point.
   * Unfortunately this is very much a "feel factor". We can test the total time
   * to render a document, but optimising for that will bite you on jank. So for
   * now we will keep sheet and point at their original values, but we should
   * experiment with this value (on various platforms) to see what the optimal
   * values are.
   *
   * Size is time in milliseconds.
   */
  var RESPONSE_PROCESSING_CHUNK_SIZE_ = {
    word: 10,
    sheet: 40,
    point: 40
  };

  var api_ = {

    /*
     * Public variables These need to be public so that they can be accessed
     * outside of this dcp manager
     */
    handlers: undefined,

    /**
     * Parses and renders a DCP response using handlers registered by
     * registerHandler.
     *
     * @param res {Object} the DCP response.
     * @param DOMNode {Node} the root node of the DOM tree to render into.
     * @param opt_clock {Object} an optional clock object for injecting during
     *     testing.
     * @param opt_clock.getDate {Function} returns the current time as a Date
     *     object, or as a number.
     * @param cancelPromise {Promise} reject this in order to cancel the
     *     response processing.
     * @returns {Future} the un-started future that performs the DCP parsing.
     */
    processDcpResponse: function(res, DOMNode, opt_clock, cancelPromise) {
      var isMacroEnabled;

      // When the editing has been done on a file and saved. We need to
      // enable/disable the sharing options from menubar & Share button.
      if (AppUtils.isFileRoundTripped(res)) {
        AppUtils.editSharingOptions(res);
      } else {
        isMacroEnabled = AppUtils.isMacroEnabledFile(FileInfo.displayName);
        // No display name in FileInfo, which means there has been only
        // editing action took place. Hence no need to republish the signals.
        if (FileInfo.displayName !== undefined) {
          if (isMacroEnabled) {
            PubSub.publish('qowt:openedMacroEnabledFile');
          } else {
            PubSub.publish('qowt:openedNormalFile');
          }
        }
      }

      TypeUtils.checkArgTypes('dcpManager.processDcpResponse', {
        // function is permitted for res because, apparently, some tests pass
        // in a function for that argument.
        res: [res, 'object', 'function'],
        DOMNode: [DOMNode, 'node'],
        opt_clock: [opt_clock, 'undefined', 'object'],
        cancelPromise: [cancelPromise, 'promiseLike']
      });
      var synchronousTimer_,
          currentDOMNode_,
          breadCrumb_ = [];

      if (opt_clock === undefined) {
        opt_clock = systemClock_;
      }

      function iterate_() {
        return Promise.race([
          // This Promise.race allows for interruptibility. If cancelPromise is
          // rejected, this loop terminates, and the promise rejects to
          // cancelPromise's rejection reason. This way, the owner of
          // cancelPromise can essentially push an "interrupt button", and
          // wait for this promise to finish with cancelPromise's reason.
          cancelPromise,
          PromiseUtils.delay()
        ]).then(function() {
          // make sure we still have handlers to process the response
          // we could have received a qowt:disable which means we will have
          // killed all handlers.
          if (api_.handlers && doProcessDCPResponse_()) {
            return iterate_();
          }
        });
      }

      return iterate_();

    // BIG JELTE TODO: we should create a JsonIterator, which hides
    // all this breadcrumb stuff away.
    // something like:
    // _dcpIterator = _dcpIterator || JsonIterator.create(response, 'elm',
    // visitFunc, [postTraverseFunc]);
    // while (!_timeOut && _dcpIterator.nextNode()) {
    // _dcpIterator.processCurrentNode();
    // checkTimer(_timeOut);
    // }

      /**
       * Process DCP response nested JSON. Using breadCrumbs to find the current
       * dcp element to handle, so that we can handle each element on a timeout
       * which gives the system control back and thus does not block the UI
       *
       * @method processDCPResponse(res,DOMNode,callBack,dataParams)
       */
      function doProcessDCPResponse_() {
        PubSub.publish('qowt:stateChange', {
          module: 'dcpManager',
          state: 'processing'
        });

        if (synchronousTimer_ === undefined) {
          synchronousTimer_ = opt_clock.getDate();
        }

        if (!currentDOMNode_) {
          currentDOMNode_ = DOMNode;
          res.associatedDOM = DOMNode;
        }

        if (breadCrumb_.length === 0) {
          // start with first element in response (at position zero in the
          // array)
          breadCrumb_.push(0);
        }

        var done, rescheduled = false;
        do {

          // get element at our breadCrumb position
          var el = getDCPElement_(res, breadCrumb_);
          if (el !== undefined) {
            handleDCPElement_(el, 'visit');

            // if el has children, extend our breadcrumb to handle first child
            // next
            if ((el.elm !== undefined) && (el.elm.length > 0)) {
              breadCrumb_.push(0);
            } else {
              // this element has no children. Need to re-get it so that the
              // currentDom node and associated nodes are set, then call
              // PostTraverse
              // on it and then move on to the next peer at this level
              el = getDCPElement_(res, breadCrumb_);
              handleDCPElement_(el, 'postTraverse');
              breadCrumb_[breadCrumb_.length - 1]++;
            }
          } else {
            // reached the final crumb at this nested level. Pop the crumb
            // to go up one level, then call postTraverse on the parent, and
            // then increase that crumb to handle the parents sibling next.
            breadCrumb_.pop();
            if (breadCrumb_.length > 0) {
              var parent_ = getDCPElement_(res, breadCrumb_);
              handleDCPElement_(parent_, 'postTraverse');

              if (currentDOMNode_ !== undefined &&
                  currentDOMNode_.flowInto !== undefined) {
                var lastNode = currentDOMNode_.flowInto;
                while (lastNode.flowInto) {
                  lastNode = lastNode.flowInto;
                }
                currentDOMNode_ = lastNode;
              }

              breadCrumb_[breadCrumb_.length - 1]++;
            }
          }

          if (breadCrumb_.length > 0) {
            // Chunk the response processing into time-bound chunks on a
            // timeout. This gives control back to the javascript to
            // ensure the user can scroll without any hindrance.
            // We can tweak this value to see what gives the best balance
            // between loading speed and user interaction
            // NOTE: we ONLY do this if we are NOT hidden. If we are hidden
            // (ie the tab is in the background), then there is no need to
            // reschedule because we are not creating jank in the background!
            var currentTime = opt_clock.getDate();

            // default to 50ms (if we dont have an app - eg running unit tests)
            var rescheduleTime =
                RESPONSE_PROCESSING_CHUNK_SIZE_[EnvModel.app] || 50;

            if (!document.webkitHidden && (currentTime - synchronousTimer_) >
                  rescheduleTime) {
              // rescheduling the process loop means the JS engine will regain
              // control to allow user interaction, but
              // this also means that the DOM will be converted to the Render
              // Tree (layout) and drawn.
              synchronousTimer_ = undefined;
              rescheduled = true;
           }

          } else {
            PubSub.publish('qowt:finishedDCPLoop', {});
            done = true;
          }

        } while (!done && !rescheduled);

        PubSub.publish('qowt:stateChange', {
          module: 'dcpManager',
          state: 'idle'
        });

        return rescheduled;
      }

      /**
       * Given a DCP Element, checks the element type and lets the correct
       * handler visit the element. Updates the currentDOMNode pointer, and
       * marks the element as "handled"
       *
       * @param el
       *          {object} DCP element to visit
       * @param funcName
       *          {string} optional parameter to indicate which function on the
       *          handler to call when handling the element. Defaults to
       *          'visit', but can be anything. We use this mainly to call
       *          'postTraverse' on the handler once all this element's children
       *          have already been handled. This allows handlers to postpone
       *          activity until after all children elements have been handled.
       *          The paragraph handler for example only appends it's node to
       *          the DOM *after* the nested character runs have been added to
       *          increase performance.
       * @api private
       * @method handleDCPElement_(el,funcName)
       */
      function handleDCPElement_(el, funcName) {
        funcName = funcName || 'visit';
        var elementType = el.etp;
        if (elementType) {
          if (api_.handlers[elementType]) {
            if (api_.handlers[elementType][funcName]) {
              var visitable = {
                node: currentDOMNode_,
                el: el
              };
              currentDOMNode_ = api_.handlers[elementType][funcName].
                                call(undefined, visitable) || currentDOMNode_;
            }
          }
        }
        el.associatedDOM = currentDOMNode_;
        el.handled = true;
      }


      /**
       * Function to retrieve a specific DCP element from a nested JSON
       * response. uses a breadcrumb to retrieve the element, or returns
       * undefined. Also updates the notion of the currentDOMNode
       *
       * @param response
       *          {object} Nested JSON object containing DCP response
       * @param breadCrumb
       *          {array} array of nesting levels, from which to retrieve the
       *          DCP element
       * @return {object} Returns DCP element, or undefined
       * @api private
       * @method getDCPElement_(response,breadcrumb)
       */
      function getDCPElement_(response, breadCrumb) {
        var el = response;
        if (el.elm === undefined) {
          return undefined;
        }
        for (var i = 0, j = breadCrumb.length; i < j; i++) {
          if ((el !== undefined) && (el.elm !== undefined)) {

            // if the associated DOM node is flowing, then update
            // the currentDOMNode to bee the last node in the flow-chain
            if (el.associatedDOM !== undefined &&
                el.associatedDOM.flowInto !== undefined) {
              var lastNode = el.associatedDOM.flowInto;
              while (lastNode.flowInto) {
                lastNode = lastNode.flowInto;
              }
              currentDOMNode_ = lastNode;
            } else {
              currentDOMNode_ = el.associatedDOM || currentDOMNode_;
            }

            // now traverse into children
            el = el.elm[breadCrumb[i]];
          }
        }
        return el;
      }
    }
  };

  // PRIVATE ===================================================================

  var systemClock_ = {
    getDate: function() {
      return new Date();
    }
  };

  /**
   * Triggered by qowt:init signals
   * Initialize the module.
   */
  var initialized_ = false;
  function init_() {
    if (!initialized_) {
      api_.handlers = AllHandlers;
      for (var handler in AllHandlers) {
        if (handler && api_.handlers && api_.handlers[handler] &&
            TypeUtils.isFunction(api_.handlers[handler].init)) {
          api_.handlers[handler].init();
        }
      }
      initialized_ = true;
    }
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners,
   * and reset all internal state.
   */
  function disable_() {
    for (var handler in AllHandlers) {
      if (handler && api_.handlers && api_.handlers[handler] &&
          TypeUtils.isFunction(api_.handlers[handler].disable)) {
        api_.handlers[handler].disable();
      }
    }
    api_.handlers = undefined;
    initialized_ = false;
  }

  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except
  // subscribe to qowt:init qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
  })();

  return api_;

});
