/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview document integrity checker.
 *
 * For every element in the tree that is affected by an edit, we will run
 * an integrity test. We do this by using the getElementContent Core command
 * with childList == 'flat'. This will return the model for the element in
 * question, plus a flat array of it's children EID values. Thereby allowing
 * us to compare the element model AND the order of it's children.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/features/utils',
  'qowtRoot/commands/commandManager',
  'qowtRoot/commands/contentCheckers/hackUnsupportedProps',
  'qowtRoot/commands/contentCheckers/verifyDocContent',
  'qowtRoot/pubsub/pubsub'
 ], function(
  EnvModel,
  Features,
  CommandManager,
  HackUnsupportedProps,
  VerifyDocContentCmd,
  PubSub
 ) {

  'use strict';

  var _api = {

    /**
     * Start a document integrity check by passing an array of element
     * EIDs which require checks. If one or more of these elements is indeed
     * still in the DOM, this call will ensure the state of this module
     * changes to 'pending'; if none of the elements are in the DOM, the
     * state is reset to 'idle'.
     *
     * Once we receive responses from the core for every element we need
     * to check, the state will return to 'idle'. If any of the elements
     * fail their integrity check, a fatal error exception will be thrown
     *
     * @param {Array} nodesToVerify the EIDs which require integrity checks
     */
    begin: function(nodesToVerify) {
      _api.setStatePending();

      // TODO(jliebrand): ensure Point core supports getElementContent
      // command so that it can benefit from doc integrity tests!
      if (EnvModel.app === 'word') {
        for (var i = 0; i < nodesToVerify.length; i++) {
          // get our checksum for each section
          var nodeEid = nodesToVerify[i];
          var node = document.getElementById(nodeEid);

          // only need to check the node for integrity if it's still in the dom
          if (node) {
            var parentNode = Polymer.dom(node).parentNode;
            var elem = parentNode.getAttribute('qowt-divtype');
            if (_unsupportedElemTypes.indexOf(elem) === -1) {
              _getCoreChecksum(node);
              _api.incOutstandingChecks();
            }
          }
        }
      }
      if (_outstandingChecks === 0) {
        // all the nodes that required integrity checks could have
        // been deleted nodes and thus not in the DOM. In which case
        // there's nothing more to do
        _changeState('idle');
      }
    },

    /**
     * Used to set the doc checker's state to 'pending'. This is useful
     * if we know we will start a doc checker "soon" but not just yet.
     * This ensures that any WaitHelper in E2E tests will wait until
     * the DocChecker is truly idle...
     */
    setStatePending: function() {
      _state = 'pending';
    },

    /**
     * Query the Doc Checker state.
     * @return {Boolean} true if the Doc Checker is idle,
     *                   false if we are currently in a verification run.
     */
    isIdle: function() {
      // TODO(jliebrand): ensure Point core supports getElementContent
      // command so that it can benefit from doc integrity tests!
      return (EnvModel.app !== 'word')  || (_state === 'idle');
    },

    incOutstandingChecks: function() {
      _outstandingChecks++;
      _changeState('verifying doc');
    },

    decOutstandingChecks: function() {
      _outstandingChecks--;
      if (_outstandingChecks === 0) {
        _changeState('idle');
      }
    },


  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
  /**
   * @private
   * We publish our idle/busy state so that interactions tests can wait for
   * an appropriate signal.
   * Note, this should not suppress the text tool/mutation observers even though
   * they look for other modules that are actively changing html.
   */
  var _state = 'idle';
  var _outstandingChecks = 0;
  /**
   * This array contains all the types of elements which can't be verified using
   * the docChecker. The value of these types will always be different from
   * what core would be storing. Hence we have to prohibit these elements from
   * being verified with core since this would lead to crashing of QO.
   */
  var _unsupportedElemTypes = ['qowt-field-numpages'];

  function _changeState(newState) {
    if(_state !== newState) {
      _state = newState;
      PubSub.publish('qowt:stateChange', {
        module: 'docChecker',
        state: _state
      });
    }
  }

  function _getCoreChecksum(node) {

    function getChildList(node) {
      // make sure we loop through all flow nodes to get full child list
      // note: only the flowStart nodes have ID, so those are the only ones
      // we are interested in (otherwise we'd double count EIDs)
      var iter = node;
      var childList = [];
      do {
        var children = iter.querySelectorAll(':scope > [id]');
        // In shady DOM, when queried for elements having id attribute inside
        // table, it returns the contents wrapper(which we have added extra to
        // preserve styling) unlike shadow dom where it returns paragraph
        // elements.This results into dom sync error as Core does not know about
        // 'content wrapper' div. Hence firing the query for wrapper div instead
        // of 'td'.
        if(iter.nodeName === 'TD' && iter.firstElementChild &&
          iter.firstElementChild.id === 'contents') {
          children = iter.firstElementChild.querySelectorAll(':scope > [id]');
        }
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          var eid = child.getEid ? child.getEid() :
              child.getAttribute('qowt-eid') || child.id;
          if (eid.length > 0 && child.nodeName !== 'TEMPLATE') {
            childList.push(eid);
          }
        }

        if (iter.id === 'contents' && node.nodeName === 'TD') {
          iter = node.flowInto;
        } else {
          iter = iter.flowInto;
        }
      } while (iter);

      return childList;
    }

    // make sure we start at the start of a flow
    node = node.flowStart ? node.flowStart() : node;

    var eid = node.getEid ? node.getEid() :
              node.getAttribute('qowt-eid') || node.id;

    var expectedResponse = {
      element: _.omit(node.model, 'elm'),
      children: getChildList(node)
    };

    // TODO(jliebrand): remove this hack once all widgets
    // have been transformed to qowt elements
    if (!node.isQowtElement) {
      expectedResponse.element = {
        legacyWidget: eid
      };
    }

    expectedResponse =
        HackUnsupportedProps.removeUnsupportedProps(expectedResponse);

    if (Features.isEnabled('logMutations')) {
      console.log('DOC CHECKER EID: ' + eid);
    }

    // TODO(jliebrand): commands should be able to be promise-like
    // rather than passing a done callback like this...
    var cmd = VerifyDocContentCmd.create(
        eid, expectedResponse, _nodeVerificationDone);
    CommandManager.addCommand(cmd);
  }

  function _nodeVerificationDone() {
    _api.decOutstandingChecks();
  }

  return _api;
});