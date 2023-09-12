/**
 * @fileoverview content manager to deal with textual editing
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/domMutations/textTransactionStart',
  'qowtRoot/commands/domMutations/textTransactionEnd',
  'qowtRoot/commands/domMutations/insertText',
  'qowtRoot/commands/domMutations/deleteText',
  'qowtRoot/commands/domMutations/newParagraph',
  'qowtRoot/commands/domMutations/newCharRun',
  'qowtRoot/commands/domMutations/deleteNode',
  'qowtRoot/commands/domMutations/moveNode',
  'qowtRoot/commands/domMutations/formatElement',
  'qowtRoot/commands/domMutations/insertBBD',
  'qowtRoot/commands/domMutations/insertDrawing',
  'qowtRoot/commands/domMutations/insertImage',
  'qowtRoot/commands/domMutations/newHyperlink'
], function(
    CommandManager,
    PubSub,
    TextTransactionStart,
    TextTransactionEnd,
    InsertTextCmd,
    DeleteTextCmd,
    NewParagraphCmd,
    NewCharRunCmd,
    DeleteNodeCmd,
    MoveNodeCmd,
    FormatElementCmd,
    InsertBBDCmd,
    InsertDrawingCmd,
    InsertImageCmd,
    NewHyperlinkCmd) {

  'use strict';
  var _actionToken, _disableToken;
  var _api = {
    /**
     * Initialize the module.
     */
    init: function() {
      if (_actionToken) {
        throw new Error('Mutation Manager initialized multiple times.');
      }
      _actionToken = PubSub.subscribe('qowt:doAction', _handleAction);
      _disableToken = PubSub.subscribe('qowt:disable', _api.disable);
    },

    /**
     * Disable the manager by un-subscribing to qowt events and disables the
     * subscription tokens.
     */
    disable: function() {
      if (_actionToken) {
        PubSub.unsubscribe(_actionToken);
      }
      if (_disableToken) {
        PubSub.unsubscribe(_disableToken);
      }
      _disableToken = undefined;
      _actionToken = undefined;
      _rootCmd = undefined;
    }
  };

  var _contentType = 'mutation';

  /**
   * Related mutation commands are collected within a single transaction
   * represented as children of this root command. When all participating
   * commands are created the rootCmd is passed to the command manager for
   * processing.
   */
  var _rootCmd, _doNotResetTxn = false;

  // TODO(dskelton) The AddXxx commands below can all be changed to the single
  // AddQowtElement command now.
  function _handleAction(event, eventData) {
    event = event || {};
    if (eventData.context &&
        eventData.context.contentType &&
        eventData.context.contentType === _contentType) {
      switch (eventData.action) {
        case 'startTransaction':
          // reset the rootCmd to start collecting a new transaction set. If
          // however some transaction has explicitly asked not to reset the
          // following transaction then do not!
          if (!_doNotResetTxn) {
            _rootCmd = TextTransactionStart.create();
          }
          // Do not reset the following transactions.
          // The transaction's indicating to override the resetting of following
          // transactions should remember to unset this indication in its endTxn
          // command (i.e. when it knows it's done).
          if (eventData.context.doNotResetTxn) {
            _doNotResetTxn = true;
          }
          break;
        case 'insertText':
          _rootCmd.addChild(_handleInsertTextAction(eventData.context));
          break;
        case 'deleteText':
          _rootCmd.addChild(_handleDeleteTextAction(eventData.context));
          break;
        case 'addParagraph':
          _rootCmd.addChild(_handleAddElementAction(eventData.context,
              'paragraph'));
          break;
        case 'addListItem':
          _rootCmd.addChild(_handleAddElementAction(eventData.context,
              'listItem'));
          break;
        case 'addCharacterRun':
          _rootCmd.addChild(_handleAddCharRunAction(eventData.context));
          break;
        case 'deleteNode':
          _rootCmd.addChild(_handleDeleteNodeAction(eventData.context));
          break;
        case 'moveNode':
          _rootCmd.addChild(_handleMoveNodeAction(eventData.context));
          break;
        case 'formatElement':
          _rootCmd.addChild(_handleFormatElementAction(eventData.context));
          break;
        case 'addHyperlink':
          _rootCmd.addChild(_handleAddHyperlinkAction(eventData.context));
          break;
        case 'insertDrawing':
          _rootCmd.addChild(_handleInsertDrawingAction(eventData.context));
          break;
        case 'insertImage':
          _rootCmd.addChild(_handleInsertImageAction(eventData.context));
          break;
        case 'insertBBD':
          _rootCmd.addChild(_handleInsertBBDAction(eventData.context));
          break;
        case 'endTransaction':
          if (eventData.context.doNotResetTxn) {
            _doNotResetTxn = false;
          }
          if (!_doNotResetTxn) {
            // We only want to create a transaction if we have real editing
            // commands to send. eg, zooming generates a mutation that builds an
            // empty command. Transactions impact what is on the undo stack.
            if (_rootCmd.childCount() > 0) {
              // Text transaction start and end are themselves invertible, and
              // thus would generate an undo frame, even if the transaction
              // contained commands that were not themselves invertble.
              // Guarding against this here to be safe.
              var commandCanInvert =
                  _rootCmd.getChildren().some(function(child) {
                    return child.canInvert;
                  });

              var txEnd = TextTransactionEnd.create();
              if (!commandCanInvert) {
                _rootCmd.canInvert = false;
                txEnd.canInvert = false;
              }

              // transaction done, add the compound command to the command
              // manager
              _rootCmd.addChild(txEnd);
              CommandManager.addCommand(_rootCmd);
            }
            _rootCmd = undefined;
          }
          break;
        default:
          break;
      }
    }
  }


  function _handleInsertTextAction(actionContext) {
    var cmd = InsertTextCmd.create(actionContext);
    return cmd;
  }

  function _handleDeleteTextAction(actionContext) {
    var cmd = DeleteTextCmd.create(actionContext);
    return cmd;
  }

  function _handleAddElementAction(actionContext, elementType) {
    actionContext.type = elementType;
    var cmd = NewParagraphCmd.create(actionContext);
    return cmd;
  }

  function _handleAddCharRunAction(actionContext) {
    var cmd = NewCharRunCmd.create(actionContext);
    return cmd;
  }

  function _handleDeleteNodeAction(actionContext) {
    var cmd = DeleteNodeCmd.create(actionContext);
    return cmd;
  }

  function _handleMoveNodeAction(actionContext) {
    var cmd = MoveNodeCmd.create(actionContext);
    return cmd;
  }

  function _handleFormatElementAction(actionContext) {
    var cmd = FormatElementCmd.create(actionContext);
    return cmd;
  }

  function _handleAddHyperlinkAction(actionContext) {
    var cmd = NewHyperlinkCmd.create(actionContext);
    return cmd;
  }

  function _handleInsertImageAction(actionContext) {
    var cmd = InsertImageCmd.create(actionContext);
    return cmd;
  }

  function _handleInsertDrawingAction(actionContext) {
    var cmd = InsertDrawingCmd.create(actionContext);
    return cmd;
  }

  function _handleInsertBBDAction(actionContext) {
    var cmd = InsertBBDCmd.create(actionContext);
    return cmd;
  }

  return _api;
});
