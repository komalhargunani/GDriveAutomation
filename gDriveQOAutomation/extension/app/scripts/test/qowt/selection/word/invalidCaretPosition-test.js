define([
  'qowtRoot/selection/helpers/textHelper',
  'qowtRoot/unittests/__unittest-util'], function(
  TextHelper,
  UnitTestUtils) {

  'use strict';

  describe('Selection TextHelper.', function() {
    var testDiv, textHelper;

    beforeEach(function() {
      testDiv = UnitTestUtils.createTestAppendArea();
      textHelper = new TextHelper();
      textHelper.activate();
    });

    afterEach(function() {
      UnitTestUtils.removeTestAppendArea();
      textHelper.deactivate();
      textHelper = undefined;
    });

    describe("handle table as first element in section", function() {

      beforeEach(function() {
        // using innerHTML in test only!
        testDiv.contentEditable = true;
        testDiv.innerHTML =
            '<table><tr><td><p><span>inside table</span></p></td></tr></table>'+
            '<p><span>second paragraph</span></p>';
      });


      it("should move the caret inside the table", function() {
        // place caret infront of the table
        placeCaretAtStart_();
        var sel = window.getSelection();
        var range = sel.rangeCount > 0 && sel.getRangeAt(0);
        assert.isDefined(range, 'selection should be set');
        assert.equal(range.startContainer, testDiv, 'caret in testDiv');
        assert.equal(range.startOffset, 0, 'caret at start');

        // verify the caret gets moved _inside_ the table. Use a promise to
        // ensure we check on the next macro task (selectionchange event in
        // Chrome is async!)
        var promise = new Promise(function(resolve/*, reject*/) {
          // NOTE: this assumes that selectionchange will happen before the
          // next macro task that we are scheduling here with setTimeout. I'm
          // not 100% sure this is always true, and thus this MIGHT turn out
          // to sporadically fail. If that is the case, we should change this
          // to "poll check" for the caret to have been moved. The test will
          // timeout if that polling didn't work. This is NOT preferred as that
          // makes the failure case take much longer. So for now, we will go
          // with this assumption and monitor the tests.
          window.setTimeout(function() {
            var sel = window.getSelection();
            var range = sel.rangeCount > 0 && sel.getRangeAt(0);
            assert.isDefined(range, 'still has a selection');
            assert.equal(range.startContainer.nodeType, Node.TEXT_NODE,
                'caret is now at start of TEXT_NODE');
            assert.equal(range.startContainer.textContent, 'inside table',
                'caret is inside the table');
            resolve();
          });
        });
        return promise;
      });

    });


    function placeCaretAtStart_() {
      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(testDiv, 0);
      range.setEnd(testDiv, 0);
      sel.removeAllRanges();
      sel.addRange(range);
    }

  });

});
