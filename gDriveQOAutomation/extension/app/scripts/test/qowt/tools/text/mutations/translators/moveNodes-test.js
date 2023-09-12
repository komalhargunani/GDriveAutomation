define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/text/mutations/translators/moveNodes'
  ], function(PubSub, MoveNodesTranslator) {

  'use strict';

  describe("Move Nodes text tool translator", function() {

    var translatorFunc = MoveNodesTranslator.translatorConfig.callback;
    var mockSummary = {
      getOldParentNode: function() { return null; },
      getOldPreviousSibling: function() { return null; },
      __requiresIntegrityCheck: []
    };

    beforeEach(function() {
      sinon.stub(PubSub, 'publish');
    });

    afterEach(function() {
      PubSub.publish.restore();
    });


    it("should publish a doAction for supported moved nodes", function() {
      var para = document.createElement('p');
      para.setAttribute('qowt-eid', 'E1');
      var run = document.createElement('span');
      run.setAttribute('qowt-eid', 'E2');
      para.appendChild(run);
      translatorFunc(mockSummary, run);

      sinon.assert.calledWith(PubSub.publish, 'qowt:doAction');
    });


    it("should ignore unsupported nodes, like <br>", function() {
      var br = document.createElement('br');
      translatorFunc(mockSummary, br);

      sinon.assert.notCalled(PubSub.publish);
    });

  });
});

