/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview helper module to correctly insert
 * a new character run based on stored transient format
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/transientFormatting',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/env'], function(
  PubSub,
  TransientFormattingModel,
  DomTextSelection,
  DomUtils,
  EnvModel) {

  'use strict';

  var _api = {
    /**
     * If we have transient formatting stored, this function
     * will create a new span at the given caret position
     * The span will take the same formatting as the span at
     * the caret position, and then have the transient formatting
     * applied to it.
     * It also checks if the text input event which triggered
     * the check contains a carriage return. In that case we should
     * tell the model to "hold on" to any transient formatting it
     * has by ignoring the next selection change event that
     * would otherwise clear the model.
     *
     * @param {TextInput Event} evt The text input event that triggered us
     */
    createRunIfNeeded: function(evt) {
      // If the text input was an enter or return we do not
      // want to create a run and we do not want to clear
      // any active transient formatting, this behaviour
      // matches MSWord.
      if ((evt.data && (evt.data.charCodeAt(0) === 10 ||
          evt.data.charCodeAt(0) === 13)) ||
          evt.charCode === 10 ||
          evt.keyCode === 13) {
        TransientFormattingModel.holdValues();
      } else {
        var transientFormatting =
            TransientFormattingModel.getPendingTransientActions();
        if (transientFormatting.length > 0) {

          // breakRun will do nothing if caret is already at edge of run
          breakRun_();

          var run = getEligibleRun_() || createNewRun_(evt);

          formatRun_(run, transientFormatting);

          TransientFormattingModel.clearTransientValues();
          if (evt.code !== 'Space') {
            selectNewRun_(run);
          }
          return run;
        }
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv


  function breakRun_() {
    var range = DomTextSelection.getRange();

    if (range.startContainer.nodeType === Node.TEXT_NODE ||
        (range.startContainer instanceof QowtWordRun ||
        range.startContainer instanceof QowtPointRun)) {

      PubSub.publish('qowt:doAction', {
        'action': 'breakRun',
        'context': {
          'contentType': 'text',
          'node': range.startContainer,
          'offset': range.startOffset
        }
      });
    }
  }

  function getEligibleRun_() {
    var range = DomTextSelection.getRange();
    var run = range.startContainer;

    if (run instanceof QowtWordPara && run.isEmpty()
        && run.firstElementChild
        && run.firstElementChild.nodeName === 'SPAN') {
      run = run.firstElementChild;
    }
    if (run.nodeType === Node.TEXT_NODE) {
      run = run.parentNode;
    }
    if ((run instanceof QowtWordRun || run instanceof QowtPointRun)
        && run.isEmpty()) {
      return run;
    }
  }

  function createNewRun_(evt) {
    var range = DomTextSelection.getRange();
    var container = range.startContainer;

    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }

    // On Shady dom the paragraph starts and ends with textnodes
    // and the selection range's start/end offset can point to
    // them. Unfortunately these text nodes are not part of shady
    // dom. While finding the node to clone, these textnodes needs
    // to be taken into account. If the range.startOffset is > 0
    // but less than childNodes.length, we need to deduct 1. If the
    // startOffset is at the end we need to deduct 2.
    var offset = 0;
    if (range.startContainer instanceof QowtWordPara && 
      range.startOffset !== 0) {
      if (range.startOffset < range.startContainer.childNodes.length) {
        offset = range.startOffset - 1;
      } else {
        offset = range.startOffset - 2;
      }
    }
    var toClone = (container instanceof QowtWordRun ||
                   container instanceof QowtPointRun) ?
        container : container.children[offset];

    var newRun;
    if (toClone instanceof QowtWordRun || toClone instanceof QowtPointRun) {
      newRun = toClone.cloneMe();
    } else if (EnvModel.app === 'word') {
      newRun = new QowtWordRun();
    } else if (EnvModel.app === 'point') {
      newRun = new QowtPointRun();
    }

    if (EnvModel.app === 'word') {
      if (range.startContainer instanceof QowtWordPara) {
        if (range.startOffset === 0) {
          DomUtils.insertBefore(newRun, range.startContainer.children[0]);
        } else if (range.startOffset === 
            range.startContainer.childNodes.length) {
          range.startContainer.appendChild(newRun);
        }
      } else if (container instanceof QowtWordRun) {
        if (range.startOffset === 0) {
          DomUtils.insertBefore(newRun, container);
        } else {
          DomUtils.insertAfter(newRun, container);
        }
      } else if (container instanceof QowtHyperlink) {
        DomUtils.insertBefore(newRun, container);
      }
    } else {
      container.insertBefore(newRun,
        container.childNodes[range.startOffset]);
    }


    // Chrome does not allow us to set the caret in a complete empty
    // span, if it has neighbouring spans which are not empty. It treats
    // the empty span as not having a visible position. To work around this
    // we add a single space character inside the new span; we will
    // select this new span later, such that the newly added
    // printable character will replace this empty space.
    // This is the only way to ensure the caret does indeed end up
    // in this otherwise empty span...
    // JELTE TODO: this is ugly and we should really look at doing this better.
    if (evt.code !== 'Space') {
      newRun.appendChild(document.createTextNode(' '));
    }
    return newRun;
  }

  function formatRun_(run, formattingActions) {
    formattingActions.forEach(function(formatAction) {

      PubSub.publish('qowt:doAction', {
        'action': 'format',
        'context': {
          contentType: 'text',
          command: {
            node: run,
            formatting: formatAction.context.formatting
          }
        }
      });
    });
  }

  function selectNewRun_(run) {
    // if this was a new run, we will have added a space character
    // to it, so that we can select it, such that the up and coming
    // edit action will replace the space with a real character.
    // See note in createNewRun_ for more details
    if (run.textContent === ' ') {
      window.getSelection().selectAllChildren(run);
    }
  }

  return _api;

});
