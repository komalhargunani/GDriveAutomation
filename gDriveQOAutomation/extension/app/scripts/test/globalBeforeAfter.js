define([
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/features/utils'], function(
    PromiseUtils,
    PubSub,
    Features) {
  'use strict';

  var cache_ = {};

  /**
   * Global before and after checks for app mocha unit tests. They ensure we
   * never leak any pubsub subscribers, or leave nodes in the DOM
   */
  beforeEach(function() {
    // Make sure all singletons reset their state before running tests this
    // ensures we don't have test B failing just because it ran after test A
    // which may or may not have cleaned up after itself correctly, we do this
    // in the beforeEach and the afterEach to make sure we are robust
    PubSub.publish('qowt:disable');
    PubSub.publish('qowt:destroy');

    // Disable features that interrupt tests.
    Features.isEnabled('suppressFirstTimeDialog');

    chai.config.includeStack = true;
    cache_.nodeCount = nodeCount_();
    cache_.subscriberCount = PubSub.subscriberCount;
    this.currentTest.expectedToFail = {
      subscriberLeak: false,
      nodeLeak: false
    };

    this.getTestDiv = function() {
      var testDiv = document.getElementById('testDiv');
      if (!testDiv) {
        testDiv = document.createElement('div');
        testDiv.id = 'testDiv';
        document.body.appendChild(testDiv);
      }
      return testDiv;
    };
    this.removeTestDiv = function() {
      var testDiv = document.getElementById('testDiv');
      if (testDiv) {
        testDiv.parentNode.removeChild(testDiv);
      }
      // Return a Promise.resolve which is guaranteed to run in a new micro task
      // which allows clients to wait for element.detached functions to be done
      return Promise.resolve();
    };
    this.stampOutTempl = function(templId) {
      var templ, i, content, testDiv,
          importLinks = document.querySelectorAll('link[rel="import"]');
      for (i = 0; i < importLinks.length; i++) {
        content = importLinks[i].import;
        if (content) {
          templ = content.getElementById(templId);
          if (templ) {
            break;
          }
        }
      }
      assert.isDefined(templ, 'template id ' + templId + ' not found');
      this.removeTestDiv();
      testDiv = this.getTestDiv();
      content = document.importNode(templ.content, true);
      Polymer.dom(testDiv).appendChild(content);
      Polymer.dom(testDiv).flush();
    };
  });

  afterEach(function() {
    var testSpec = this;
    return this.removeTestDiv()
        .then(function() {
          PromiseUtils.waitForNextMacroTurn().then(function() {
          var test, name, expectedToFail;
          PubSub.publish('qowt:disable');
          PubSub.publish('qowt:destroy');
          test = testSpec.currentTest;
          expectedToFail = test.expectedToFail;
          name = test.parent.title + '\n' + test.title + '\n';

          // test for node leakage
          (expectedToFail.nodeLeak ?
              assert.notStrictEqual(
                  nodeCount_(),
                  cache_.nodeCount,
                  name + ' Did not leak nodes') :
              assert.strictEqual(
                  nodeCount_(),
                  cache_.nodeCount,
                  name + ' Leaked nodes')
          );

          // test for leaked subscriptions
          (expectedToFail.subscriberLeak ?
              assert.notStrictEqual(
                  PubSub.subscriberCount,
                  cache_.subscriberCount,
                  name + ' Did not leak subscribers') :
              assert.strictEqual(
                  PubSub.subscriberCount,
                  cache_.subscriberCount,
                  name + ' Leaked subscribers')
          );
          });
        });
  });

  function nodeCount_() {
    return document.querySelectorAll('*').length;
  }

});
