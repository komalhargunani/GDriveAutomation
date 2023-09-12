define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/mutations/cleaners/newElements',
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/models/env'
  ], function(PubSub, NewElementsTranslator, PromiseUtils, EnvModel) {

  'use strict';

  describe("newElements text tool cleaner", function() {
    var originalEnvModelApp;
    var cleaningFunc = NewElementsTranslator.cleanerConfig.callback;
    var mockSummary = {
      getOldParentNode: function() { return null; },
      getOldPreviousSibling: function() { return null; },
      __requiresIntegrityCheck: [],
      __additionalAdded: []
    };

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
      originalEnvModelApp = EnvModel.app;
      EnvModel.app = 'word';
    });

    afterEach(function() {
      PubSub.publish.restore();
      EnvModel.app = originalEnvModelApp;
    });


    it("should convert a plain p to QowtWordPara when in word", function() {
      var dummy = document.createElement('p');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtWordPara, 'testing QowtWordPara');
    });

    it("should convert a plain p to QowtPointPara when in point", function() {
      EnvModel.app = 'point';
      var dummy = document.createElement('p');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtPointPara, 'testing QowtPointPara');
    });

    it("should convert a plain <span> to a QowtWordRun when Environment" +
        " is word", function() {
         var originalApp = EnvModel.app;
         EnvModel.app = 'word';
         var dummy = document.createElement('span');
         var newEl = cleaningFunc(mockSummary, dummy);
         assert.isValidQowtElement(newEl, QowtWordRun, 'testing QowtWordRun');
         EnvModel.app = originalApp;

       });

    it("should convert a plain <span> to a QowtPointRun when Environment" +
        " is point", function() {
         var originalApp = EnvModel.app;
         EnvModel.app = 'point';
         var dummy = document.createElement('span');
         var newEl = cleaningFunc(mockSummary, dummy);
         assert.isValidQowtElement(newEl, QowtPointRun, 'testing QowtPointRun');
         EnvModel.app = originalApp;
       });


    it("should convert a plain <table> to a QowtTable", function() {
      var dummy = document.createElement('table');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtTable, 'testing QowtTable');
    });


    it("should convert a plain <tr> to a QowtTableRow", function() {
      var dummy = document.createElement('tr');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtTableRow, 'testing QowtTableRow');
    });


    it("should convert a plain <td> to a QowtTableCell", function() {
      var dummy = document.createElement('td');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtTableCell, 'testing QowtTableCell');
    });


    it("should convert a plain <a> to a QowtHyperlink", function() {
      var dummy = document.createElement('a');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isValidQowtElement(newEl, QowtHyperlink, 'testing QowtHyperlink');
    });

    it("should NOT convert a plain <br> (yet)", function() {
      var dummy = document.createElement('br');
      var newEl = cleaningFunc(mockSummary, dummy);
      assert.isNotValidQowtElement(newEl, 'testing <br> elements');
    });


    it("should move all child elements to the new element", function() {
      var dummy = document.createElement('p');
      var child = document.createElement('span');
      child.textContent = 'hello';
      dummy.appendChild(child);
      var newEl = cleaningFunc(mockSummary, dummy);

      // need to return a promise because our new QowtWordPara element will have
      // received a <br> element on construction, but it will remove that in
      // the next microtask. Thus we need to wait a macro turn before running
      // our verification
      return PromiseUtils.waitForNextMacroTurn()
          .then(function() {
            assert.isValidQowtElement(
                newEl, QowtWordPara, 'testing QowtWordPara');
            assert.equal(newEl.childElementCount, 1, 'has one child');
            assert.equal(newEl.innerText.trim(), 'hello', 'correct text');
          });

    });


    describe("handle selection", function() {

      var testDiv, dummy;
      beforeEach(function() {
        testDiv = document.createElement('div');
        document.body.appendChild(testDiv);

        dummy = document.createElement('p');
        dummy.setAttribute('is', 'qowt-word-para');
        var child = document.createElement('span');
        child.textContent = 'hello';
        Polymer.dom(dummy).appendChild(child);
        Polymer.dom(testDiv).appendChild(dummy);
        Polymer.dom(testDiv).flush();

        // set selection
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.setStart(child.firstChild, 2);
        sel.addRange(range);

        // assert selection got set correctly
        assertCaret_('hello', 2, 'selection set prior to cleaning');
      });

      afterEach(function() {
        testDiv.parentNode.removeChild(testDiv);
      });

      it("should keep selection in the same place", function() {

        // clean dummy element
        var newEl = cleaningFunc(mockSummary, dummy);

        // need to return a promise because our new QowtWordPara element will
        // have received a <br> element on construction, but it will remove that
        // in the next micro-task. Thus we need to wait a macro turn before
        // running our verification
        return PromiseUtils.waitForNextMacroTurn()
            .then(function() {
              assert.isValidQowtElement(
                  newEl, QowtWordPara, 'testing QowtWordPara');
              assert.equal(newEl.childElementCount, 1, 'has one child');
              assert.equal(newEl.innerText, 'hello', 'correct text');
              assertCaret_('hello', 2, 'selection still set post cleaning');
            });
      });

    });

  });

  // -------------------- helper functions --------------------
  function assertCaret_(containerText, offset, msg) {
    var sel = window.getSelection();
    assert.equal(sel.rangeCount, 1, msg);
    var range = sel.getRangeAt(0);
    assert.equal(range.startContainer.textContent, containerText, msg +
        '; correct container');
    assert.equal(range.startOffset, offset, msg + '; correct offset');
  }

});

