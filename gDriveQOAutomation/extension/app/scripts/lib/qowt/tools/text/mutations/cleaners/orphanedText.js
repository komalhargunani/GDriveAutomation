
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview mutation tool cleaner to wrap newly inserted text nodes
 * in a span element if they were inserted directly in to a paragraph
 *
 * This is a singleton
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/env'], function(
    Features,
    NodeTagger,
    Tags,
    DomUtils,
    EnvModel) {

  'use strict';

  var _selCache;

  // TODO(jliebrand): the text tool should probably create a snapshot
  // pre-cleaning and restore it using the SelectionManager, rather than
  // having individual cleaners be responsible for this crap.
  function _resetCache() {
    _selCache = {
      start: undefined,
      end: undefined
    };
  }

  function _cacheSelection(node) {
    _resetCache();
    var sel = window.getSelection();
    var range = (sel.rangeCount>0) ? sel.getRangeAt(0) : undefined;
    _selCache.start = (range && range.startContainer === node) ?
        range.startOffset : undefined;
    _selCache.end = (range && range.endContainer === node) ?
        range.endOffset : undefined;
  }

  function _restoreSelection(node) {
    var sel = window.getSelection();
    var newRange = (sel.rangeCount > 0) ?
        sel.getRangeAt(0) : document.createRange();
    if (_selCache.start) {
      newRange.setStart(node, _selCache.start);
    }
    if (_selCache.end) {
      newRange.setEnd(node, _selCache.end);
    }
    if (_selCache.start || _selCache.end) {
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }

  function _findOrphanedText(summary, node) {
    var parent = node.parentNode;
    if (parent.tagName === 'SPAN') {
      // In QW, a temporary run was added to handle the button bar for
      // paragraph with characterFormatting. Use this run to insert the
      // orphaned text.
      if (parent instanceof QowtWordRun && !parent.getEid()) {
          NodeTagger.tag(parent, Tags.ADDED);
          summary.__additionalAdded.push(parent);
      }

      // In QW, run was added to handle the formatting properties for
      // line break.
      if (parent instanceof QowtLineBreak) {
        var span;
        if (EnvModel.app === 'word') {
          span = new QowtWordRun();
        } else if (EnvModel.app === 'point') {
          span = new QowtPointRun();
        }
        span.setModel(_.omit(parent.model, 'btp'));
        var prevSibling = parent.previousElemenetSibling;
        if (prevSibling) {
          DomUtils.insertAfter(span, prevSibling);
        } else {
          var para = parent.parentNode;
          DomUtils.insertAtStart(span, para /*reference node*/);
        }
        NodeTagger.tag(span, Tags.ADDED);
        span.appendChild(node);
        summary.__additionalAdded.push(span);
      }
    } else {
      if (Features.isEnabled('logMutations')) {
        console.log('Found orphaned text, wrapping it in a span');
      }

      _cacheSelection(node);

      // if we have a span as a sibling, then
      // move this orphaned textnode under the sibling
      var nextSibling = node.nextElementSibling;
      if (nextSibling && nextSibling.nodeName === 'SPAN' &&
          nextSibling.contentEditable !== "false") {
        DomUtils.insertAtStart(node, nextSibling /*reference node*/);
      } else {
        prevSibling = node.previousElementSibling;
        if (prevSibling && prevSibling.nodeName === 'SPAN' &&
            prevSibling.contentEditable !== "false") {
          DomUtils.insertAtEnd(node, prevSibling /*reference node*/);
        } else {
          // no spans as siblings, create a new span
          // and add it before the textnode. Then move
          // the textnode inside the span
          if (EnvModel.app === 'word') {
            span = new QowtWordRun();
          } else if (EnvModel.app === 'point') {
            span = new QowtPointRun();
          }

          NodeTagger.tag(span, Tags.ADDED);
          parent.insertBefore(span, node);
          span.appendChild(node);

          // NOTE: be careful with __additionalAdded array. It *will*
          // be cleaned as well (to ensure it gets IDs for example), but
          // we only do this once. So if we add new nodes as a result of
          // cleaning the __additionalAdded array, things will be broken!
          summary.__additionalAdded.push(span);
        }
      }

      _restoreSelection(node);
    }
  }

  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED,
        nodeType: Node.TEXT_NODE
      },
      callback: _findOrphanedText
    }
  };
});
