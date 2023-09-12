define([], function() {
  var api_ = {
    /**
     * @return {boolean} True if the document has empty paragraphs. False
     *                   otherwise
     * @private
     */
    isDocWithEmptyParas: function() {
      return !!(!api_.isDocWithoutPara() && areAllParasEmpty_());
    },


    /**
     * @return {boolean} - True if the document has no paras, false otherwise.
     * @private
     */
    isDocWithoutPara: function() {
      return (document.querySelectorAll('qowt-section > P').length === 0);
    }
  };


  // private function
  function areAllParasEmpty_() {
    return !!(_.every(document.querySelectorAll('qowt-section > P'),
        function(para) {
          // A para is empty if it has only br's or if has only runs without
          // any actual text in it.
          var runsInPara = para.querySelectorAll('span');
          return (para.isEmpty && para.isEmpty() || runsInPara.length > 0 &&
              runsInPara.length === para.children.length &&
              para.textContent === '');
        }));
  }

  return api_;
});
