/**
 * @fileoverview Text tool action handler to handle requestAction for
 * setting any of the text formatting like bold, italic, etc on the
 * current selection.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'common/elements/customSelector',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/models/transientFormatting',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/models/env'
], function(
  CustomSelector,
  PubSub,
  DomTextSelection,
  TransientFormattingModel,
  TextTool,
  WidowOrphanHelper,
  IdGenerator,
  EnvModel) {

  'use strict';

  function _onLoad() {

    TextTool.registerActionHandler([
      'bold',
      'formatText',
      'fontFace',
      'fontSize',
      'highlightColor',
      'italic',
      'noHighlightColor',
      'strikethrough',
      'subscript',
      'superscript',
      'textColor',
      'underline',
      'fillColor'],
      _handleTextFormatting);
  }

  function _breakNode(node, offset) {
    if(!(node.parentNode instanceof QowtWordPara)) {
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }
      PubSub.publish('qowt:doAction', {
        'action': 'breakRun',
        'context': {
          'contentType': 'text',
          'node': node,
          'offset': offset
        }
      });
    }
  }

  /**
   * used when there is a caret rather than a range selection
   * The formatting request is cached in a transientFormatting
   * array, and will only be executed once the user attempts
   * to insert a printable character.
   * If the user moves the selection before inserting a character
   * the transient formatting cache will be reset
   */
  function _handleTransientFormatting(actionData) {
    // In QW, if the caret is at an empty para, format the para and create a run
    // in it to handle the button bar status.
    var range = DomTextSelection.getRange();
    var node = range.startContainer;
    if (node instanceof QowtWordPara || node instanceof QowtWordRun) {
      _handleWordTransientFormat(node, actionData.context.formatting);
    }

    var existingContext =
        TransientFormattingModel.getTransientContext(actionData.action);
    if (existingContext !== undefined) {
      // support legacy concept of "toggling" the existing transient
      // formatting.
      // TODO(jliebrand): revisit if we should still toggle this here when
      // we have new polymer toolbar and menu items. Ideally they take care
      // of state themselves and thus we dont need to have this logic here.
      if (actionData.context.hasOwnProperty('set')) {
        actionData.context.set = !existingContext;
      }
      if (actionData.context.hasOwnProperty('value')) {
        actionData.context.value = !existingContext;
      }
    }
    TransientFormattingModel.update(actionData);
  }


  /**
   * handle formatting of a text range selection
   */
  function _handleRangeFormatting(actionData) {
    if (actionData.context.formatting) {

      // if the start/end of the selection is in the middle of a span, ie
      // if the start/end container is a TEXT_NODE, then
      // break the run so that we have only full text runs in the selection
      // which we can then format
      var range = DomTextSelection.getRange();

      if (range.startContainer && range.endContainer) {
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          // break the node, and reget the range (as it'll have changed)
          _breakNode(range.startContainer, range.startOffset);
          range = DomTextSelection.getRange();
        }

        if (range.endContainer.nodeType === Node.TEXT_NODE) {
          _breakNode(range.endContainer, range.endOffset);
        }

        // then for every charrun element that supports
        // the requested formatting action, format it ...
        var formattingActions = Object.keys(actionData.context.formatting);
        var elements = CustomSelector.findAllInSelection(formattingActions);
        var selectedParagraphs = {};
        for (var i = 0, len = elements.length; i < len; i++) {
          var el = elements[i];

          // Make sure it's editable
          var computedStyle = window.getComputedStyle(el);
          if (computedStyle['-webkit-user-modify'] === 'read-write') {
            // For QW create a map of selected paragraphs with ids of selected
            // span in it.
            var para = el.parentNode;
            if (para instanceof QowtWordPara) {
              if (el.id) {
                if (!selectedParagraphs[para.id || para.getEid()]) {
                  selectedParagraphs[para.id] = [];
                }
                selectedParagraphs[para.id || para.getEid()].push(el.id);
              } else {
                // Decorate the temporary QowtRun and continue as no action to
                // be taken on dcp side.
                el.decorate(actionData.context.formatting, false);
                continue;
              }
            }

            PubSub.publish('qowt:doAction', {
              'action': 'format',
              'context': {
                contentType: 'text',
                command: {
                  eid: el.getAttribute('qowt-eid'),
                  formatting: actionData.context.formatting
                }
              }
            });
          }
        }
        // In QW, check if the list of selected paragraphs are completely
        // selected. If yes then format them.
        _handleWordFormatting(selectedParagraphs,
                              actionData.context.formatting);
      }
    }
  }

  /*
    This function is written to return true if given range contains bold,italic,
    underline,strikethrough formatting styles
  */
  function isFormattingAppliedOnEmptyDoc(actionData, range){
    var formattingMatched = false;
    if (EnvModel.app === 'word' &&
      range.endContainer &&
      range.endContainer.nodeName === "P" &&
      range.endOffset === 0 &&
      range.startContainer &&
      range.startContainer.nodeName === 'QOWT-PAGE' &&
      range.startOffset === 1 &&
      range.startContainer.querySelector('p') === range.endContainer
    ) {
      formattingMatched = ['bold', 'italic', 'underline','strikethrough'].
        some(function(style){
          return actionData.action.includes(style);
        });
    }
    return formattingMatched;
  }

  function _handleTextFormatting(actionData) {
    var range = DomTextSelection.getRange();
    if (range.isCollapsed) {
      _handleTransientFormatting(actionData);
    } else if (isFormattingAppliedOnEmptyDoc(actionData, range)) {
      var endNode = range.endContainer;
      _handleWordTransientFormat(endNode,actionData.context.formatting);
      TransientFormattingModel.update(actionData);
    } else {
      WidowOrphanHelper.unbalanceSelection();
      _handleRangeFormatting(actionData);
    }
  }


  /**
   * Handle the formatting to the selected paragraphs. If paragraphs are
   * completely selected then set an attribute marking to format it.
   * @param selectedParagraphs {Object} A map of selected paragraphs with the
   *                                    the ids of the selected spans in each.
   * @param formatting {Object} The formatting data.
   */
  function _handleWordFormatting(selectedParagraphs, formatting) {
    _recastFormattingData(formatting);
    var completeSelectedPara = [];
    for (var id in selectedParagraphs) {
      var para = document.getElementById(id);
      // Check if para is completely selected by comparing the selected text.
      if (para && isParaCompletelySelected(para, selectedParagraphs[id])) {
        completeSelectedPara.push(para.getEid());
        _extendFormattingToParaModel(para, formatting);
        // Set 'qowt-format' which indicates the para is formatted with run
        // properties. Pass the formatting data to be applied.
        para.setAttribute('qowt-format', JSON.stringify(formatting));
      }
    }
  }

  /**
   * Verifies if the para is completely selected. This is if the first and last
   * span of the paragraph fall in the list of selected spans.
   * @param selectedParagraph The paragraph selected for formatting.
   * @param selectedChildIdsList The ids of the selected spans.
   * @returns {boolean} If the para is completely selected, returns true.
   */
  function isParaCompletelySelected(selectedParagraph, selectedChildIdsList) {
    var isSelected = false;
    var firstSpanId =
                    findFirstSpanInElement(selectedParagraph.firstElementChild);
    var lastSpanId = findLastSpanInElement(selectedParagraph.lastElementChild);
    if (firstSpanId && selectedChildIdsList.indexOf(firstSpanId) !== -1 &&
      lastSpanId && selectedChildIdsList.indexOf(lastSpanId) !== -1) {
      isSelected = true;
    }
    return isSelected;
  }

  /**
   * Returns the first span in the paragraph.
   * @param elem Paragraph element.
   * @returns {HTMLElement} The QowtRun element in the paragraph
   */
  function findFirstSpanInElement(elem) {
    var id = null;
    if (elem) {
      id = elem instanceof QowtWordRun ?
           elem.id : (
           elem = elem.isContentEditable ?
                  elem.firstElementChild :
                  elem.nextElementSibling,
           findFirstSpanInElement(elem));
    }
    return id;
  }

  /**
   * Returns the last span in the paragraph.
   * @param elem Paragraph element.
   * @returns {HTMLElement} The QowtRun element in the paragraph
   */
  function findLastSpanInElement(elem) {
    var id = null;
    if (elem) {
      id = elem instanceof QowtWordRun ?
           elem.id : (
           elem = elem.isContentEditable ?
                  elem.firstElementChild :
                  elem.previousElementSibling,
           findLastSpanInElement(elem));
    }
    return id;
  }

  /**
   * This is needed to have format in specific data format. eg. font size needs
   * to be passed as integer and not string.
   * @param formatting {Object} formatting data in the context.
   * @returns {Object} formatted data in the expected data format.
   * @private
   */
  function _recastFormattingData(formatting) {
    if (formatting.siz) {
      formatting.siz = parseInt(formatting.siz, 10);
    }
  }

  /**
   * Handles transient formatting for QW to format empty paragraph when the
   * caret is placed at it.
   * @param node {HTMLElement} Element that is being formatted which can either
   *                   be an empty paragraph or an empty run in blank paragraph.
   * @param formatting {Object} Formatting data
   */
  function _handleWordTransientFormat(node, formatting) {
    _recastFormattingData(formatting);
    if (node instanceof QowtWordPara) {
      _handleWordParaTransientFormatting(node, formatting);
    } else if (node instanceof QowtWordRun && node.isEmpty()) {
      var children = node.parentNode.querySelectorAll(':scope > :not(br), ' +
              ':scope > span[is=qowt-line-break]');
      if (children.length === 1) {
        _handleWordRunTransientFormatting(node, formatting);
      }
    }
  }

  /**
   * Handles the empty word paragraph's transient formatting.
   * An empty run is added to the empty para. Or if the para already contains
   * only one empty run, use it.
   * @param paraNode {HTMLElement} Blank paragraph
   * @param formatting {Object} Formatting data
   * @private
   */
  function _handleWordParaTransientFormatting(paraNode, formatting) {
    if (paraNode.isRunRequired()) {
      PubSub.publish('qowt:suppressTextTool', {});
      // Add a run with br in it.
      var qowtRun = new QowtWordRun();
      var br = document.createElement('br');
      var newEid = IdGenerator.getUniqueId('T');
      qowtRun.setAttribute('qowt-teid', newEid);
      qowtRun.appendChild(br);
      paraNode.appendChild(qowtRun);
      PubSub.publish('qowt:unsuppressTextTool', {});
      _handleWordRunTransientFormatting(qowtRun, formatting);
    } else {
      var children = paraNode.querySelectorAll(':scope > :not(br), ' +
          ':scope > span[is=qowt-line-break]');
      if (children.length === 1 && children[0] instanceof QowtWordRun &&
          children[0].isEmpty()) {
        _handleWordRunTransientFormatting(paraNode.children[0], formatting);
      }
    }
  }

  /**
   * Formats the word run and formats the parent paragraph.
   * @param runNode {HTMLElement} Word run in blank paragraph.
   * @param formatting {Object} Formatting data
   * @private
   */
  function _handleWordRunTransientFormatting(runNode, formatting) {
    runNode.decorate(formatting, false);
    var para = runNode.parentNode;
    _extendFormattingToParaModel(para, formatting);
    para.setAttribute('qowt-format', JSON.stringify(formatting));
  }

  /**
   * Updates the formatting in the paragraph's model.
   * @param paraNode {HTMLElement} Word paragraph
   * @param formatting {Object} Formatting data
   * @private
   */
  function _extendFormattingToParaModel(para, formatting) {
    if (!para.model.characterFormatting) {
      para.model.characterFormatting = {};
    }
    while (para) {
      _.extend(para.model.characterFormatting, formatting);
      para = para.flowInto;
    }
  }

  _onLoad();
  return {};

});
