// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview qowt tool that monitors textual editing using DOM Mutation
 * Observers.  In fact, it's a bit lazy and uses the Mutation Summary Library
 * to observe changes, and construct the relevant QOWT commands to update
 * our Core (via DCP)
 *
 * The tool will observe any changes to the HTML when
 * it's 'active' AND NOT 'suppressed'.
 * See _suppressorStateChange() for more details on suppression.
 *
 * This tool uses a raft of sub modules to achieve its goals. Some high
 * level conceptual constructs to help you understand these sub modules are:
 *
 *   - Blocking/changing edits before they happen
 *
 *                  PreEdit modules get invoked on textinput events
 *                  and can thus run BEFORE any edit has occurred. This allows
 *                  them to possibly block an edit, or change the behaviour
 *
 *   - Mutations
 *                  We use Mutation Observers to spot any changes to the HTML.
 *                  Any mutations are grouped in to 'summary' objects, which
 *                  contain a set of mutations.
 *
 *   - MutationFilters
 *
 *                  There can be mutations inside a summary object which
 *                  we are not interested in. You can use MutationFilters
 *                  to only get notified of those mutations you care about
 *
 *   - Cleaners
 *                  For some mutations (identified via filters) we first
 *                  need to 'clean' the generated HTML before we process it.
 *                  For example we have cleaners which ensure newly
 *                  added nodes get proper QOWT-EID's so that we can
 *                  identify them.
 *
 *   - Sequencing and Translating:
 *
 *                  Mutation Observers group mutations together. Since DCP
 *                  is a sequential protocol, we need to unravel the order of
 *                  the edits. Our Sequencer deals with the order, whilst
 *                  our Translators then take each mutation and translate them
 *                  in to actual QOWT Commands.
 *
 *
 * This tool also listens for requestActions coming from the likes of
 * toolbar buttons, and if the action is valid given our current selection
 * it will convert it in to a proper doAction...
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/third_party/hooker/hooker',
  'qowtRoot/features/utils',
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/nodeTagger',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/tools/text/mutations/sequencer',
  'qowtRoot/tools/text/mutations/logMutation',
  'qowtRoot/tools/text/preEdit/linebreakCorrections',
  'qowtRoot/tools/text/preEdit/deleteCorrections',
  'qowtRoot/tools/text/preEdit/textInputCorrections',
  'qowtRoot/tools/text/preEdit/clipboardCorrections',
  'qowtRoot/tools/text/preEdit/selectionCorrections',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/models/transientFormatting',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/behaviours/action/commonActionHandler',
  'qowtRoot/models/env',
  'qowtRoot/utils/domUtils',

  'qowtRoot/third_party/mutationSummary/mutation_summary'], function(
  Hooker,
  Features,
  DomListener,
  NavigationUtils,
  DomTextSelection,
  NodeTagger,
  ArrayUtils,
  SelectionManager,
  Tags,
  MutationSequencer,
  LogMutation,
  LinebreakCorrections,
  DeleteCorrections,
  TextInputCorrections,
  ClipboardCorrections,
  SelectionCorrections,
  WidowOrphanHelper,
  TransientFormattingModel,
  PubSub,
  CommonActionHandler,
  EnvModel,
  DomUtils

  /* mutation_summary provides window.MutationSummary object */) {

  'use strict';

  var _api = {
    // Name of the tool; note: it will have to match the contentType
    // of whatever is requesting focus; in our case "text"
    name: 'text',

    supportsReactivation: true,

    modifyEndRange: false,

    /**
     * Initializes text tool.
     */
    init: function() {
      if (_isInitialized) {
        throw new Error('textTool.init() called multiple times.');
      }

      _addBehaviours();
      MutationSequencer.init();
      // make sure contenteditable styles nodes with css
      // rather than using for example <b> tags
      document.execCommand('styleWithCSS');

      // note we subscribe to qowt state change events in our
      // onLoad. This is so that we can know the state of
      // any suppressor even before we *become* the active tool and
      // thus know what to do at that point... ie if we are
      // activated whilst the document is paginating (flowing),
      // we should not (yet) start listening for mutation events...
      _stateChangeToken =
          PubSub.subscribe('qowt:stateChange', _suppressorStateChange);

      _suppressTextToolToken =
          PubSub.subscribe('qowt:suppressTextTool', _increaseSuppressDepth);
      _unsuppressTextToolToken =
          PubSub.subscribe('qowt:unsuppressTextTool', _decreaseSuppressDepth);
      _focusUndoRedoToken =
          PubSub.subscribe('qowt:focus-undo-redo', _handleFocusUndoRedo);

      _isInitialized = true;
    },

    /**
     * Resets the defaults and destroy all references.
     */
    destroy: function() {
      MutationSequencer.disable();
      PubSub.unsubscribe(_stateChangeToken);
      PubSub.unsubscribe(_suppressTextToolToken);
      PubSub.unsubscribe(_unsuppressTextToolToken);
      PubSub.unsubscribe(_focusUndoRedoToken);

      _stateChangeToken = undefined;
      _suppressTextToolToken = undefined;
      _unsuppressTextToolToken = undefined;
      _focusUndoRedoToken = undefined;
      _isInitialized = false;
    },

    /**
     * Activate the text tool.  It will start observing unless it
     * happens to be suppresed (in which case it will start observing
     * once its unspressed).
     *
     * @param {object} context contextual object for our tool. Should contain:
     * @param {HTML Element} context.scope The 'world node' on which we should
     *                                     start observing for changes
     */
    activate: function(context) {
      _context = context;
      if (!_active) {
        _active = true;
        if (!_suppressed) {
          _startObserving();
        }

        // We've been activated with a specific selection context, so we need
        // to establish a matching window selection if its not already set.
        var windowSel = DomTextSelection.getRange();
        windowSel.contentType = _api.name;

        if (context && context.startContainer &&
            !SelectionManager.selectionContextsEqual(windowSel,
              context.startContainer) && !NavigationUtils.shareUsingKB()) {
          DomTextSelection.setRange(context);
        }
        if (!NavigationUtils.undoRedoUsingTBButton(document.activeElement) &&
            !NavigationUtils.shareUsingKB()) {
          _context.scope.focus();
        }
        PubSub.publish('qowt:textToolState', {
          state: 'active'
        });
      }
    },

    /**
     * de-activate the tool
     */
    deactivate: function() {
      if (_active) {
        _active = false;
        if (!_suppressed) {
          _stopObserving();
        }

        PubSub.publish('qowt:textToolState', {
          state: 'inactive'
        });
      }
    },

    /**
     * Query if the tool is active.
     *
     * @returns {Boolean} True if active, else false.
     */
    isActive: function() {
      return _active;
    },

    isUnsuppressed: function() {
      return _active && !_suppressed;
    },

    registerActionHandler: function(actions, callback) {
      actions.forEach(function(action) {
        _actionHandlers[action] = _actionHandlers[action] || [];
        _actionHandlers[action].push(callback);
      });
    },

    suppressDepth: function() {
      return _suppressDepth;
    },

    // debugging utils used by unit tests
    debugSuppress: function() {
      _increaseSuppressDepth();
    },
    debugUnsuppress: function() {
      _decreaseSuppressDepth();
    },

    /**
     * Retrieves the latest snaphost before an edit occurred.
     *
     * @return {object} Snapshot object.
     */
    getSnapshotBeforeEdit: function() {
      return _snapshotBeforeEdit;
    }
  };


  // vvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  var _kId = 'textTool',
      _isInitialized,
      _active = false,
      _suppressed = false,
      _context,
      _observerSummary,
      _actionHandlers = {},
      _actionToken,
      _selToken,
      _stateChangeToken,
      _suppressTextToolToken,
      _unsuppressTextToolToken,
      _focusUndoRedoToken,
      _focusUndoRedoFlag,

      _suppressors = {},
      _suppressDepth = 0,
      _preEditPerformed = false,
      _snapshotBeforeEdit;

  function _suppress() {
    if (!_suppressed) {
      _suppressed = true;
      if (_active) {
        PubSub.publish('qowt:textToolState', {
          state: 'suppressed'
        });
        _stopObserving();
      }
    }
  }

  function _unsuppress() {
    if (_suppressed) {
      _suppressed = false;
      if (_active) {
        _startObserving();
        PubSub.publish('qowt:textToolState', {
          state: 'unsuppressed'
        });
      }
    }
  }

  function _startObserving() {
    // Set up the mutation observer lib to listen to events.
    // As per requirements, the scope (root node) may change when the text tool
    // is reactivated. In addition, creating a new MutationSummary acts as a
    // wrapper around the reconnect function. It first sets up the parameters
    // of the new MutationSummary object and then calls reconnect. For these
    // two reasons, creation of a new MutationSummary object is the preferred
    // method to (re)setup the observer lib.
    _observerSummary = new MutationSummary({
      rootNode: _context.scope,
      callback: _handleMutationSummaries,
      oldPreviousSibling: true,
      queries: _mutationSummaryQueries
    });

    var _root = document.getElementById('qowt-doc-container');

    _actionToken = PubSub.subscribe('qowt:requestAction', _handleAction);
    _selToken = PubSub.subscribe('qowt:selectionChanged', _handleSelection);
    DomListener.add(_kId, document, 'keydown', _handleKeyDown);
    DomListener.add(_kId, document, 'textInput', _handleTextInput);
    DomListener.add(_kId, document, 'paste', _handleClipboard);
    DomListener.add(_kId, document, 'cut', _handleClipboard);
    DomListener.add(_kId, document, 'drop', _handleDrop);
    DomListener.add(_kId, document, 'copy', _handleCopy);

    DomListener.add(_kId, _root, 'click', _handleDblTrplClick);

    _hookExecCommand();
  }

  var _mutationSummaryQueries = [{
    all: true
  }];

  /**
   * disconnect from the mutation summary library to stop listening
   * for any mutations
   */
  function _stopObserving() {
    if (_observerSummary) {
      var pendingMutations = _observerSummary.disconnect();
      if (pendingMutations) {
        _handleMutationSummaries(pendingMutations);
      }
      _observerSummary = undefined;
    }

    PubSub.unsubscribe(_actionToken);
    PubSub.unsubscribe(_selToken);
    DomListener.removeGroup(_kId);

    _unhookExecCommand();
  }

  function _hookExecCommand() {
    // This is really only needed for our unit and end-2-end tests
    // where we use document.execCommand('delete') etc. Make sure we
    // do our pre-edit checks for those cases
    Hooker.hook(document, 'execCommand', {
      pre: function(commandName, showDefaultUI, valueArgument) {
        // one exec command can itself cause additional commands to be
        // executed. We really only need to handle our pre-edit check
        // once though, so just set a flag
        if (!_preEditPerformed) {
          _preEditPerformed = true;

          var kBackspaceKeyCode = 8;
          var kDeleteKeyCode = 46;
          var stopExec = false;
          var mockEvent = {
            data: '',
            preventDefault: function() {
              stopExec = true;
            }
          };

          switch(commandName) {
            case 'delete':
            case 'forwardDelete':
              if (EnvModel.app === 'word') {
                mockEvent.keyCode = (commandName === 'delete') ?
                kBackspaceKeyCode : kDeleteKeyCode;
                DeleteCorrections.handle(mockEvent, _context.scope);
                var sel = window.getSelection();
                if (!sel.isCollapsed) {
                  SelectionCorrections.handle(sel);
                } else if (sel && sel.rangeCount > 0 && sel.isCollapsed) {
                  var range = sel.getRangeAt(0);
                  var currentPara = range.startContainer;
                  if (range.startOffset === 0 &&
                    ['SPAN', '#text'].includes(currentPara.nodeName)) {
                      currentPara = getCurrentPara(range);
                  }
                  if (currentPara.nodeName === 'P') {
                    // Prevent the execution, if the cursor is at the starting
                    // position of the document and trying to consider page
                    // border element for the operation while moving cursor
                    // backward direction.
                    var prevNode = Polymer.dom(currentPara).previousSibling;
                    var position = _getCaretPosition(range, currentPara);
                    if (!prevNode && position === 'START') {
                      var parentNode = Polymer.dom(currentPara).parentNode;
                      if (parentNode.nodeName === 'QOWT-SECTION' &&
                        Polymer.dom(parentNode).firstChild === currentPara) {
                        parentNode = Polymer.dom(parentNode).parentNode;
                        prevNode = parentNode.previousElementSibling;
                        if (!prevNode) {
                          stopExec = true;
                        }
                      }
                    }
                  }
                }
              }
              break;
            case 'insertText':
              if (EnvModel.app === 'word') {
                sel = window.getSelection();
                if (!sel.isCollapsed ||
                  ((valueArgument.match(/\n/g)||[]).length > 0
                  && !showDefaultUI)) {
                  // Selection and paste (any length) as well as regular
                  // multi line text paste without selection will be
                  // handled here.

                  if (!sel.isCollapsed) {
                    WidowOrphanHelper.unbalanceSelection();
                    SelectionCorrections.handle(sel);
                  }

                  stopExec = true;
                  _handleClipboardAction(valueArgument);
                } else {
                  if ((valueArgument.match(/\n/g)||[]).length === 0) {
                    _handleTextInput(mockEvent);
                  }
                }
              } else {
                _handleTextInput(mockEvent);
              }
              break;
            default:
              break;
          }

          if (stopExec) {
            return Hooker.preempt(true);
          }
        }
      },
      post: function() {
        // reset our pre edit performed flag
        _preEditPerformed = false;
      }
    });
  }

  function _unhookExecCommand() {
    Hooker.unhook(document, 'execCommand');
  }

  function _handleSelection(event, eventData) {
    event = event || {};
    if (eventData && eventData.newSelection &&
        eventData.newSelection.contentType === 'text') {
      // The text selection has changed, remove any existing
      // transient formatting.
      TransientFormattingModel.clearTransientValues();
    }
  }

  function _handleFocusUndoRedo(event, eventData) {
    event = event || {};
    _focusUndoRedoFlag = eventData.focusUndoRedoFlag;
  }

  function _handleCopy(evt) {
    if (EnvModel.app === 'word') {
      var range = window.getSelection().getRangeAt(0);
      if (range.collapsed === false) {
        var rangeContents = range.cloneContents();
        var tempDiv = document.createElement('div');
        tempDiv.appendChild(rangeContents);
        tempDiv.innerHTML = tempDiv.innerHTML.replaceAll(/\n\s+/g,'');
        var paras = tempDiv.querySelectorAll('p');
        for(var i = 0; i < paras.length - 1; i++) {
          if (paras[i].lastChild &&
              paras[i].lastChild.nodeType !== Node.TEXT_NODE) {
            paras[i].insertBefore(document.createTextNode('\n'), null);
          }
        }
        evt.clipboardData.setData('text/html', tempDiv.innerHTML);
        evt.clipboardData.setData('text/plain', tempDiv.textContent);
        evt.preventDefault();
      }
    }
  }

  /**
   * JELTE TODO: The big problem here is that if we drop text on
   * the widow or orphan, we need to unbalance it first (much like
   * how we unbalance before a text input in widow/orphans). BUT
   * if you drop text on the widow, then after unbalancing, that
   * element (the widow) will have moved, and thus it will fail...
   * Dropping on the orphan does seem to work.

   * Ultimately unbalancing the widow/orphan before any edit
   * happens is a kludge and a performance hit. We really should
   * fix that such that those elements can simply be edited
   * rather than having pre-edit blockers like this.
   *
   * For now keeping this as is, since it at least stops a crash
   * from happening, but we need to really think about these
   * pre-edits wrt widow/orphan unbalancing!
   */
  function _handleDrop(evt) {
    _handleBeforeEdit();
    if (evt && evt.srcElement) {
      WidowOrphanHelper.unbalanceNode(evt.srcElement);
      var plainText = evt.dataTransfer.getData('text/plain');
      if (plainText) {
        document.execCommand('insertText', false, plainText);
      }
      evt.preventDefault();
    }
  }

  /**
   * Handle all 'requestAction' signals.
   *
   * @param {string} eventType The name of the action signal received.
   * @param {object} eventData The data associated with the signal.
   */
  function _handleAction(event, eventData) {
    _handleBeforeEdit();
    if (eventData && eventData.action) {
      var actionHandlers = _actionHandlers[eventData.action];
      if (actionHandlers) {
        actionHandlers.forEach(function(handler) {
          handler.call(this, eventData);
        });
      } else {
        // We haven't consumed the action directly,
        // so check if it's a common action.
        _api.handleCommonAction(event, eventData);
      }
    }
  }

  /**
   * Handle selection on double click and triple click
   *
   * Like a Shadow DOM, The shady dom doesn't contain any selection boundaries
   * to paragraph element. Due to this limitation, during double click and
   * triple click on an empty paragraph, the cursor gets disappears, and that
   * empty paragraph gets selected.
   */
  function _handleDblTrplClick(evt) {
    evt = evt || {};
    var sel = window.getSelection();
    if(sel.rangeCount === 0) {
      return;
    }
    var range = sel.getRangeAt(0);
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;
    var parentNode = startContainer.parentNode;
    var commonAncestorContainer = range.commonAncestorContainer;
    // The cursor gets disappears when selection has start node PAGE and end
    // node P having end off set zero.
    if (EnvModel.app === 'word' &&
        !sel.isCollapsed &&
        endOffset === 0 &&
        endContainer.nodeName === 'P' &&
        ['#text', 'QOWT-PAGE'].includes(startContainer.nodeName) &&
        parentNode.nodeName !== 'SPAN') {

      var startContainerPos =
          Array.from(parentNode.childNodes).indexOf(startContainer);
      // check whether end node is a part of same page not the part of
      // flowing page, and end node must be first element of the page
      // then and only then set modifyRange to true.
      var modifyRange = true;
      if (startContainer.nodeName === 'QOWT-PAGE' &&
        !(startContainer.contains(endContainer) &&
          startContainer.querySelector('p:first-of-type') === endContainer)
      ) {
        modifyRange = false;
      }

      if (startContainerPos > 0 && modifyRange) {
        var node = parentNode.nextElementSibling;
        if(endContainer.previousElementSibling
          && endContainer.previousElementSibling.nodeName === "TABLE"
          && endContainer.isEmpty()) {
          node = endContainer;
        }
        if (commonAncestorContainer.nodeName === 'TR' &&
            startContainer.nodeName === '#text' &&
            endContainer.nodeName === 'P') {
          node = endContainer;
        }
        if (startContainer.nodeName === 'QOWT-PAGE') {
          node = range.endContainer;
        }
        if(node) {
          range.setStart(node,0);
          range.setEnd(node,0);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  function _handleKeyDown(evt) {
    // TODO: Need to find a better solution for handling events on the target
    // element. For now this is done because currently viewLayoutControl is
    // capturing keydown events, which is preventing events to propagate to
    // its children. So even if the target is mainToolbar the keydown event
    // is also listened on textTool. Or, we can add a check here for correct
    // contentType of current selection before proceeding further. Therefore
    // ignoring keydown events here if the target is mainToolbar.
    if (evt && (NavigationUtils.isTargetWithinMainToolbar(evt.target))) {
      return;
    }
    // catch any exceptions thrown so that we can prevent the
    // default behaviour of the key event. This is to avoid
    // for example an error on backspace causing the browser
    // to grab the backspace character and navigating back
    // in it's history.
    try {
      var sel = window.getSelection();
      if(sel.rangeCount === 0) {
        return;
      }

      if(EnvModel.app === 'word' &&
      (evt.metaKey || evt.ctrlKey) && evt.key === 'a') {
        _api.modifyEndRange = true;
      }

      if (EnvModel.app === 'word' &&
        ['Enter', 'Backspace', 'Delete'].includes(evt.key) ||
        (sel && sel.rangeCount > 0 && 
         validSelectNType(evt, sel.getRangeAt(0)))) {
        _correctSelection();
      }
      _handleBeforeEdit();
      // If line break corrections returns true the event was
      // stopped and no more corrections should be made.
      if (!LinebreakCorrections.handle(evt)) {
        if(EnvModel.app === 'word') {
          var handled = DeleteCorrections.handle(evt, _context.scope);
          if (handled) {
            return;
          }
          if (document.activeElement.nodeName === 'A' &&
              ['Enter'].includes(evt.key)) {
            return;
          }
        } else if(EnvModel.app === 'point') {
          if((evt.key === 'Backspace') || evt.key === 'Delete') {
            DeleteCorrections.handlePoint(evt, _context.scope);
          }
          if(evt && evt.key === 'Enter' && _focusUndoRedoFlag) {
            evt.preventDefault();
            return;
          }
        }
      }

      if (EnvModel.app === 'word' && evt && evt.key === "Enter") {
        if (evt.altKey){
          return;
        }
        evt.preventDefault();
        TextInputCorrections.handle(evt);
        _handleEnterKeyAction();
      } else if (EnvModel.app === 'word' && evt && evt.code === "Space") {
        var transientFormatting =
            TransientFormattingModel.getPendingTransientActions();
        if (transientFormatting.length > 0) {
          var run = TextInputCorrections.handle(evt);
          if (run) {
            if (run.firstElementChild instanceof HTMLBRElement) {
              run.removeChild(run.firstElementChild);
            }
            var textNode = document.createTextNode(' ');
            run.appendChild(textNode);
            var selection = window.getSelection();
            var r = document.createRange();
            r.setStart(textNode, textNode.textContent.length);
            r.setEnd(textNode, textNode.textContent.length);
            r.collapse(true);
            selection.removeAllRanges();
            selection.addRange(r);
            evt.preventDefault();
          }
        }
      }


      if (sel && sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        if (EnvModel.app === 'word' && _isParagraphMerge(evt)) {
          evt.preventDefault();
          var currentPara = getCurrentPara(range);
          var firstSection;
          var secondSection;
          var isSecondPara;
          var prevPage;
          if (currentPara) {
            if (evt.key === 'Backspace') {
              var prevPara = Polymer.dom(currentPara).previousSibling;
              if (prevPara === null) {
                firstSection = currentPara.parentElement;
                if (firstSection.nodeName === 'QOWT-SECTION' &&
                  Polymer.dom(firstSection).firstChild === currentPara) {
                  prevPage = Polymer.dom(firstSection).parentNode;
                  if (prevPage.previousElementSibling) {
                    secondSection = prevPage.previousElementSibling
                      .querySelector('qowt-section:last-child');
                    var lastChild = Polymer.dom(secondSection).lastChild;
                    if (lastChild instanceof QowtTable) {
                      prevPara = lastChild;
                    }
                  }
                }
              }
              if (!(prevPara instanceof QowtTable)) {
                firstSection = currentPara.parentElement;
                secondSection = Polymer.dom(firstSection).previousSibling;
                if (!secondSection) {
                   prevPage = Polymer.dom(firstSection)
                    .parentNode.previousSibling;
                  if (prevPage) {
                    secondSection = Polymer.dom(prevPage).lastChild;
                  }
                }
                isSecondPara = true;
                _handleMerge(prevPara, currentPara, firstSection,
                  secondSection, isSecondPara);
              }
            } else {
              var nextPara = Polymer.dom(currentPara).nextSibling;
              if (!nextPara) {
                firstSection = currentPara.parentElement;
                secondSection = Polymer.dom(firstSection).nextSibling;
                if (!secondSection) {
                  var nextPage = Polymer.dom(firstSection)
                    .parentNode.nextSibling;
                  if (nextPage) {
                    secondSection = Polymer.dom(nextPage).firstChild;
                  }
                }
                if (secondSection instanceof QowtSection) {
                  nextPara = Polymer.dom(secondSection).firstChild;
                }
              } else {
                firstSection = nextPara.parentElement;
                secondSection = Polymer.dom(firstSection).previousSibling;
                if (!secondSection) {
                  prevPage = Polymer.dom(firstSection)
                    .parentNode.previousSibling;
                  if (prevPage) {
                    secondSection = Polymer.dom(prevPage).lastChild;
                  }
                }
                isSecondPara = true;
              }
              _handleMerge(currentPara, nextPara, firstSection,
                secondSection, isSecondPara);
            }
          }
        } else if (EnvModel.app === 'word' &&
          (evt.key === 'Backspace' || evt.key === 'Delete')) {
          var para = getCurrentPara(range);
          if (!range.collapsed) {
            evt.preventDefault();
            _handleBackspaceDeleteWithSelection();
          } else if (_paraHasOnlyDrawing()) {
            evt.preventDefault();
            var children = para.children;
            removePartOfPara(para, children.length);
          } else if(evt.key === 'Delete' && _lastParaAndTableMerge()) {
            evt.preventDefault();
            _setRangeToDeleteTable();
          } else if((evt.key === 'Delete' || evt.key === 'Backspace') &&
            _paraHasEmptyRunAtTheEnd()) {
            evt.preventDefault();
            while(para.children.length) {
              if(para.children[0]) {
                para.removeChild(para.children[0]);
              }
            }
          }

        } else if (validSelectNType(evt, range)) {
          evt.preventDefault();
          _handleBackspaceDeleteWithSelection(evt);
        } else if (EnvModel.app === 'word') {
          _handleCtrlDeleteCase(evt);
        }
      }
    } catch(e) {
      // stop default behaviour on exceptions
      evt.preventDefault();

      // rethrow original error; let normal ErrorCatcher deal with it
      throw e;
    }
  }

  /**
   * Determines if the event was fired for valid printable character. For us,
   * printable character is alphanumeric/white space/one of
   * [<>{}()[\]\|\\"':;.?,\/\-+=*&^%$#@!~`]
   * @param {*} evt
   * @param {*} range
   */
  function validSelectNType(evt, range) {
    if (EnvModel.app === 'word' && !range.collapsed) {
      if (evt.key.length === 1 &&
        evt.key.match(/[\w\s<>{}()[\]\|\\"':;.?,\/\-+=*&^%$#@!~`]/g) &&
        !evt.metaKey && !evt.ctrlKey && !evt.altKey) {
          return true;
      }
    }
    return false;
  }

  function getCollapsedRange() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      range.collapse(true);
      sel = window.getSelection();
      return sel.getRangeAt(0);
    }
  }

  function typeCharacter(evt, model) {
    var range = getCollapsedRange();
    if (range) {
      var textNode;
      var startOffset;
      var key;
      if (range.startContainer === range.endContainer && range.collapsed) {
        var startContainer = range.startContainer;
        if(startContainer instanceof HTMLBRElement) {
          startContainer = startContainer.parentElement;
        }
        if (startContainer.nodeType === Node.TEXT_NODE) {
          if (startContainer.parentElement instanceof QowtWordRun) {
            textNode = startContainer;
            startOffset = range.startOffset;
            textNode.insertData(startOffset, evt.key);
          } else if (startContainer.parentElement instanceof QowtWordPara) {
            var childNodes = startContainer.parentElement.childNodes;
            var index = Array.from(childNodes).indexOf(startContainer);
            if (index === childNodes.length - 1) {
              if (childNodes[index - 1] instanceof QowtWordRun) {
                textNode = childNodes[index - 1].childNodes[0];
                textNode.appendData(evt.key);
                startOffset = textNode.length + 1;
              }
            } else if (index === 0) {
              if (childNodes[index + 1] instanceof QowtWordRun) {
                textNode = childNodes[index + 1].childNodes[0];
                textNode.before(evt.key);
                startOffset = 1;
              }
            }
          }
        } else if (startContainer instanceof QowtWordRun) {
          if (startContainer.isEmpty()) {
            if(startContainer.children.length === 1 &&
              startContainer.children[0] instanceof HTMLBRElement) {
              var brElement = startContainer.children[0];
              startContainer.removeChild(brElement);
              brElement.setAttribute('removedFromShady', true);
            }
            textNode = document.createTextNode(evt.key);
            startOffset = 1;
            startContainer.appendChild(textNode);
          } else {
            textNode = startContainer.childNodes[0];
            startOffset = 0;
            textNode.insertData(startOffset, evt.key);
          }
        } else if (startContainer instanceof QowtWordPara) {
          if (startContainer.children.length === 0) {
            var run = new QowtWordRun();
            startContainer.appendChild(run);
            textNode = document.createTextNode(evt.key);
            startOffset = 1;
            for (key in model.rpr) {
              if (!['Hyperlink'].includes(model.rpr[key])) {
                run[key] = model.rpr[key];
              }
            }
            run.appendChild(textNode);
            decorateRun(startContainer, run);
          } else if (startContainer.children.length === 1 &&
            startContainer.children[0] instanceof HTMLBRElement) {
            brElement = startContainer.children[0];
            startContainer.removeChild(brElement);
            brElement.setAttribute('removedFromShady', true);
            run = new QowtWordRun();
            startContainer.appendChild(run);
            textNode = document.createTextNode(evt.key);
            startOffset = 1;
            run.appendChild(textNode);
            decorateRun(startContainer, run);
          } else if (startContainer.children.length === 1 &&
            startContainer.children[0] instanceof QowtDrawing) {
              run = new QowtWordRun();
              startContainer.appendChild(run);
              textNode = document.createTextNode(evt.key);
              startOffset = 1;
              run.appendChild(textNode);
              decorateRun(startContainer, run);
          } else if (startContainer.children[0] instanceof QowtWordRun) {
            run = startContainer.children[0];
            if (run.firstElementChild instanceof HTMLBRElement) {
              run.removeChild(run.firstElementChild);
            }
            if (run.isEmpty()) {
              textNode = document.createTextNode(evt.key);
              startOffset = 1;
              for (key in model.rpr) {
                run[key] = model.rpr[key];
              }
              run.appendChild(textNode);
            } else {
              textNode = run.childNodes[0];
              startOffset = 0;
              textNode.insertData(startOffset, evt.key);
            }
          } else if (startContainer.childNodes[range.startOffset]
              instanceof HTMLBRElement) {
            brElement = startContainer.childNodes[range.startOffset];
            startContainer.removeChild(brElement);
            brElement.setAttribute('removedFromShady', true);
            run = new QowtWordRun();
            startContainer.appendChild(run);
            textNode = document.createTextNode(evt.key);
            startOffset = 1;
            run.appendChild(textNode);
            decorateRun(startContainer, run);
          }
        } else if (startContainer instanceof QowtSection) {
          var children = startContainer.children;
          var para = ((children.length === range.startOffset) ||
          children[range.startOffset] instanceof QowtTable) ?
          children[range.startOffset - 1] : children[range.startOffset];
          run = para.children[0];
          if (!(run instanceof QowtWordRun)) {
            run = new QowtWordRun();
            para.appendChild(run);
            textNode = document.createTextNode(evt.key);
            startOffset = 1;
            run.appendChild(textNode);
            decorateRun(para, run);
          } else {
            if (run.firstElementChild instanceof HTMLBRElement) {
              run.removeChild(run.firstElementChild);
            }
            if (run.isEmpty()) {
              textNode = document.createTextNode(evt.key);
              startOffset = 1;
              run.appendChild(textNode);
            } else {
              textNode = run.childNodes[0];
              startOffset = 0;
              textNode.insertData(startOffset, evt.key);
            }
          }
        }
        placeCaret(textNode, startOffset);
      }
    }
  }
  function decorateRun(para, run) {
    if (para.model &&
      para.model.characterFormatting) {
      run.decorate(para.model.characterFormatting, false);
    }
  }
  function placeCaret(textNode, startOffset) {
    if (textNode) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      var r = document.createRange();
      startOffset += 1;
      if (startOffset > textNode.length) {
        startOffset = textNode.length;
      }
      r.setStart(textNode, startOffset);
      r.collapse(true);
      sel.addRange(r);
    }
  }

  function hasDrawing(para) {
    var children = para.children;
    var paraHasDrawing = false;
    for (var i = 0; i < children.length && !paraHasDrawing; i++) {
      paraHasDrawing = children[i] instanceof QowtDrawing &&
        !(children[i].isAbsolutelyPositioned());
    }
    return paraHasDrawing;
  }

  /**
   * When a paragraph's only child is drawing and if Ctrl + delete is pressed
   * browser removes the paragraph along with the drawing. To match
   * behaviour with master, we are handling this case ourselves.
   */
  function _handleCtrlDeleteCase(evt) {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var para = getCurrentPara(range);
      if (para) {
        var position = _getCaretPosition(range, para);
        if (evt.ctrlKey && evt.key === 'Delete' && position === 'START') {
          var children = para.children;
          if (children.length === 1 && startsWithDrawingOrHyperlink(para)) {
            evt.preventDefault();
            var child = children[0];
            var grandChildren = Polymer.dom(child).children;
            for (var i = 0; i < grandChildren.length; i++) {
              var grandChild = grandChildren[i];
              grandChild.setAttribute('removedFromShady', true);
            }
            para.removeChild(child);
            child.setAttribute('removedFromShady', true);
          }
        }
      }
    }
  }

  function _handleMerge(firstPara, secondPara, firstSection,
    secondSection, isSecondPara) {
    if (secondPara) {
      removeAbsoluteDrawings(secondPara);
      if (secondPara.isEmpty() || (secondPara instanceof QowtWordPara && (
          secondPara.hasEmptyRunAndBr() ||
          secondPara.hasOnlyPageBreak() ||
          startsWithDrawingOrHyperlink(secondPara)))) {
        if (firstPara) {
          removeParagraph(secondPara, firstPara);
          if (secondSection instanceof QowtSection) {
            if (Polymer.dom(secondSection).childNodes.length === 0) {
              removeSection(secondSection);
            }
          }
        } else {
          if (secondSection instanceof QowtSection) {
            if (Polymer.dom(firstSection).childNodes.length === 0) {
              removeSection(firstSection);
            } else {
              _mergeSections(secondPara, firstSection, secondSection,
                isSecondPara);
            }
          }
        }
      } else {
        if (secondSection instanceof QowtSection) {
          _mergeSections(secondPara, firstSection, secondSection,
            isSecondPara);
        } else {
          _mergeParagraphs(firstPara, secondPara);
        }
      }
    }
  }

  function removeSection(section) {
    var page = Polymer.dom(section).parentNode;
    Polymer.dom(page).removeChild(section);
    Polymer.dom(page).flush();
  }

  /*
   Merge two section based on user action (backspace/delete)
   Here we are merging single para at a time
  */
  function _mergeSections(secondPara, firstSection, secondSection,
    isSecondPara) {
    var firstPara;
    if (isSecondPara) {
      if (Polymer.dom(secondPara).previousSibling) {
        firstPara = Polymer.dom(secondPara).previousSibling;
      } else {
        firstPara = Polymer.dom(secondSection).lastElementChild;
      }
    } else {
      firstPara = Polymer.dom(firstSection).lastElementChild;
    }

    if (startsWithDrawingOrHyperlink(secondPara) ||
      startsWithPageBreak(secondPara)) {
      removeParagraph(secondPara, firstPara);
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      if (range.startContainer.nodeName === 'QOWT-SECTION') {
        var startNode = range.startContainer;
        var startOffset = range.startOffset;
        var node = startNode.childNodes[startOffset];
        if (node instanceof QowtWordPara) {
          range.setStart(node, 0);
          range.setEnd(node, 0);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        } else if(startNode.isEmpty()){
          range.setStart(firstPara, firstPara.children.length - 1);
          range.setEnd(firstPara, firstPara.children.length - 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          firstPara.focus();
          firstPara.scrollIntoViewIfNeeded();
        }
      }
    } else if (startsWithPageBreak(firstPara)) {
      removeParagraph(firstPara, secondPara);
      setCaretAtStart(secondPara);
    } else {
      _mergeParagraphs(firstPara, secondPara);
    }

    if (isSecondPara && Polymer.dom(firstSection).childNodes.length === 0) {
      removeSection(firstSection);
    } else if (Polymer.dom(secondSection).childNodes.length === 0) {
      removeSection(secondSection);
    }
  }

  function startsWithDrawingOrHyperlink(para) {
    var child = para.children[0];
    return child instanceof QowtDrawing ||
      para.children[0] instanceof QowtDrawing ||
      child instanceof QowtHyperlink ||
      child.getAttribute &&
      child.getAttribute('qowt-divtype') ==='qowt-field-datetime';
  }

  function startsWithPageBreak(para) {
    return para.children[0] instanceof QowtPageBreak;
  }

  /**
   * Remove run and br from the para before merging the next para.
   */
  function _handleEmptyPara(para) {
    // Empty para means -
    // 1. we have run with br inside it or
    // 2. only br. or
    // 3. empty run with br as sibling
    var children = Array.from(para.children);
    while(children.length > 0) {
      var child = children.pop();
      child.setAttribute('removedFromShady', true);
      if (child.nodeName === 'BR') {
        child.setAttribute('removedByCode', true);
      }
      if (!(child.isAbsolutelyPositioned &&
          child.isAbsolutelyPositioned())) {
        para.removeChild(child);
      }
    }
  }

  /**
   * Copy para content from 'from' para to 'to' para until drawing
   * is encountered or entire content is copied.
   */
  function copyParaContentUptoDrawing(to, from) {
    var length = from.children.length;
    var lastElementChild;
    if (to.lastElementChild && to.lastElementChild.is === 'qowt-page-break') {
      lastElementChild = to.lastElementChild;
    }
    for (var i = 0; i < length; i++) {
      var orgNode = from.children[i];
      var divType = orgNode.getAttribute &&
        orgNode.getAttribute('qowt-divtype');
      if (orgNode instanceof QowtDrawing ||
        orgNode instanceof QowtLineBreak ||
        (divType === 'qowt-field-datetime')) {
        return i;
      }
      if(divType === 'qowt-field-pagenum' ||
        divType === 'qowt-field-numpages') {
        var node = orgNode.children[0].cloneNode(true);
        to.appendChild(node);
      }
      if (!(orgNode instanceof QowtWordRun &&
        orgNode.get('hid'))) {
        if (!(orgNode instanceof QowtColumnBreak ||
            orgNode instanceof QowtPageBreak ||
            (divType === 'qowt-field-pagenum' ||
            divType === 'qowt-field-numpages' ))) {
          var newNode;

          if (orgNode instanceof QowtWordRun) {
            if (orgNode.innerText.length > 0) {
              newNode = orgNode.cloneNode(true);
              newNode.style.cssText = orgNode.style.cssText;
              to.appendChild(newNode);
            }
          } else {
            newNode = orgNode.cloneNode(true);
            newNode.style.cssText = orgNode.style.cssText;
            to.appendChild(newNode);
          }
        }
      }
    }
    if (lastElementChild && to.lastElementChild !== lastElementChild) {
      Polymer.dom(to).removeChild(lastElementChild);
      Polymer.dom(to).flush();
    }
    return i;
  }

  /**
   * Removes absolutely positioned drawings from paragraph
   */
  function removeAbsoluteDrawings(para) {
    var children = para.children;
    for (var i = 0; i < children.length; i++) {
      var child = para.children[i];
      if((child instanceof QowtDrawing) &&
      (child.getAttribute &&
        child.getAttribute('wrappingstyle') !== 'inlineWithText' &&
        child.getAttribute('wrappingstyle') !== 'behindText' &&
        child.getAttribute('wrappingstyle') !== 'inFrontOfText')) {
        para.removeChild(child);
        child.setAttribute('removedFromShady', true);
      }
    }
  }

  /**
   * Removes the paragraph from its parent. Since removing elements is a
   * time consuming process in Polymer, we don't remove the children.
   * Instead we mark them that they have been removed so that they don't
   * create problem in localDOMRemoved. We rely on Polymer to remove
   * all children when we remove the paragraph.
   */
  function removeParagraph(para, focusPara, ignoreSetCaret) {
    var children = Array.from(para.children);
    while(children.length > 0) {
      var child = children.pop();
      if (child instanceof QowtHyperlink || child instanceof QowtDrawing) {
        var grandChildren = Polymer.dom(child).children;
        for (var i = 0; i < grandChildren.length; i++) {
          var grandChild = grandChildren[i];
          if (grandChild instanceof QowtTextBox) {
            var tbParas = Polymer.dom(grandChild).children;
            for (var j = 0; j < tbParas.length; j++) {
              var tbRuns = Polymer.dom(tbParas[j]).children;
              for (var k = 0; k < tbRuns.length; k++) {
                tbRuns[k].setAttribute('removedFromShady', true);
              }
              tbParas[j].setAttribute('removedFromShady', true);
            }
          } else {
            grandChild.setAttribute('removedFromShady', true);
          }
        }
      }
      child.setAttribute('removedFromShady', true);
    }

    function isTDParent(para){
      var paraParent = Polymer.dom(para).parentNode;
      return paraParent.nodeName === 'TD';
    }

    if (isTDParent(para)) {
      var table = Polymer.dom(para).parentNode;
      Polymer.dom(table).removeChild(para);
      Polymer.dom(table).flush();
    } else {
      var section = para.parentElement;
      Polymer.dom(section).removeChild(para);
      Polymer.dom(section).flush();
    }

    para.setAttribute('removedFromShady', true);

    if (!ignoreSetCaret && !(focusPara instanceof QowtTable)) {
      if ((focusPara.isEmpty() && !hasHyperlink(focusPara)) ||
        focusPara.hasEmptyRunAndBr()) {
        setCaretAtStart(focusPara);
      } else {
        setCaretAtMergePoint(focusPara,
          getNonEmptyRunOffset(focusPara, focusPara.children.length - 1));
      }
    }
  }

  function hasHyperlink(focusPara) {
    return focusPara.querySelectorAll('a').length;
  }

  /**
   * Removes the elements from the para upto the index provided.
   */
  function removePartOfPara(para, upto) {
    var i = 0;
    if(para.children[upto] instanceof QowtLineBreak) {
      upto += 1;
    }
    while(i < upto) {
      var child = para.children[0];
      if (!(child.isAbsolutelyPositioned &&
        child.isAbsolutelyPositioned())) {
        para.removeChild(child);
        child.setAttribute('removedFromShady', true);
      }
      i++;
    }
  }

  /**
   * Set caret at the merge point within paragraph. The merge point
   * is given by the offset within the node. We set the caret at the
   * end of the node except in case of Hyperlink. In case of
   * Hyperlink we set the caret at the start of the next node.
   */
  function setCaretAtMergePoint(node, offset) {
    var sel = window.getSelection();
    var range = document.createRange();
    if (node.children[offset] instanceof QowtHyperlink ||
      node.children[offset] instanceof QowtDrawing) {
      range.setStart(node, node.childNodes.length);
      range.setEnd(node, node.childNodes.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (node.children[offset] instanceof QowtWordRun) {
      var textNode = node.children[offset].childNodes[0];
      range.setStart(textNode, textNode.textContent.length);
      range.setEnd(textNode, textNode.textContent.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    node.focus();
  }

  /**
   * Set the caret at the start of the node.
   */
  function setCaretAtStart(node) {
    var sel = window.getSelection();
    var range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    node.focus();
  }

  /**
   * The selection fails when we try to set it in the empty runs.
   * This function returns the offset of the first non empty run.
   */
  function getNonEmptyRunOffset(para, offset) {
    var child = para.children[offset];
    if (child && child.isEmpty && !(child.isEmpty())) {
      return offset;
    }
    var validOffsetFound = false;
    for (var i = offset - 1; i >= 0 && !validOffsetFound; i--) {
      child = para.children[i];
      if (child && child.isEmpty) {
        validOffsetFound = !(child.isEmpty());
        if (validOffsetFound) {
          return i;
        }
      }
    }
    return offset;
  }

  /**
   * Returns true if the paragraph's last child is drawing.
   */
  function endsWithDrawing(para) {
    var totalChildren = para.children.length;

    return (para.lastElementChild instanceof QowtDrawing) ||
      (para.lastElementChild instanceof HTMLBRElement &&
      para.children[totalChildren - 2] instanceof QowtDrawing);
  }

  /**
   * Merges second paragraph with first paragraph.
   * 1. If the first paragraph is empty we remove the run and br from it.
   * 2. If the first paragraph ends with drawing merging is not allowed.
   * 3. If the second para starts with drawing/hyperlink, second para is
   *  completely deleted.
   * 4. In general only text with text/hyperlink can be merged.
   */
  function _mergeParagraphs(firstPara, secondPara, ignoreSetCaret) {
    if (firstPara && secondPara) {
      if (firstPara.isEmpty() ||
        (firstPara instanceof QowtWordPara && firstPara.hasEmptyRunAndBr())) {
        _handleEmptyPara(firstPara);
      }
      if (!(endsWithDrawing(firstPara))) {
        var preMergeChildrenCount = firstPara ?
          firstPara.children.length : undefined;
        var copiedContentUpto =
          copyParaContentUptoDrawing(firstPara, secondPara);
        if (copiedContentUpto === secondPara.children.length) {
          removeParagraph(secondPara, firstPara, ignoreSetCaret);
        } else {
          removePartOfPara(secondPara, copiedContentUpto);
        }
        if (!ignoreSetCaret && !(firstPara instanceof QowtTable)) {
          if (preMergeChildrenCount) {
            setCaretAtMergePoint(firstPara,
              getNonEmptyRunOffset(firstPara, preMergeChildrenCount - 1));
          } else {
            setCaretAtStart(firstPara);
          }
        }
      } else if (paraHasOnlyInfrontOrBehindDrawing(firstPara)) {
        // If first paragraph has only infront/behindText type of drawing
        // then we need to place the cursor at the start of the second
        // paragraph. This is to match master behaviour.
        setCaretAtStart(secondPara);
      }
    }
  }

  /**
   * Returns true if the paragraph has only drawing with infront or
   * behindText wrapping style.
   * @param {*} para
   */
  function paraHasOnlyInfrontOrBehindDrawing(para) {
    return para && para.children.length === 1 &&
      para.children[0] instanceof QowtDrawing &&
      para.children[0].isAbsolutelyPositioned();
  }

  function _setRangeToDeleteTable() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var para = getCurrentPara(range);
      if (para) {
        var nextElement = getNextSibling(para);
        var endOffSet =
        Array.from(nextElement.parentNode.childNodes).indexOf(nextElement) + 1;
        range.setEnd(nextElement.parentElement, endOffSet);
      }
    }
  }

  function _lastParaAndTableMerge() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var para = getCurrentPara(range);
      if (para) {
        var position = _getCaretPosition(range, para);
        var nextElement = getNextSibling(para);
        if(nextElement instanceof QowtTable && position === 'END') {
          var page = Polymer.dom(para.parentNode).parentNode;
          var lastParaOnPage = page.lastContentNode();
          if (lastParaOnPage.id === para.id) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function _paraHasEmptyRunAtTheEnd() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var para = getCurrentPara(range);
      if(para && para.textContent.length === 1 &&
        para.lastElementChild.isEmpty()) {
          return true;
      } else {
        return false;
      }
    }
  }

  function _paraHasOnlyDrawing() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var para = getCurrentPara(range);
      if (para) {
        var children = para.children;
        var allRunsEmpty = true;
        var drawingFound = false;
        for (var i = 0; i < children.length && allRunsEmpty; i++) {
          if (children[i] instanceof QowtDrawing) {
            drawingFound = true;
          } else if (children[i] instanceof QowtWordRun) {
            allRunsEmpty = children[i].isEmpty();
          }
        }
        return allRunsEmpty && drawingFound;
      }
    }
    return false;
  }

  function getNextSibling(currentPara) {
    var nextPara = Polymer.dom(currentPara).nextSibling;
    if (!nextPara) {
      var firstSection = currentPara.parentElement;
      var secondSection = Polymer.dom(firstSection).nextSibling;
      if (!secondSection) {
        var nextPage = Polymer.dom(firstSection)
          .parentNode.nextSibling;
        if (nextPage) {
          secondSection = Polymer.dom(nextPage).firstChild;
        }
      }
      if (secondSection instanceof QowtSection) {
        nextPara = Polymer.dom(secondSection).firstChild;
      }
    }
    return nextPara;
  }

  function _isParagraphMerge(evt) {
    if (evt) {
      var sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        var para = getCurrentPara(range);
        if (para) {
          var position = _getCaretPosition(range, para);
          var nextElement = getNextSibling(para);
          if (evt.key === 'Backspace' && position === 'START') {
            return true;
          } else if (evt.key === 'Backspace' && position === 'END' &&
            (para.isEmpty && para.isEmpty() || (para instanceof QowtWordPara &&
            para.hasEmptyRunAndBr()))) {
            return true;
          } else if (!(nextElement instanceof QowtTable)) {
            if (evt.key === 'Delete' && position === 'END') {
              return true;
            } else if (evt.key === 'Delete' && position === 'START' &&
              ((para.isEmpty && para.isEmpty() && !hasDrawing(para)) ||
              (para instanceof QowtWordPara && para.hasEmptyRunAndBr()))) {
                return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Correcting selection if endContainer is TR node
   */
  function _correctSelection() {
    var sel = window.getSelection();
    if (!sel.isCollapsed) {
      var range = sel.getRangeAt(0);
      var startContainer = range.startContainer;
      var endContainer = range.endContainer;
      var endParent = endContainer.parentElement;
      var allParagraphs =
      document.querySelectorAll('p:not([qowt-paratype="hf-para"])');
      var endOffset = range.endOffset;
      var childNodes = Array.from(range.cloneContents().childNodes);
      if(startContainer.nodeName === 'P' &&
        (startContainer.clickCount === 2 ||
        startContainer.clickCount === 3) &&
        range.startOffset === range.startContainer.childNodes.length) {
        range.setEnd(range.startContainer, range.startOffset);
      }
      if (endContainer.nodeName === 'TR') {
        var node = Polymer.dom(endContainer.childNodes[endOffset-1]);
        node = node.lastElementChild;
        if (node.nodeName === 'P') {
          endContainer = node;
          if (node.lastElementChild.nodeName === 'SPAN') {
            node = node.lastElementChild;
            endContainer = node;
            if (node.firstChild) {
              endContainer = node.firstChild;
            }
            endOffset = node.textContent.length;
          } else {
            endOffset = node.childNodes.length;
          }
        }
        range.setEnd(endContainer, endOffset);
      } else if((endParent.nodeName === 'P') &&
          (endParent.isFlowing()) &&
          (allParagraphs[allParagraphs.length - 1].id === endParent.id) &&
          (endContainer.nodeType === Node.TEXT_NODE)) {
            setEditableEndRange(endParent, range);
      } else if (childNodes.length === 2) {
        var para1 = document.getElementById(childNodes[0].id);
        var para2 = document.getElementById(childNodes[1].id);
        if (para1 instanceof QowtWordPara && para2 instanceof QowtWordPara &&
          ((para1.clickCount === 3) || (para1.clickCount === 2 
            && para1.isEmpty()))) {
            setEditableEndRange(para1, range);
        }
      }
    }
  }

  //This function will set an editable end range
  //to the given paragraph's last editable node.
  function setEditableEndRange(para, range) {
    var end = DomUtils.getLastEditableNode(para);
    if (end instanceof QowtWordRun) {
      range.setEnd(end.firstChild, end.firstChild.length);
    } else if (end instanceof HTMLBRElement) {
      range.setEnd(end, 0);
    }
  }


  /**
   * handle backspace and delete key action on selected region
   */
  function _handleBackspaceDeleteWithSelection(evt) {
    var sel = window.getSelection();
    if (!sel.isCollapsed) {
      WidowOrphanHelper.unbalanceSelection();
      setSelectionIfNeeded();
      sel = window.getSelection();
      var model = evt ? {} : undefined;
      SelectionCorrections.handle(sel, model);
      if(evt) {
        typeCharacter(evt, model);
      }
      WidowOrphanHelper.balance();
    }
  }

  /**
   * handle clipboard data for word app if clipboard data has new line
   * reason was clipboard data is not inserted into a shady root if it
   * has new line or new paragraph
   */
  function _handleClipboardAction(textContents){
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var para = getCurrentPara(range);
    var position = _getCaretPosition(range, para);
    if (para) {
      if ((textContents.match(/\n/g)||[]).length > 0) {
        textContents = textContents.split(/\r?\n/);
        switch (position) {
          case 'START':
          case 'END':
          case 'MIDDLE':
            para = insertDataAtCaretPos(para, range, textContents, 'paste');
            _setFoucs(para, range, sel);
            break;
        }
      } else {
        var node = range.startContainer;
        var startOffset = range.startOffset;
        var nodeText;
        if (node.nodeName === 'P') {
          var childNode = node.childNodes[startOffset];
          if (startOffset === 0 &&
              node.firstElementChild &&
              node.firstElementChild.nodeName === 'SPAN') {
            childNode = node.firstElementChild;
          }
          if (childNode && childNode.nodeName === 'SPAN') {
            startOffset = textContents.length;
            textContents = textContents + childNode.textContent;
            if (childNode.firstChild && childNode.firstChild.length > 0) {
              childNode = childNode.firstChild;
              childNode.nodeValue = textContents;
              range.setStart(childNode, startOffset);
              range.setEnd(childNode, startOffset);
            } else {
              childNode.textContent = textContents;
              range.setStart(childNode.firstChild, startOffset);
              range.setEnd(childNode.firstChild, startOffset);
            }
          } else {
            nodeText = document.createTextNode(textContents);
            var newWordRun = new QowtWordRun();
            newWordRun.appendChild(nodeText);
            node.insertBefore(newWordRun, childNode);
            startOffset = textContents.length;
            range.setStart(nodeText, startOffset);
            range.setEnd(nodeText, startOffset);
          }
          _setFoucs(para, range, sel);
        } else {
          nodeText = node.textContent;
          if (startOffset === 0) {
            nodeText = textContents + nodeText;
            startOffset = textContents.length;
          } else if (startOffset === nodeText.length) {
            nodeText += textContents;
            startOffset = nodeText.length;
          } else {
            nodeText = nodeText.substring(0, startOffset) +
                textContents + nodeText.substring(startOffset);
            startOffset += textContents.length;
          }
          node.textContent = nodeText;
          range.setStart(node, startOffset);
          range.setEnd(node, startOffset);
          _setFoucs(para, range, sel);
        }
      }
    }
  }

  /*
    This function is written to setting character formatting to the
    new para which is getting generated after enter key press operation
  */
  function setCharacterFormatting(newPara){
    if(Object.keys(JSON.parse(newPara.getAttribute('qowt-format'))).length > 0)
    {
      var qowt_format = JSON.parse(newPara.getAttribute('qowt-format'));
      newPara.model.characterFormatting = qowt_format;
    }
    return newPara;
  }

  /**
   * Inserting data at caret position
   * 1. Caret position may be at the start of para
   * 2. Caret position may be at the middle of para
   * 3. Caret position may be at the end of para
   */
  function insertDataAtCaretPos(para, range, textContents,
    type, position, isSelectionBeforeEnter) {
    var parent = Polymer.dom(para).parentNode;
    var nextSibling = Polymer.dom(para).nextSibling;
    var commonAncestor = range.commonAncestorContainer;
    var index = 0;
    // Offset for caret position
    var caretOffset;
    if (commonAncestor.nodeName === 'SPAN') {
      index = DomUtils.peerIndex(commonAncestor);
    } else if (DomUtils.isField(commonAncestor.parentNode.parentNode)) {
      index = DomUtils.peerIndex(commonAncestor.parentNode.parentNode);
    } else {
      index = DomUtils.peerIndex(commonAncestor.parentNode);
    }

    var newPara = clonePara(para);
    var newWordRun = new QowtWordRun();

    var startSubStr = '', endSubStr = '', textContent;

    // Extracting and dividing the text part of children into start and end
    // sub string depending upon caret position
    if (para.children[index] instanceof QowtWordRun ||
        DomUtils.isField(para.children[index])) {
      if (para.children[index].textContent.length > 0) {
        startSubStr = para.children[index].textContent
          .substring(0, range.startOffset);

        endSubStr = para.children[index].textContent
          .substring(range.startOffset);
      }

      newWordRun = para.children[index].cloneNode();
      if(!para.isEmpty() || para.hasTemporaryRun()) {
        newWordRun.style.cssText = para.children[index].style.cssText;
      }
    }

    if(nextSibling === null && type === 'paste' &&
    textContents[0].length === 0 && para.isEmpty()) {
      textContents.shift();
    }

    // Handle beginning part of caret position
    textContent = textContents.shift();

    var field = para.querySelector('[qowt-divtype].qowt-field');
    var drawing = para.querySelector('qowt-drawing');

    // This 'if' part is to be removed when fields will be supported
    // by Core.
    if(position === 'START' &&
    (((field || drawing) && type === "Enter") ||
     (index === 0 && !isSelectionBeforeEnter))) {
      newWordRun.appendChild(document.createElement('br'));
      newPara.appendChild(newWordRun);
      Polymer.dom(parent).insertBefore(newPara, para);
      Polymer.dom(parent).flush();
      if(newPara.hasAttribute('qowt-format')){
        newPara = setCharacterFormatting(newPara);
      }
      caretOffset = newWordRun.textContent.length;
    } else if((field || drawing) && type === "Enter" && position === 'END') {
      newWordRun.appendChild(document.createElement('br'));
      newPara.appendChild(newWordRun);

      Polymer.dom(parent).insertBefore(newPara, nextSibling);
      Polymer.dom(parent).flush();
      if(newPara.hasAttribute('qowt-format')){
        newPara = setCharacterFormatting(newPara);
      }
      caretOffset = newWordRun.textContent.length;
    } else {
      var newNodes = handleBeginPartOfCaret(startSubStr, para, index,
        textContent, newWordRun, newPara, parent, nextSibling, range);

      newPara = newNodes.newPara;
      newWordRun = newNodes.newWordRun;

      // Inserting new content at caret/target position
      while(textContents.length) {
        textContent = textContents.shift();

        newWordRun.textContent = textContent;
        if (textContent === '') {
          newWordRun.appendChild(document.createElement('br'));
        }

        if (textContents.length) {
          newPara = clonePara(para);
          if (para.children[index] instanceof QowtWordRun) {
            newWordRun = para.children[index].cloneNode();
            newWordRun.style.cssText = para.children[index].style.cssText;
            newWordRun.setModel(para.children[index].model);
            newWordRun.setAttribute('formattedRun', true);
          } else {
            newWordRun = new QowtWordRun();
          }
          newWordRun.appendChild(document.createElement('br'));
          newPara.appendChild(newWordRun);
          Polymer.dom(parent).insertBefore(newPara, nextSibling);
          Polymer.dom(parent).flush();
          if(newPara.hasAttribute('qowt-format')){
            newPara = setCharacterFormatting(newPara);
          }
        }
      }
      caretOffset = newWordRun.textContent.length;
      var childLength = para.children.length;

      // Handle ending part of caret position
      newWordRun = handleEndPartOfCaret(endSubStr, newWordRun, childLength,
        newPara, para, index + 1);
    }

    // Handling caret positions
    if (newWordRun instanceof QowtHyperlink ||
      newWordRun instanceof QowtDrawing ||
      newWordRun instanceof QowtLineBreak ||
      DomUtils.isField(newWordRun)) {
      if(position === 'START') {
        range.setStart(para, 0);
      } else {
        range.setStart(newPara, 0);
      }
    } else if (newWordRun.textContent.length > 0) {
      range.setStart(newWordRun.firstChild, caretOffset);
    } else if(position === 'START' && !isSelectionBeforeEnter) {
      range.setStart(para, caretOffset);
    } else {
      range.setStart(newWordRun, caretOffset);
    }

    return newPara;
  }

  /**
   * Handling and updating beginning part of para from caret position.
   * It will add new para and new run inside shady dom.
   */
  function handleBeginPartOfCaret(startSubStr, para, index, textContent,
     newWordRun, newPara, parent, nextSibling, range) {
    var child  = para.children[index];
    if (startSubStr.length > 0) {
      child.firstChild.textContent = startSubStr;
      if (textContent !== '') {
        child.firstChild.textContent += textContent;
      }
      newWordRun.appendChild(document.createElement('br'));
    } else if (child instanceof QowtWordRun) {
      if (textContent === '') {
        child.textContent = textContent;
        child.appendChild(document.createElement('br'));
      } else if (child.firstChild && child.firstChild.length > 0) {
        child.firstChild.nodeValue = textContent;
      } else {
        child.textContent = textContent;
      }
      newWordRun.appendChild(document.createElement('br'));
    } else if (child instanceof HTMLBRElement) {
      para.removeChild(child);
      child.setAttribute('removedFromShady', true);
      newWordRun.textContent = textContent;
      if (textContent === '') {
        newWordRun.appendChild(document.createElement('br'));
      }
      para.appendChild(newWordRun);
      newWordRun = newWordRun.cloneNode();
      newWordRun.appendChild(document.createElement('br'));
    } else if (child instanceof QowtHyperlink ||
      child instanceof QowtDrawing || DomUtils.isField(child)) {
      var position = _getCaretPosition(range, child);

      newWordRun.textContent = textContent;
      if (textContent === '') {
        newWordRun.appendChild(document.createElement('br'));
      }

      if (position === 'START') {
        if (index === 0) {
          para.setAttribute('removedLink', true);
        }
        para.insertBefore(newWordRun, child);
        newWordRun = newWordRun.cloneNode();
        newWordRun.appendChild(document.createElement('br'));
      }
    } else if (child instanceof QowtPageBreak) {
      para.removeChild(child);
      child.setAttribute('removedFromShady', true);
      newWordRun.textContent = textContent;
      if (textContent === '') {
        newWordRun.appendChild(document.createElement('br'));
      }
      para.appendChild(newWordRun);
      newWordRun = newWordRun.cloneNode();
      newWordRun.appendChild(document.createElement('br'));
    } else if (!child) {
      child = new QowtWordRun();
      child.textContent = textContent;
      if(para) {
        para.appendChild(child);
      }
    }

    newPara.appendChild(newWordRun);
    Polymer.dom(parent).insertBefore(newPara, nextSibling);
    Polymer.dom(parent).flush();
    if(newPara.hasAttribute('qowt-format')){
      newPara = setCharacterFormatting(newPara);
    }
    return {
      newPara: newPara,
      newWordRun: newWordRun
    };
  }

  /**
   * Handling and updating ending part of para from caret position.
   * It will move existing childs to new para of shady dom.
   */
  function handleEndPartOfCaret(endSubStr, newWordRun, childLength,
    newPara, para, index) {
    var i = index;
    if (endSubStr.length > 0) {
      newWordRun.textContent += endSubStr;
      while (i < childLength) {
        newPara.appendChild(para.children[index]);
        i++;
      }
    } else if (i < childLength) {
      if (para.children[index] instanceof QowtHyperlink ||
        para.children[index] instanceof QowtDrawing) {
        if (newWordRun.textContent.length === 0) {
          newWordRun.setAttribute('removedFromShady', true);
          newPara.removeChild(newWordRun);
          newWordRun = para.children[index];
        }
      } else if (para.children[index] instanceof QowtLineBreak) {
        // In this case, we just need to move all the content
        // starting from line break to newly created para.
        newPara.removeChild(newWordRun);
        newWordRun = para.children[index];
        newPara.appendChild(para.children[index]);
        i++;
      } else {
        newWordRun.textContent += para.children[index].textContent;
        newWordRun.style.cssText = para.children[index].style.cssText;
        if (index < para.children.length) {
          if (para.children[index].isEmpty &&
              para.children[index].isEmpty() === true &&
              para.children.length > 1 && index > 0) {
            newWordRun.style.cssText = para.children[ index-1 ].style.cssText;
            newWordRun.setModel(para.children[ index-1 ].model);
          } else {
            newWordRun.setModel(para.children[index].model);
          }
          newWordRun.setAttribute('formattedRun', true);
        }
        para.children[index].setAttribute('removedFromShady', true);
        para.removeChild(para.children[index]);
        i++;
      }
      while (i < childLength) {
        newPara.appendChild(para.children[index]);
        i++;
      }
    }
    return newWordRun;
  }

  // handled Enter key action for word app
  // reason was contentEditable not creating para in a shady root
  // which results in breaking pagination algorithm
  function _handleEnterKeyAction() {
    // we were unable to get the position where cursor is placed just by evt
    // so we have identified position using selection API
    if(_focusUndoRedoFlag) {
      return;
    }
    var sel = window.getSelection();
    var isSelectionBeforeEnter = false;
    if (!sel.isCollapsed) {
      WidowOrphanHelper.unbalanceSelection();
      setSelectionIfNeeded();
      sel = window.getSelection();
      SelectionCorrections.handle(sel);
      isSelectionBeforeEnter = true;
    }

    sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var para = getCurrentPara(range);
    var position = _getCaretPosition(range, para);
    if (para) {
      switch (position) {
        case 'START':
        case 'END':
        case 'MIDDLE':
          para = insertDataAtCaretPos(para, range, [''], "Enter", 
          position, isSelectionBeforeEnter);
          _setFoucs(para, range, sel);
          break;
      }
    }
  }

  /**
   * This will modify the selection only in case of ctrl + A operation
   * is made before this call. This ensures that all the nodes on the
   * page considering flowing paragraphs as well gets counted in the
   * range for the further actions to happen properly
   */
  function setSelectionIfNeeded() {
    if(_api.modifyEndRange) {
      var range = window.getSelection().getRangeAt(0);
      if(range.endContainer.isEmpty && !range.endContainer.isEmpty()) {

        /* TODO: we are explicitly setting endOffset to 'childNodes.length - 1'
        this exludes the last textNode. This needs to be done since
        flowAlgorithm considers children instead of childNodes which
        causes issues in the deletion, we will remove this once we
        change everything to childNodes.*/

        range.setEnd(range.endContainer,
        range.endContainer.childNodes.length - 1);
      }
      _handleBeforeEdit();
      _api.modifyEndRange = false;
    }
  }

  function getCurrentPara(range) {
    var node = range.startContainer;
    if(node && node.parentNode) {
      var parent = node.parentNode;
      var grandParent = parent.parentNode;
      if (node instanceof QowtWordPara) {
        return node;
      } else if (parent instanceof QowtWordPara) {
        return parent;
      } else if (parent instanceof QowtWordRun) {
        if(grandParent.getAttribute &&
          grandParent.getAttribute('qowt-divtype')
          === 'qowt-field-numpages' ||
          grandParent.getAttribute('qowt-divtype')
          === 'qowt-field-pagenum'
        ) {
          return grandParent.parentNode;
        }
        return grandParent;
      } if (node instanceof QowtSection) {
        node = range.startContainer.children[range.startOffset];
        if (node instanceof QowtWordPara) {
          return node;
        }
      }
    }
    return null;
  }

  function clonePara(para) {
    var newPara = para.cloneNode();
    newPara.style.cssText = para.style.cssText;
    return newPara;
  }

  // set focus to the created paragraph
  function _setFoucs(para, range, sel) {
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    para.focus();
  }

  function allNextRunsAreEmpty(run) {
    var currentNode = run.nextSibling;
    var empty = true;
    while (currentNode && empty) {
      if (currentNode.isEmpty) {
        empty = currentNode.isEmpty();
      } else if (currentNode instanceof QowtDrawing ||
        DomUtils.isField(currentNode)) {
        empty = false;
      }
      currentNode = currentNode.nextSibling;
    }
    return empty;
  }

  function allRunsUptoIndexHidden(para, index) {
    var children = para.children;
    var allChildrenHidden = true;
    for (var  i = 0; i < index && allChildrenHidden; i++) {
      allChildrenHidden = children[i].get && children[i].get('hid');
    }
    return allChildrenHidden;
  }

  function allRunsUptoIndexDrawing(para, index) {
    var children = para.children;
    var allChildrenDrawing = true;
    for (var  i = 0; i < index && allChildrenDrawing; i++) {
      allChildrenDrawing = children[i] && children[i] instanceof QowtDrawing;
    }
    return allChildrenDrawing;
  }

  function allRunsUptoIndexAreTabOrHidden(para, index) {
    function isTabNode(node) {
      return node.getAttribute('qowt-runtype') === 'qowt-tab';
    }
    function isHiddenNode(node) {
      if (node && node.get) {
        return !!(child.get('hid'));
      }
      return false;
    }

    var childNodes = para.childNodes;
    var allChildrenHiddenOrTab = true;
    for (var  i = 0; i < index && allChildrenHiddenOrTab; i++) {
      var child = childNodes[i];
      if (child && child.nodeType !== Node.TEXT_NODE &&
        child.nodeType !== Node.COMMENT_NODE) {
        allChildrenHiddenOrTab = isHiddenNode(child) || isTabNode(child);
      }
    }
    return allChildrenHiddenOrTab;
  }

  //determine the cursor position so that we can insert the para
  function _getCaretPosition(range, para) {
    var isTextNode = range.commonAncestorContainer.nodeType === Node.TEXT_NODE;
    var commonAnc = range.commonAncestorContainer;
    if (range.collapsed && !(commonAnc instanceof QowtWordPara)) {
      if (isTextNode) {
        var index = DomUtils.peerIndex(commonAnc.parentNode);
        if (range.startOffset === 0 && range.endOffset === 0) {
          if (index === 0 ||
            (index > 0 && (allRunsUptoIndexHidden(para, index) ||
            allRunsUptoIndexDrawing(para, index))
            )) {
            return 'START';
          } else {
            return 'MIDDLE';
          }
        } else if (range.startOffset === range.endOffset &&
            range.endOffset === commonAnc.data.length) {
              if (index === para.children.length -1 ||
                allNextRunsAreEmpty(commonAnc.parentNode)) {
                return 'END';
              } else {
                return 'MIDDLE';
              }
        } else if (range.startOffset === range.endOffset &&
            range.endOffset < commonAnc.data.length) {
              return 'MIDDLE';
        }
      } else {
        var indexWithinParent = DomUtils.peerIndex(commonAnc);
        if (range.startOffset === 0 && indexWithinParent === 0) {
            return 'START';
        } else if (range.endOffset === commonAnc.textContent.length - 1 &&
          indexWithinParent === commonAnc.parentElement.children - 1) {
            return 'END';
        } else if (commonAnc instanceof QowtWordRun &&
          range.endContainer === range.startContainer &&
          range.commonAncestorContainer === range.endContainer &&
          range.start !== 0 &&
          allNextRunsAreEmpty(commonAnc)) {
          return 'END';
        }
        return 'MIDDLE';
      }
    } else if (!range.collapsed) {
      return 'ONSELECTION';
    } else {
      if (range.commonAncestorContainer === range.endContainer &&
        range.commonAncestorContainer === range.startContainer &&
        (allRunsUptoIndexAreTabOrHidden(para, range.startOffset) ||
        para.isEmpty && para.isEmpty())) {
        return 'START';
      } else if (range.startOffset === 0 && range.endOffset === 0) {
        return 'START';
      } else if (range.startOffset > 0 && range.endOffset > 0) {
        return 'END';
      }
    }
  }

  function _handleTextInput(evt) {
    _handleBeforeEdit();
    TextInputCorrections.handle(evt);
  }

  function _handleClipboard(evt) {
    _handleBeforeEdit();
    ClipboardCorrections.handle(evt);
    if (EnvModel.app === 'word' && evt.type === 'cut') {
      evt.preventDefault();
      document.execCommand('copy');
      _handleBackspaceDeleteWithSelection();
    }
  }

  /**
   * This function is used to group all the common actions that are required
   * before an edit occurs independently of they type of edit (key down, cut,
   * etc.).
   */
  function _handleBeforeEdit() {
    // capture a snapshot of the current selection before the edit occurs.
    _snapshotBeforeEdit = SelectionManager.snapshot();
  }

  /**
   * @private
   * Handles an array of Mutation Summary objects.
   *
   * Also acts as callback function for the Mutation Summary library.
   * The MutationSummary library takes care of the details of observing the DOM
   * for changes, computing the "net-effect" of what's changed and then delivers
   * these changes to this provided callback.
   *
   * @param {Array}  array of mutation summaries.
   */
  function _handleMutationSummaries(summaries) {
    if (summaries.length !== _mutationSummaryQueries.length) {
      throw new Error('summaries.length was expected to be ' +
          _mutationSummaryQueries.length + ', but was ' +
          summaries.length);
    }

    var hf = false;
    // ignore elements as it is not needed to handle
    var ignoreElements =
      ['qowt-header', 'template', 'qowt-footer', 'style', 'div'];
    var summary;
    if (summaries) {
      if (summaries[0].added[1]) {
        summary = summaries[0].added[1];
      } else {
        summary = summaries[0].added[0];
      }
    }

    // check and ignore mutation if it is from HF
    if (summary && summary.parentElement &&
       (summary.parentElement.closest('qowt-footer') ||
       summary.parentElement.closest('qowt-header'))) {
        hf = true;
      }
      // remove empty text nodes visible in HTML template from summary itself
      if (summaries) {
        if (summaries[0].added && summaries[0].added.length !== 0){
          _.remove(summaries[0].added, function(node) {
            if (node.nodeType === Node.COMMENT_NODE) {
              return true;
            }
            if (node.nodeType === Node.TEXT_NODE){
              if (node.nodeValue.trim().length === 0){
                return (/[^\xA0\t ]/.test(node.textContent));
              } else {
                return false;
              }
          } else {
             return false;
          }
          });

          // Polymer observer is not getting invoked during creation of new para
          // and due to which mutation summary is not getting generated for
          // qowt-format attribute change due to which following section is
          // added.
          summaries[0].added.forEach(function(node){
            if(node instanceof QowtWordPara &&
              node.hasAttribute('qowt-format') &&
              Object.keys(JSON.parse(node.getAttribute('qowt-format')))
              .length > 0) {
                if( summaries[0].attributeChanged['qowt-format']){
                  summaries[0].attributeChanged['qowt-format'].push( node );
                } else {
                  summaries[0].attributeChanged['qowt-format'] = [node];
                }
            }
          });
        }
          if (summaries[0].reparented && summaries[0].reparented.length !== 0) {
            _.remove(summaries[0].reparented, function (node) {
              if (node.nodeType === Node.COMMENT_NODE) {
                return true;
              }
              if (ignoreElements.includes(node.nodeName.toLowerCase())) {
                return true;
              }
              if (node.parentElement && node.parentElement.closest('style')) {
                return true;
              }
              if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim().length === 0) {
                  return (/[^\xA0\t ]/.test(node.textContent));
                } else {
                  return false;
                }
              } else {
                return false;
              }
            });
          }

        if (summaries[0].characterDataChanged &&
          summaries[0].characterDataChanged.length !== 0) {
          _.remove(summaries[0].characterDataChanged, function (node) {
            if (node.nodeType === Node.COMMENT_NODE) {
              return true;
            }
            if (node.nodeType === Node.TEXT_NODE) {
              if (node.nodeValue.trim().length === 0) {
                return (/[^\xA0\t ]/.test(node.textContent));
              } else {
                return false;
              }
            } else {
              return false;
            }
          });
        }

         if (summaries[0].reordered && summaries[0].reordered.length !== 0) {
           _.remove(summaries[0].reordered, function (node) {
            if (node.nodeType === Node.COMMENT_NODE) {
              return true;
            }
            if (node.nodeType === Node.TEXT_NODE) {
               if (node.nodeValue.trim().length === 0) {
                 return (/[^\xA0\t ]/.test(node.textContent));
               } else {
                 return false;
               }
             } else {
               return false;
             }
           });
         }
        if (summaries[0].attributeChanged &&
          summaries[0].attributeChanged.length !== 0) {
            _.remove(summaries[0].attributeChanged, function (node) {
              if (node.nodeType === Node.COMMENT_NODE) {
                return true;
              }
              if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim().length === 0) {
                  return (/[^\xA0\t ]/.test(node.textContent));
                } else {
                  return false;
                }
              } else {
                return false;
              }
            });
          }

        if (summaries[0].removed && summaries[0].removed.length !== 0) {
          _.remove (summaries[0].removed, function(node) {
            if (node.nodeType === Node.COMMENT_NODE) {
              return true;
            }
            if (ignoreElements.includes(node.nodeName.toLowerCase())) {
              return true;
            }
            if (node.parentElement && node.parentElement.closest('style')) {
              return true;
            }
            if (node.nodeName === 'COLGROUP' ||
                node.nodeName === 'COL' ||
                node.nodeName === 'DIV') {
              return true;
            }
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim().length === 0) {
                  return (/[^\xA0\t ]/.test(node.textContent));
                } else {
                  return false;
                }
            } else if (node.getAttribute('removedFromShady') === true) {
              return true;
            } else {
              return false;
            }
          });
        }
      }


    if (!hf) {
    // We only process the result of the first query. Each query provides
    // a view onto the same set of mutations, so by processing more than
    // one query, we would reprocess the same mutations multiple times.
    _handleMutationSummary(summaries[0]);
    }
  }

  /**
   * @private
   * the 'heart' of this tool; handling mutation summary objects.
   *
   * @param {Object} mutationSummary mutation summary object.
   */
  function _handleMutationSummary(mutationSummary) {
    if (_isEmptySummary(mutationSummary)) {
      return;
    }
    if (Features.isEnabled('logMutations')) {
      console.log('--------------- START transaction');
    }
    // for each mutation summary we initiate a QOWT Transaction
    // this ensures all translated commands are grouped in to a
    // transaction which can be rolled back if there was an error
    // in any one of the commands
    _startTransaction();

    // tag all nodes so that any mutation sequencer can process
    // them correctly
    _tagMutations(mutationSummary);

    // sequence any fix up of HTML that might be needed
    // if we are doing undo there is not need to do any cleanup.
    MutationSequencer.cleanHTML(mutationSummary);

    if (Features.isEnabled('logMutations')) {
      // log mutations for debugging
      LogMutation.logMutations(mutationSummary);
    }

    // let the Sequencer translate the mutations to qowt commands
    MutationSequencer.translateMutations(mutationSummary);

    // end the transaction; this will result in the dcp commands actually
    // being added to the command manager and sent out to our Core
    _endTransaction();

    // clear ALL tags now that we are done handling this mutation
    _clearTags(mutationSummary);

    if (Features.isEnabled('logMutations')) {
      console.log('--------------- END transaction');
    }

    mutationSummary.__requiresIntegrityCheck =
        ArrayUtils.unique(mutationSummary.__requiresIntegrityCheck);
    mutationSummary.__requiresIntegrityCheck =
      _.compact(mutationSummary.__requiresIntegrityCheck);

    PubSub.publish('qowt:doAction', {
      'action': 'verifyDocStructure',
      'context': {
        'contentType': 'common',
        'nodesToVerify': mutationSummary.__requiresIntegrityCheck
      }
    });
    mutationSummary.__requiresIntegrityCheck = [];

    // Handling a special case here where Br is removed from a paragraph, this
    // Br is removed by browser. We are handling it here to place the cursor at
    // the right place which is end of paragraph.
    // Use Case Scenario:
    // When in an empty para, user types and browser creates a following
    // structure : <p><span>--typedCharacter</span></p>
    // In this case, the newly created span is not in shady of its paragraph
    // since browser has created it. Along with that, br was removed from dom
    // but its still in its parent's shady.
    // In this case when code, creates a new run from the newly added span,
    // polymer adds back the BR and cursor is placed at the end of BR.
    // In localDomRemoved, BR is removed from the shady of its parent and
    // the cursor is moved at the start of the paragraph. Then typed character
    // moves at the place of BR, but the cursor remains at the start.
    if (EnvModel.app === 'word' && mutationSummary.removed &&
      !mutationSummary.attributeChanged["pending-flow"]) {
      mutationSummary.removed.forEach(function(node) {
        if (node.nodeName === 'BR' && !node.getAttribute('removedByCode')) {
          var oldParent = mutationSummary.getOldParentNode(node);
          if (oldParent instanceof QowtWordPara &&
            !oldParent.getAttribute('removedFromShady')) {
            var sel = window.getSelection();
            var range = document.createRange();
            range.setStart(oldParent, oldParent.childNodes.length);
            range.setEnd(oldParent, oldParent.childNodes.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      });
    }
  }

  function _isEmptySummary(summary) {
    // TODO(jliebrand): pages set an attrib for "pending-flow". This helps
    // with testing as it allows us to wait for all pages to be paginated.
    // But it means we get a mutation.
    // The "clean" option is for the text tool to not observe "all:true"
    // but instead have specific queries. The downside of that is that
    // it will get answers for the queries as separate summary objects
    // which makes sequencing of changes harder... sigh
    // So for now if we get a summary with ONLY the pending-flow change
    // then ignore the "empty" summary. This avoids nasty things like
    // the DocChecker from running when it need not do anything
    var noAttribChange = true;
    var ignoreAttribs = ['pending-flow'];
    for(var attrib in summary.attributeChanged) {
      if (ignoreAttribs.indexOf(attrib) === -1) {
        noAttribChange = false;
        break;
      }
    }

    return (noAttribChange &&
            summary.added.length === 0 &&
            summary.characterDataChanged.length === 0 &&
            summary.removed.length === 0 &&
            summary.reordered.length === 0 &&
            summary.reparented.length === 0);
  }

  function _tagMutations(summary) {

    function _tagRestructuredNode(node, tagName) {
      if (NodeTagger.hasOneOfTags(
          node, [Tags.DELETED, Tags.ADDED, Tags.MOVED])) {
        console.error(
            'node already had tags', NodeTagger.getTagKeys(node, Tags),
            'when trying to apply ', tagName);
        throw new Error('node was already tagged with restructuring');
      }
      NodeTagger.tag(node, Tags[tagName]);
    }

    // tag all deleted nodes
    summary.removed.forEach(function(node) {
      _tagRestructuredNode(node, 'DELETED');
    });
    // now tag all added nodes
    summary.added.forEach(function(node) {
      _tagRestructuredNode(node, 'ADDED');
    });
    // tag all moved nodes (eg reparented AND reordered)
    summary.reparented.concat(summary.reordered).forEach(function(node) {
      _tagRestructuredNode(node, 'MOVED');
    });
    // tag all nodes that had character data changes
    summary.characterDataChanged.forEach(function(node) {
      NodeTagger.tag(node, Tags.CHARDATA);
    });
    // tag all nodes that had attributes changed
    for(var attrib in summary.attributeChanged) {
      var changedNodes = summary.attributeChanged[attrib];
      changedNodes.forEach(function(node) {
        switch(attrib) {
        case 'id':
          NodeTagger.tag(node, Tags['ATTRIB-ID']);
          break;
        case 'style':
          NodeTagger.tag(node, Tags['ATTRIB-STYLE']);
          break;
        case 'class':
          NodeTagger.tag(node, Tags['ATTRIB-CLASS']);
          break;
        case 'qowt-format':
          NodeTagger.tag(node, Tags['ATTRIB-FORMAT']);
          break;
        default:
          // dont care about other attribs (for now)
          break;
        }
      });
    }
  }

  function _clearTags(summary) {
    var nodesToClear = summary.removed;
    nodesToClear = nodesToClear.concat(summary.added);
    nodesToClear = nodesToClear.concat(summary.reparented);
    nodesToClear = nodesToClear.concat(summary.reordered);
    nodesToClear = nodesToClear.concat(summary.characterDataChanged);

    if (summary.attributeChanged.id) {
      nodesToClear = nodesToClear.concat(summary.attributeChanged.id);
    }

    if (summary.attributeChanged.style) {
      nodesToClear = nodesToClear.concat(summary.attributeChanged.style);
    }

    if (summary.attributeChanged['class']) {
      nodesToClear = nodesToClear.concat(summary.attributeChanged['class']);
    }

    nodesToClear.forEach(function(node) {
      NodeTagger.clearAllTags(node);
    });
  }

  /**
   * start a QOWT transaction, to group all commands created by the
   * translators
   */
  function _startTransaction() {
    PubSub.publish('qowt:doAction', {
      'action': 'startTransaction',
      'context': {
        'contentType': 'mutation'
      }
    });
  }

  /**
   * end the QOWT transaction, which will cause the compound transaction
   * to be executed
   */
  function _endTransaction() {
    PubSub.publish('qowt:doAction', {
      'action': 'endTransaction',
      'context': {
        'contentType': 'mutation'
      }
    });
  }

  /**
   * Many of the qowt modules publish state change events. We are
   * interested in three modules in particular, since they can alter
   * the HTML content and would thus cause us to potentially receive
   * mutation summaries which we do not care about.
   * We refer to these modules as 'suppressors' and they are the
   * the DcpManager (processing incoming DCP), and
   * the commandManager (handling a revert loop).
   * Note: the commandManager also changes HTML during it's optimisitcEdit
   * cycle, but that is a state which we ARE interested in,
   * since optimistic edits need to be converted in to commands to the service
   *
   * @param {object} event state change event object
   * @param {object} eventData the contextual data for the state change
   */
  function _suppressorStateChange(evt, eventData) {

    if (evt === undefined || eventData === undefined) {
      return;
    }

    /**
     * Checks whether or not the cached state of a module is idle.
     *
     * Note that the state will be considered 'idle' in case it is not
     * defined.
     *
     * @return true if the module is 'idle', false otherwise.
     */
    function _cachedStateIsIdle(module) {
      // very first time around our cache is empty; eg undefined...
      return (_suppressors[module] === undefined ||
              _suppressors[module] === 'idle');
    }

    /**
     * This method is invoked when a module updates its state in order to
     * check if it's not 'idle' anymore.
     *
     * @param module {String} name of the module.
     * @param newState {String} new state of the module.
     * @return {Boolean} true if the module goes from 'idle' to 'busy',
     *         false otherwise.
     */
    function _moduleGotBusy(module, newState) {
      // if state changed from idle (or undefined for new modules) to
      // anything other than idle, that means the module got busy
      return (_cachedStateIsIdle(module) && (newState !== 'idle'));
    }

    /**
     * This method is invoked when a module updates its state in order to
     * check if it's not 'busy' anymore.
     *
     * @param module {String} name of the module.
     * @param newState {String} new state of the module.
     * @return {Boolean} true if the module goes from 'idle' to 'busy',
     *         false otherwise.
     */
    function _moduleTurnedIdle(module, newState) {
      // if state changed to idle, and it was NOT idle before,
      // the module "turned idle"
      return (!_cachedStateIsIdle(module) && newState === 'idle');
    }

    // here we check if the text tool must be suppressed or unsuppressed
    // based on the state change of some known suppressors. If a certain
    // suppressor goes from 'idle' to 'busy', then the semaphore will be
    // increased (represented by the variable _suppressDepth). On the
    // other hand, if the suppressor goes from 'busy' to 'idle' then it
    // will be decreased.
    //
    var module = eventData.module;
    var state = eventData.state;
    if (state && module) {

      switch(module) {
        // we only care about these three suppressors
      case 'dcpManager':
      case 'commandManager':
      case 'commandSequence':
        if (_moduleGotBusy(module, state)) {
          _increaseSuppressDepth();
        }
        if (_moduleTurnedIdle(module, state)) {
          _decreaseSuppressDepth();
        }
        break;
      default:
        break;
      }

      // set the new state
      _suppressors[module] = state;

      _setSuppressState();
    }
  }

  function _increaseSuppressDepth() {
    _suppressDepth++;
    _setSuppressState();
  }

  function _decreaseSuppressDepth() {
    _suppressDepth--;
    _setSuppressState();
  }

  function _setSuppressState() {
    if (_suppressDepth > 0) {
      _suppress();
    } else {
      _unsuppress();
    }
  }

  function _addBehaviours() {
    // extend our capabilities with common action handler behaviour
    CommonActionHandler.addBehaviour(_api);
  }

  return _api;
});
