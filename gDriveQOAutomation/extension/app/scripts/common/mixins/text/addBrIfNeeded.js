define(['qowtRoot/models/env'], function(EnvModel) {

  "use strict";

  return {

    /**
     * @return {boolean} true if this element requires a BR.
     */
    brRequired_: function() {
      return this.textContent.length === 0;
    },

    addBrIfNeeded_: function() {
      var plainBrSelector = ':scope > br:not([qowt-divtype])';
      var plainBrs = this.querySelectorAll(plainBrSelector);

      var requiredCount = this.brRequired_() ? 1 : 0;
      var existingCount = plainBrs.length;

      if (existingCount < requiredCount) {
        // add a <br> to keep us open
        var br = document.createElement('br');
        if (EnvModel.app === 'word' && !(this instanceof QowtWordRun)) {
          if(this.children.length === 1 &&
            this.firstElementChild.nodeName === 'SPAN' &&
            (this.firstElementChild.isEmpty &&
            this.firstElementChild.isEmpty()) &&
            this.firstElementChild
            .querySelectorAll(plainBrSelector).length === 0) {
              this.firstElementChild.appendChild(br);
          } else {
            this.appendChild(br);
          }
        } else {
          this.appendChild(br);
        }
        // During table cell deletion and handling the table structure.
        // The extra 'qowt-table-cell' class is added to br tag.
        br.removeAttribute('class');
      } else if (existingCount > requiredCount) {
        // Remove excess br's
        for (var i = existingCount-1; i >= requiredCount; i--) {
          var plainBr = plainBrs[i];
          if (EnvModel.app === 'word' && !(this instanceof QowtWordRun)) {
            plainBr.setAttribute('removedFromShady', true);
            plainBr.setAttribute('removedByCode', true);
            this.removeChild(plainBr);
          } else {
            this.removeChild(plainBr);
          }
        }
      }
    }
  };

});
