define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',

  'qowtRoot/selection/selectionManager',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/idGenerator',

  'qowtRoot/third_party/mutationSummary/mutation_summary',
  'third_party/lo-dash/lo-dash.min'], function(
    MixinUtils,
    QowtElement,
    SelectionManager,
    DomUtils,
    IdGenerator) {

  'use strict';

  var api_ = {
    /** Lifecycle callback. Called when a new instance is created */
    created: function() {
      QowtElement.created.call(this);
    },

    ready: function() {
      // We create a setter for our model.data to retrieve our textContent. This
      // means we do not need to store the physical data in our model (and thus
      // save memory)
      Object.defineProperty(this.model, 'data', {
        get: function() {
          var iter = (this.supports && this.supports('flow')) ?
              this.flowStart() : this;
          var data = '';
          while (iter) {
            data += iter.textContent;
            iter = iter.flowInto;
          }
          return data;
        }.bind(this),
        set: function(newValue) {
          this.textContent = newValue;
        }.bind(this),
        enumerable: true,
        configurable: true
      });
    },

    /**
     * Override the default setModel
     * NOTE: to save memory, we do not store the text straight in the runs model
     * Instead we have a getter, which will obtain the textContent in real time
     * So we must also  make sure we don't set that data on calls to setModel
     */
    setModel: function(model) {
      QowtElement.setModel.call(this, _.omit(model, 'data'));
    },


    /**
     * Override the default isEmpty implementation so that we can be smart
     * enough to still say we are empty even if we have a single <br> tag as a
     * child (which contentEditable can add)
     * @return {boolean} return true if we are empty
     */
    isEmpty: function() {
      // Select all children which are NOT <br> AND <br>s that have qowt-divtype
      var children =
          this.querySelectorAll(':scope > :not(br), ' +
              ':scope > span[is=qowt-line-break]');
      return children.length === 0 && this.textContent.length === 0;
    },


    /**
     * Break this run in to two (creates a new run with E-xx id at the given
     * offset
     * @param {number} offset the character offset at which to break the run
     * @return {QowtRun} return the new element that was created
     */
    breakRun: function(offset) {
      var newRun;
      if (this.supports && this.supports('flow') && this.isFlowing()) {
        throw new Error('Attempted to break flowing char run');
      }
      // Only break the run if the offset is INSIDE of us and if we actually
      // have any text
      if (this.firstChild && this.firstChild.textContent.length > 0 &&
          offset > 0 && offset < this.firstChild.textContent.length) {
        var snapshot = SelectionManager.snapshot();
        newRun = this.cloneMe();
        var newEid = IdGenerator.getUniqueId('E-');
        newRun.setEid(newEid);
        Polymer.dom(newRun).appendChild(this.firstChild.splitText(offset));
        Polymer.dom(newRun).flush();
        DomUtils.insertAfter(newRun, this);
        // Transform the snapshot if needed NOTE: we keep both start and end in
        // the newRun if it was on the edge (notice the >= for startOffset and
        // > for endOffset!)
        var thisEid = this.getEid();
        var thisLength = this.textContent.length;
        if (snapshot) {
          if (snapshot.startContainer === thisEid &&
              snapshot.startOffset >= thisLength) {
            snapshot.startContainer = newEid;
            snapshot.startOffset = snapshot.startOffset - thisLength;
          }
          if (snapshot.endContainer === thisEid &&
              snapshot.endOffset > thisLength) {
            snapshot.endContainer = newEid;
            snapshot.endOffset = snapshot.endOffset - thisLength;
          }
          SelectionManager.restoreSnapshot(snapshot);
        }
      }
      return newRun;
    },

    /**
     * Insert text at the given offset
     * @param {number} offset the offset at which to insert text
     * @param {String} text the text to insert
     */
    insertText: function(/*offset, text*/) {
      throw new Error('run insertText() is not overridden');
    },


    /**
     * Remove text content from this widget. Can leave empty spans
     * @param {integer} offset The offset at which to remove content
     * @param {integer} length The number of characters to remove
     */
    removeText: function(/*offset, length*/) {
      throw new Error('run removeText() is not overridden');
    }


  };


  /* jshint newcap: false */
  return MixinUtils.mergeMixin(
      QowtElement,
      api_);
  /* jshint newcap: true */
});
