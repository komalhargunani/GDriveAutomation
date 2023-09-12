
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview text mutation tool helper that handles all mutations
 * on a text node
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'third_party/lo-dash/lo-dash.min',
  'qowtRoot/third_party/diff_match_patch/diff_match_patch'
  ], function(
    Features,
    NodeTagger,
    Tags,
    EnvModel,
    PubSub
    /*lo-dash*/
    /* diff_match_patch() */) {

  'use strict';

  /* eslint-disable new-cap */
  var _dmp = new diff_match_patch();
  /* eslint-enable new-cap */

  /**
   * A span can have multiple TEXT_NODEs, thus if one of them
   * changes, we need to work out what it's relevant char offset
   * is. Worst still, the previous sibling TEXT_NODEs themselves
   * can have been deleted/moved/changed. So we need to work out
   * what our offset was PRIOR to the mutation, in order to tell
   * the core correctly about the mutation.
   *
   * @param {Mutation Summary Object} summary the mutation summary object
   * @param {TEXT_NODE} node the text node for which to find the char offset
   * @return {number} returns the character offset of the given text node
   */
  function _textNodeOffset(summary, node) {
    var textNodeOffset = 0;
    if (node.nodeType === Node.TEXT_NODE) {
      var sibling = _getPrevSibling(summary, node);
      while (sibling && (sibling.nodeType === Node.TEXT_NODE)) {
        var text = _getTextContent(summary, sibling);
        textNodeOffset += text.length;
        sibling = _getPrevSibling(summary, sibling);
      }
    }
    // TODO(vinaya.mandke): We will not need the following check once we have
    // our own contextmenu. Currently before edit, we unflow a paragraph. This
    // ensures that on text edit we have the same run in dom as we have at core.
    // However on changing text using the spellcheck interface there is no
    // before-edit event fired which can enable us to do the text corrections.
    // So we need to rely on the following check, to ensure that we send correct
    // text offset to core.
    var run = node.parentNode;
    if (run && run.isFlowing && run.isFlowing()) {
      var flowStart = run.flowStart();
      while (run !== flowStart) {
        run = run.flowFrom;
        _.forEach(run.childNodes, function(child) {
          if (child.nodeType === Node.TEXT_NODE) {
            textNodeOffset += _getTextContent(summary, child).length;
          }
        });
      }
    }
    return textNodeOffset;
  }

  function _getPrevSibling(summary, node) {
    return (NodeTagger.hasTag(node, Tags.DELETED)) ?
        summary.getOldPreviousSibling(node) : node.previousSibling;
    }

  function _getTextContent(summary, node) {
    return (NodeTagger.hasTag(node, Tags.CHARDATA)) ?
        summary.getOldCharacterData(node) : node.textContent;
  }

  function _insertText(summary, spanEid, nodeId, offset, text) {
    if (Features.isEnabled('logMutations')) {
      console.log("insert text in nodeId: " + nodeId +
          " which is EID: " + spanEid +
          " @" + offset +
          " with length: " + text.length);
    }

    summary.__requiresIntegrityCheck.push(spanEid);

    PubSub.publish('qowt:doAction', {
      'action': 'insertText',
      'context': {
        'contentType': 'mutation',
        'spanEid': spanEid,
        'nodeId': nodeId,
        'offset': offset,
        'text': text
      }
    });
  }

  function _deleteText(summary, spanEid, nodeId, offset, text) {
    if (Features.isEnabled('logMutations')) {
      console.log("delete text in nodeId: " + nodeId +
          " which is EID: " + spanEid +
          " @" + offset +
          " with length: " + text.length);
    }

    summary.__requiresIntegrityCheck.push(spanEid);

    PubSub.publish('qowt:doAction', {
      'action': 'deleteText',
      'context': {
        'contentType': 'mutation',
        'spanEid': spanEid,
        'nodeId': nodeId,
        'offset': offset,
        'text': text
      }
    });
  }


  // handle a complete text node having been added
  // which is the same as insert text in the parent span
  function _handleTextNodeAdded(summary, node) {
    summary = summary || {};
    if (Features.isEnabled('logMutations')) {
      console.log('TEXT_NODE added');
    }
    if (node.nodeType !== Node.TEXT_NODE) {
      console.warn('TextNode mutation handler - ignoring non text node');
    } else {

      // dont bother creating commands to add "nothing"
      if (node.textContent.length === 0) {
        return;
      }

      // find our offset (there can be other text nodes to our left)
      var textNodeOffset = _textNodeOffset(summary, node);
      var spanNode = node.parentNode;
      var spanEid = spanNode.getAttribute('qowt-eid');
      _insertText(summary, spanEid, spanNode.id,
                  textNodeOffset, node.textContent);
      }
    }


  function _handleTextNodeDeleted(summary, node) {
    if (Features.isEnabled('logMutations')) {
      console.log('TEXT_NODE deleted');
    }
    if (node.nodeType !== Node.TEXT_NODE) {
      console.warn('TextNode mutation handler - ignoring non text node');
    } else {

      var textNodeOffset = _textNodeOffset(summary, node);

      // JELTE TODO: I think there is a bug on summary library
      // where a node is NOT listed as a "chardata changed" node
      // but only as a "removed" node. Yet the text is only found
      // in getOldCharData... this should not be possible. We can
      // work around this by trying getOldCharacterData and falling
      // back on textContent if it fails
      var textToDelete;
      try {
        textToDelete = summary.getOldCharacterData(node);
      } catch(e) {
        textToDelete = node.textContent;
      }

      // HACK ALERT - due to bug http://crbug/319499
      // we have to place empty textnodes in inline images...
      // Deleting these and pretending they are true text
      // causes all sorts of issues. More to the point, if
      // we ever try to delete an EMPTY text node, there really
      // is no point. So ignore empty text nodes all together for delete
      // trim() is required as we get empty text nodes
      // of the html files in shady dom

      if(EnvModel.app === 'word') {
        if (textToDelete.trim().length === 0) {
          return;
        }
      } else {
        if (textToDelete.length === 0) {
          return;
        }
      }

      var spanNode = summary.getOldParentNode(node);
      var spanEid = spanNode.getAttribute('qowt-eid');

      _deleteText(summary, spanEid, spanNode.id, textNodeOffset, textToDelete);
    }
  }

  function _handleTextNodeMoved(summary, node) {
    if (Features.isEnabled('logMutations')) {
      console.log('TEXT_NODE moved');
    }

    var oldParent = summary.getOldParentNode(node);
    var oldEid = oldParent.getAttribute('qowt-eid');
    var oldOffset = _textNodeOffset(summary, node);

    var newParent = node.parentNode;
    var newEid = newParent.getAttribute('qowt-eid');
    var newOffset = _textNodeOffset(summary, node);

    if (Features.isEnabled('logMutations')) {
      console.log('handle text node move (eg delete+insert),' +
          ' old parent: ' + oldParent.id +
          ' new parent: ' + newParent.id);
    }

    // this node can also have had it's text changed
    // and since we sequence MOVE before TEXTCHANGE we should
    // be reporting the OLD text here.
    var textContent;
    try {
      textContent = summary.getOldCharacterData(node);
    } catch(e) {
      // data hadn't changed; use current;
      textContent = node.textContent;
    }

    _deleteText(summary, oldEid, oldParent.id, oldOffset, textContent);
    _insertText(summary, newEid, newParent.id, newOffset, textContent);
  }


  // handle the text of a textnode having changed
  function _handleCharDataChanged(summary, node) {
    if (Features.isEnabled('logMutations')) {
      console.log('TEXT_NODE char data changed');
    }
    if (node.nodeType !== Node.TEXT_NODE) {
      console.warn('TextNode mutation handler - ignoring non text node');
    } else if (!(node.parentElement instanceof QowtWordPara)) {
      // find our offset (there can be other text nodes to our left)
      var textNodeOffset = _textNodeOffset(summary, node);

      var spanNode = node.parentNode;
      var spanEid = spanNode.getAttribute('qowt-eid');

        // now diff the old and new text and construct
        // insert vs delete commands respectively
        var oldText = summary.getOldCharacterData(node);
        var newText = node.textContent;
        var diffs = _dmp.diff_main(oldText, newText);

        var charCounter=0;
        diffs.forEach(function(diff) {
          var typeOfDiff = diff[0];
          var text = diff[1];
          switch (typeOfDiff) {
          case 1:
            // this section is new; need to add
          _insertText(summary, spanEid, spanNode.id,
                      textNodeOffset + charCounter, text);
            charCounter += Array.from(text).length;
            break;
          case -1:
            // this section has been deleted
          _deleteText(summary, spanEid, spanNode.id,
                      textNodeOffset + charCounter, text);
            break;
          default:
            // add length of the sections of text that have not changed
            charCounter += Array.from(text).length;
            break;
          }
        });
      }
    }

  return {
    /**
     * The config object used to register this translator to the mutation
     * registry.
     */
    translatorConfig: [
      {
        filterConfig: {
          type: Tags.DELETED,
          nodeType: Node.TEXT_NODE
        },
        callback: _handleTextNodeDeleted
      },
      {
        filterConfig: {
          type: Tags.ADDED,
          nodeType: Node.TEXT_NODE
        },
        callback: _handleTextNodeAdded
      },
      {
        filterConfig: {
          type: Tags.MOVED,
          nodeType: Node.TEXT_NODE
        },
        callback: _handleTextNodeMoved
      },
      {
        filterConfig: {
          type: Tags.CHARDATA,
          nodeType: Node.TEXT_NODE
        },
        callback: _handleCharDataChanged
      }
    ]
  };
});
