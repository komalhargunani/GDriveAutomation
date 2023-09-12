define([], function() {

  'use strict';

  var _api = {

    /**
     * Function to verify whether the event target is within the main toolbar
     * or not.
     * @param {object} target element.
     */
    isTargetWithinMainToolbar: function(target) {
      while (target && target.tagName !== 'QOWT-MAIN-TOOLBAR') {
        if (target.id === 'view-layout' || target.tagName === 'BODY') {
          return false;
        }
        target = target.parentElement;
      }
      return target ? true : false;
    },
    undoRedoUsingTBButton: function(target) {
      return target && 
      this.isTargetWithinMainToolbar(target) &&
      ((target.focusedItem && (target.focusedItem.id === 'cmd-undo' ||
      target.focusedItem.id === 'cmd-redo')) ||
      (target.id === 'cmd-undo' ||
      target.id === 'cmd-redo'));
    },
    zoomInOutUsingTBButton: function(target) {
      return target && this.isTargetWithinMainToolbar(target) &&
      ((target.focusedItem &&
       (target.focusedItem.id === 'cmd-zoomIn' || 
        target.focusedItem.id === 'cmd-zoomOut')) ||
        (target.id === 'cmd-zoomIn' || 
        target.id === 'cmd-zoomOut'));
    },
    shareUsingKB: function() {
      var target = document.activeElement;
      return this.isTargetWithinMainToolbar(target) &&
        target.tagName.toLowerCase() === 'qowt-sharebutton';
    },

    isTargetWithinMenuBar: function(target) {
      while (target && target.tagName !== 'QOWT-MENU-BAR') {
        if (target.id === 'view-layout' || target.tagName === 'BODY') {
          return false;
        }
        target = target.parentElement;
      }
      return target ? true : false;
    },

    getMenubar: function(target) {
      while (target && target.tagName !== 'QOWT-MENU-BAR') {
        target = target.parentElement;
      }
      return target;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
