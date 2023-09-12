define([], function() {

'use strict';

  /**
   * @fileoverview Config names take the form menu-name|item-name[|common]
   * Many configs are common and reused directly between editors
   * Sheet-specific and Point-specific items are grouped toward the end of this
   * file. All items are grouped by their containing menu.
   *
   * If you need to add a new menu item and its only ever used in one editor
   * then place it in the correct editor-specific group.
   * If you need to add a new menu item that is used in more than one editor
   * withou specialisation then be sure add 'Common' to the end of the name.
   * 'xxxCommon' configs are intended to be used in all 3 editors.
   */

  /** @return Object declaring all menu item contexts for all apps. */
  return {
    "officeCompatibilityModeCommon": {
      "action": "officeCompatibilityMode",
      "context": {
        "contentType": "common"
      }
    },
    "fileSaveAsDocs": {
      "action": "convertToDocs",
      "context": {
        "contentType": "common"
      }
    },
    "filePrintCommon": {
      "action": "print"
    },
    "fileDownloadCommon": {
      "action": "download"
    },
    "editUndoCommon": {
      "action": "undo",
      "context": {
        "contentType": "common"
      }
    },
    "editRedoCommon": {
      "action": "redo",
      "context": {
        "contentType": "common"
      }
    },
    "editCutCommon": {
      "action": "cut"
    },
    "editCopyCommon": {
      "action": "copy"
    },
    "editPasteCommon": {
      "action": "paste"
    },
    "formatBoldCommon": {
      "action": "bold",
      "context": {
        "formatting": {
          "bld": true
        }
      }
    },
    "formatItalicCommon": {
      "action": "italic",
      "context": {
        "formatting": {
          "itl": true
        }
      }
    },
    "formatUnderlineCommon": {
      "action": "underline",
      "context": {
        "formatting": {
          "udl": true
        }
      }
    },
    "formatStrikethroughCommon": {
      "action": "strikethrough",
      "context": {
        "formatting": {
          "str": true
        }
      }
    },
    "formatAlignLeftCommon": {
      "action": "textAlignLeft",
      "context": {
        "formatting": {
          "jus": "L"
        }
      }
    },
    "formatAlignRightCommon": {
      "action": "textAlignRight",
      "context": {
        "formatting": {
          "jus": "R"
        }
      }
    },
    "formatAlignCenterCommon": {
      "action": "textAlignCenter",
      "context": {
        "formatting": {
          "jus": "C"
        }
      }
    },
    "formatAlignJustifiedCommon": {
      "action": "textAlignJustify",
      "context": {
        "formatting": {
          "jus": "J"
        }
      }
    },
    "helpHelpCenterCommon": {
      "action": "helpCenter",
      "context": {
        "contentType": "common",
      }
    },
    "helpKeyboardShortcutsCommon": {
      "action": "keyboardShortcutsDialog",
      "context": {
        "contentType": "common",
      }
    },
    "helpReportIssueCommon": {
      "action": "reportIssue",
      "context": {
        "contentType": "common"
      }
    },
    "helpVersionInfoCommon": {
      "action": "versionInfoDialog",
      "context": {
        "contentType": "common"
      }
    },
    "insertImage": {
      "action": "imagePickerDialog",
      "context": {
        "contentType": "common"
      }
    },
    /***************************************************************************
     * POINT SPECIFIC configs                                                  *
     **************************************************************************/
    "fileSaveAsSlides": {
      "action": "convertToDocs",
      "context": {
        "contentType": "common"
      }
    },
    "insertTextbox": {
      "action": "initAddShape",
      "context": {
        "contentType": "slide",
        "set": true,
        "prstId": 88,
        "isTxtBox": true
      }
    },
    "slideInsert": {
      "action": "insertSlide",
      "context": {
        "contentType": "slideManagement"
      }
    },
    "slideDelete": {
      "action": "deleteSlide",
      "context": {
        "contentType": "slideManagement"
      }
    },
    "slideDuplicate": {
      "action": "duplicateSlide",
    },
    "slideHide": {
      "action": "hideSld",
      "context": {
        "contentType": "slideManagement",
        "command": {
          "showSlide": false
        }
      }
    },
    "slideUnhide": {
      "action": "showSld",
      "context": {
        "contentType": "slideManagement",
        "command": {
          "showSlide": true
        }
      }
    },
    "slideMoveUp": {
      "action": "moveSlide",
      "context": {
        "contentType": "slideManagement",
        "position": "up"
      }
    },
    "slideMoveDown": {
      "action": "moveSlide",
      "context": {
        "contentType": "slideManagement",
        "position": "down"
      }
    },
    "slideMoveTop": {
      "action": "moveSlide",
      "context": {
        "contentType": "slideManagement",
        "position": "start"
      }
    },
    "slideMoveBottom": {
      "action": "moveSlide",
      "context": {
        "contentType": "slideManagement",
        "position": "end"
      }
    },
    "formatStrikethroughForPoint": {
      "action": "strikethrough",
      "context": {
        "formatting": {
          "strike": "sngStrike"
        }
      }
    },
    /***************************************************************************
     * SHEET SPECIFIC configs                                                  *
     **************************************************************************/
    "fileSaveAsSheets": {
      "action": "convertToDocs",
      "context": {
        "contentType": "common"
      }
    },
    "editDeleteRow": {
      "action": "deleteRow"
    },
    "editDeleteColumn": {
      "action": "deleteColumn"
    },
    "insertRow": {
      "action": "insertRow"
    },
    "insertColumn": {
      "action": "insertColumn"
    },
    "formatNumberFormat": {
      "action": "toggleNumberFormatDialog",
      "context": {
        "contentType": "workbook"
      }
    },
    "sheetFormatWrapText": {
      "action": "wrapText",
      "context": {
        "formatting": {
          "wrapText": true
        }
      }
    },
    /**
     * TODO: make this as a common configID once the three letter command for
     *       strikethrough is changed from "str" to "strikethrough" in Word
     *       and Point.
     */
    "formatStrikethroughForSheets": {
      "action": "strikethrough",
      "context": {
        "formatting": {
          "strikethrough": true
        }
      }
    },
    "formatMergeAll": {
      "action": "mergeAll"
    },
    "formatMergeVertical": {
      "action": "mergeVertically"
    },
    "formatMergeHorizontal": {
      "action": "mergeHorizontally"
    },
    "formatUnmerge": {
      "action": "unmerge"
    },
    "wordCount": {
      "action": "wordCount",
      "context": {
        "contentType": "document"
      }
    }
  };
});
