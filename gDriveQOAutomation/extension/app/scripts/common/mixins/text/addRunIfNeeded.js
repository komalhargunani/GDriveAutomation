define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/idGenerator'
], function(
    PubSub,
    DomTextSelection,
    IdGenerator) {

  "use strict";

  return {

    /**
     * Checks if the paragraph empty and does not have even the temporary run.
     * @returns {boolean}
     */
    isRunRequired: function() {
      // select all children which are NOT <br>, NOT <qowt-drawing> AND <br>s
      // that have qowt-divtype
      var selector = ':scope > :not(br):not(qowt-drawing),' +
          ' :scope > br[qowt-divtype]';
      var children = this.querySelectorAll(selector);
      return children.length === 0;
    },

    /**
     * This adds a Qowt Word Run in a paragraph. This is needed in case an empty
     * paragraph has character formatting.
     * @private
     */
    addRunIfNeeded: function() {
      // Paragraph has the character data in its model as characterFormatting
      if (this.isRunRequired() &&
          this.model && this.model.characterFormatting) {
        //Suppress the text tool to avoid mutations for the temporary run.
        PubSub.publish('qowt:suppressTextTool', {});
        var qowtRun = new QowtWordRun();
        qowtRun.appendChild(document.createElement('br'));
        var newEid = IdGenerator.getUniqueId('T');
        qowtRun.setAttribute('qowt-teid', newEid);
        this.appendChild(qowtRun);
        this.formatParaWithRunProp();
        var sel = window.getSelection();
        var range = (sel.rangeCount > 0) ? sel.getRangeAt(0) : undefined;
        if (range &&
            range.startContainer === this && range.endContainer === this) {
          DomTextSelection.setCaretAtEnd(qowtRun);
        }
        PubSub.publish('qowt:unsuppressTextTool', {});
      }
    },

    /**
     * If there exists only a temporary run in paragraph, this removes it.
     */
    removeRunIfNeeded: function() {
      if (this.hasTemporaryRun()) {
        //Suppress the text tool to avoid mutations for the temporary run.
        PubSub.publish('qowt:suppressTextTool', {});
        var spans = this.querySelectorAll(':scope > span');
        this.removeChild(spans[0]);
        PubSub.publish('qowt:unsuppressTextTool', {});
      }
    },

    /**
     * Checks if there is a temporary run without any eid in the para.
     */
    hasTemporaryRun: function() {
      var spans = this.querySelectorAll(':scope > span');
      return !!(spans && spans.length === 1 &&
        spans[0] instanceof QowtWordRun && !spans[0].getEid() &&
        spans[0].textContent.length === 0);
    }
  };
});