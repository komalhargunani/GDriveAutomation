define([
  'qowtRoot/models/env',
  'qowtRoot/tools/text/mutations/cleaners/loneBR'
], function(EnvModel, loneBRCleaner) {

  'use strict';

  describe('loneBR cleaner', function() {
    var cleaner;
    var summary;
    var currentApp = EnvModel.app;
    beforeEach(function() {
      EnvModel.app = 'word';
      summary = {__additionalAdded: []};
      cleaner = loneBRCleaner.cleanerConfig.callback;
    });

    afterEach(function() {
      EnvModel.app = currentApp;
      summary = undefined;
      cleaner = undefined;
    });

    it('should wrap BR inside a para if it is a direct child of any element ' +
        'other than QowtPara and QowtRun', function() {
          var testNode = document.createElement('qowt-section');
          var loneBR = document.createElement('br');
          var templates = testNode.querySelectorAll('template');
          templates.forEach(function(template) {
            template.remove();
          });
          testNode.appendChild(loneBR);
          cleaner(summary, loneBR);
          var firstChild = testNode.firstElementChild;
          assert.isTrue(firstChild instanceof QowtWordPara,
              'paragraph inserted');
          assert.strictEqual(firstChild.firstElementChild.nodeName, 'BR',
              'br inserted inside newly added paragraph');
        });

    it('should not perform any changes when br is a child of QowtPara',
        function() {
          var testNode = new QowtWordPara();
          var br = document.createElement('br');
          testNode.appendChild(br);
          cleaner(summary, br);
          assert.strictEqual(testNode.childElementCount, 1,
              'test node continues to have only one child');
          assert.strictEqual(testNode.firstElementChild.nodeName, 'BR',
              'br is still the child of QowtPara');
        });

    it('should not perform any changes when br is a child of QowtRun',
        function() {
          var testNode = new QowtWordRun();
          var br = document.createElement('br');
          testNode.appendChild(br);
          cleaner(summary, br);
          assert.strictEqual(testNode.childElementCount, 1,
              'test node continues to have only one child');
          assert.strictEqual(testNode.firstElementChild.nodeName, 'BR',
              'br is still the child of QowtRun');
        });
  });
  return {};
});
