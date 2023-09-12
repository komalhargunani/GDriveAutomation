/**
 * @fileoverview Debug utility to log all changes in a mutation.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/utils/nodeTagger'], function(NodeTagger) {

  'use strict';

  var _api = {
    logMutations: function(summary) {
      _logMutations(summary);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  function _setUniqTag(node) {
    if(!node.__testTag) {
      node.__testTag = 'UNIQ-' + parseInt(Math.random(1000) * 1000, 10);
    }
  }

  function _setUniqId(summary) {
    var changes = summary.added;
    changes = changes.concat(summary.removed);
    changes = changes.concat(summary.reordered);
    changes = changes.concat(summary.reparented);
    changes = changes.concat(summary.characterDataChanged);
    var idChanges = summary.attributeChanged.id || [];
    changes = changes.concat(idChanges);

    changes.forEach(function(node) {
      _setUniqTag(node);
    });
  }

  function _logNodeId(node, prefix) {
    if(node) {
      console.log(prefix + ' ' + node.id + ' (' + node.__testTag + ')');
    } else {
      console.log(prefix + ' null');
    }
  }

  function _logMutations(summary) {
    console.log('--------------------------');
    console.log('mutation summary breakdown:');
    // give any added nodes a unique tag so we can identify them
    _setUniqId(summary);

    if(summary.added.length) {
      console.log('');
      console.log('ADDED:');
    }
    summary.added.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' added');
        _logNodeId(node, 'unique id:');
        console.log('textnode textContent: "' + node.textContent + '"');
        _logNodeId(node.parentNode, 'parent id:');
        _logNodeId(node.previousSibling, 'prev sibling id:');
        _logNodeId(node.nextSibling, 'next sibling id:');
        console.log('-------------');
      }
    });

    if(summary.removed.length) {
      console.log('');
      console.log('DELETED:');
    }
    summary.removed.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' removed');
        _logNodeId(node, 'unique id:');
        _logNodeId(summary.getOldParentNode(node), 'old parent id:');
        _logNodeId(summary.getOldPreviousSibling(node), 'old prev siblign:');
        console.log('-------------');
      }
    });


    var moved = summary.reordered.concat(summary.reparented);
    if(moved.length) {
      console.log('');
      console.log('MOVED:');
    }
    moved.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' moved');
        _logNodeId(node, 'unique id:');
        console.log('textnode textContent: "' + node.textContent + '"');
        _logNodeId(summary.getOldParentNode(node), 'old parent id:');
        _logNodeId(summary.getOldPreviousSibling(node), 'old prev sibling:');
        _logNodeId(node.parentNode, 'new parent id:');
        _logNodeId(node.previousSibling, 'new prev sibling:');
        console.log('-------------');
      }
    });

    if(summary.characterDataChanged.length) {
      console.log('');
      console.log('CHAR DATA CHANGED:');
    }
    summary.characterDataChanged.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' character data changed');
        _logNodeId(node, 'unique id:');
        _logNodeId(node.parentNode, 'parent id:');
        console.log('old: "' + summary.getOldCharacterData(node) + '"');
        console.log('');
        console.log('new: "' + (node.textContent || node.textContent) + '"');
        console.log('-------------');
      }
    });

    var styleChanges = summary.attributeChanged.style || [];
    if(styleChanges.length) {
      console.log('');
      console.log('STYLE change:');
    }
    styleChanges.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' style changed');
        console.log('old style: ' + summary.getOldAttribute(node, 'style'));
        _setUniqTag(node);
        _logNodeId(node, 'unique id:');
        console.log('-------------');
      }
    });

    var classChanges = summary.attributeChanged['class'] || [];
    if(classChanges.length) {
      console.log('');
      console.log('CLASS change:');
    }
    classChanges.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' class changed');
        console.log('old class: ' + summary.getOldAttribute(node, 'class'));
        console.log('new class: ' + node.className);
        _setUniqTag(node);
        _logNodeId(node, 'unique id:');
        console.log('-------------');
      }
    });

    var idChanges = summary.attributeChanged.id || [];
    if(idChanges.length) {
      console.log('');
      console.log('ID change:');
    }
    idChanges.forEach(function(node) {
      if (NodeTagger.isTagged(node)) {
        console.log(node.nodeName + ' id changed');
        console.log('old id: ' + summary.getOldAttribute(node, 'id'));
        _setUniqTag(node);
        _logNodeId(node, 'unique id:');
        console.log('-------------');
      }
    });

    console.log('');
    console.log('end of mutation summary breakdown');
    console.log('--------------------------');
  }


  return _api;
});