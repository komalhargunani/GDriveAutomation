// Copyright 2013 Google Inc. All Rights Reserved.
/**
 * @fileoverview Receives a DCP command and creates and publishes the
 * corresponding action.
 *
 * TODO(chehayeb) we could have different command handlers depending
 * on the content type.
 *
 * @author Anibal Chehayeb (chehayeb@google.com)
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub'
  ], function(
    Features,
    PubSub
  ) {

  'use strict';

  /**
   * Mapping between DCP command names and content types.
   */
  var _CONTENT_TYPES = {
    'txStart':       'common',
    'txEnd':         'common',
    'gaLogEvent':    'common',
    'addDrawing':    'drawing',
    'addImage':      'drawing',
    'deleteBBD':     'drawing',
    'newTextBox':    'drawing',
    'deleteText':    'text',
    'insertText':    'text',
    'newCharRun':    'text',
    'newParagraph':  'text',
    'deleteNode':    ['text', 'drawing'],
    'moveNode':      ['text', 'drawing'],
    'formatElement': ['text', 'drawing'],
    'addFooter':     'text',
    'addFooterItem': 'text',
    'addHeader':     'text',
    'addHeaderItem': 'text',
    'addField':      'text',
    'addHyperlink':  'text',
    'addSection':    'text',
    'addTable':      'text',
    'addTableRow':   'text',
    'addTableCell':  'text',
    'addBreakChar':  'text',
    'addCarriageReturn': 'text',
    'modTrfm':       'shape',
    'modShapeFill':  'shape',
    'deleteShape':   'shape',
    'formatObject':  'shape',
    'insertShape':   'slide',
    'showSld':       'slideManagement',
    'insertSld':     'slideManagement',
    'deleteSld':     'slideManagement',
    'moveSld':       'slideManagement'
  };

  /**
   * Mapping between DCP commands and actions.
   */
  var _ACTIONS = {
    'txStart':       'commandSequenceStart',
    'txEnd':         'commandSequenceEnd',
    'deleteText':    'deleteQowtText',
    'insertText':    'insertQowtText',
    'newCharRun':    'addQowtCharRun',
    'newParagraph':  'addQowtParagraph',
    'newTextBox':    'addQowtTextBox',
    'addDrawing':    'addQowtDrawing',
    'deleteNode':    'deleteQowtElement',
    'deleteBBD':     'deleteQowtBBD',
    'moveNode':      'moveQowtElement',
    'formatElement': 'formatQowtElement',
    'addFooter':     'addQowtFooter',
    'addFooterItem': 'addQowtFooterItem',
    'addHeader':     'addQowtHeader',
    'addHeaderItem': 'addQowtHeaderItem',
    'addField':      'addQowtField',
    'addHyperlink':  'addQowtHyperlink',
    'addSection':    'addQowtSection',
    'addTable':      'addQowtTable',
    'addTableRow':   'addQowtTableRow',
    'addTableCell':  'addQowtTableCell',
    'addImage':      'addQowtImage',
    'addBreakChar':  'addQowtBreakChar',
    'addCarriageReturn': 'addQowtCarriageReturn',
    'modShapeFill':  'modifyShapeFillColor',
    'modTrfm':       'modifyTransform',
    'insertShape':   'addShape',
    'deleteShape':   'deleteShape',
    'showSld':       'showSld',
    'insertSld':     'insertSlide',
    'deleteSld':     'deleteSlide',
    'moveSld':       'moveSlide',
    'gaLogEvent':    'logGAEvent',
    'formatObject':  'formatObject'
  };

  var _api = {
    /**
     * Creates and publishes an action given a DCP command.
     *
     * The properties 'type' a 'name' are always required. The command might
     * have additional properties depending on its nature.
     *
     * @param {Object} command DCP command.
     * @param {string} command.type Identifies this DCP message as a command.
     * @param {string} command.name Command name (e.g. 'insertText').
     */
    handle: function(command) {
      if (!command.name || !command.type || (command.type !== 'dcpCommand')) {
        throw new Error('invalid command message');
      }
      if (command.body) {
        for (var i = 0; i < command.body.length; i++) {
          _triggerAction(command.body[i]);
        }
      }
    }
  };

  /**
   * Method for triggering an action based on the DCP information.
   *
   * @param simpleCommand {Object} item Simple DCP command.
   */
  var _triggerAction = function(item) {
    var key = item.name;

    // TODO(jliebrand): because of how mutation observers and data
    // observers work, we have to ensure ALL commands within a command
    // sequence execute their model observers synchronously, to ensure
    // they don't happen in a next micro task (because they'd then be
    // picked up by the text tool, which we dont want). This is crap,
    // it means we have to have implicit knowledge here about other
    // parts of the system...
    // Ultimately we need a better way to suppress and reconnect the
    // text tool after all micro tasks are done. Then we can remove
    // this hack.
    item.synchronous = true;

    if (_CONTENT_TYPES.hasOwnProperty(key) && _ACTIONS.hasOwnProperty(key)) {

      if (Features.isEnabled('logMutations')) {
        console.log('Core action: ' + _ACTIONS[key] + ' context: ', item);
      }
      item.optFunction = _getElementFromHF;

      PubSub.publish('qowt:doAction', {
        'action': _ACTIONS[key],
        'context': {
          'contentType': _getContentType(item),
          'command': item
        }
      });
    } else {
      console.warn('ignoring unknown core command: name: ' + key);
    }
  };

  /**
   * The header and footer elements are placed in shadow dom. While
   * adding the elements in header/footer, the getElementId api fails to
   * find the parent or sibling element. Hence this optional function is
   * passed in DCP command. This method will find the node if getElementId
   * api fails to find the node.
   *
   * @param {string} nodeId  node ID
   * @return {HTML element} HTML Element.
   */
  var _getElementFromHF = function(nodeId) {
    var node;
    var allSections = document.querySelectorAll('qowt-section');
    for (var i = 0; i < allSections.length && !node; i++) {
      var section = allSections[i];
      var content = section.$.headerTemplates.content;
      node = content.getElementById(nodeId);
      if (!node) {
        content = section.$.footerTemplates.content;
        node = content.getElementById(nodeId);
      }
    }
    return node;
  };


  var _getContentType = function(item) {
    function isItemADrawing() {
      var id = item.eid || item.nodeId;
      var node = document.getElementById(id);
      return node && (node instanceof QowtDrawing ||
          node.parentNode instanceof QowtDrawing);
    }
    var action = item.name;
    var contentType = _CONTENT_TYPES[action];
    if (contentType instanceof Array && contentType.length === 2) {
      contentType = isItemADrawing() ? contentType[1] : contentType[0];
    }
    return contentType;
  };

  return _api;
});
