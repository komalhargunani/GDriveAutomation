define([
  'qowtRoot/pubsub/pubsub',
  'common/elements/document/msdoc/msdoc'
  ], function(PubSub) {

  'use strict';

  describe('<qowt-msdoc>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('msdoc-test-template');
      element = this.getTestDiv().querySelector('qowt-msdoc');
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
      element = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should have the right API', function() {
      var expectedAPI = [
          'attached', 'detached', 'autoPaginate', 'listenForMutations',
          'ignoreMutations', 'zoomIn', 'zoomOut', 'zoomToWidth', 'zoomFullPage',
          'zoomActualSize', 'scaleChanged', 'paginate'];
      assertFunctions_(element, expectedAPI);
    });

    it('should react to scale changes for zooming', function() {
      sinon.spy(element, 'scaleChanged');
      // Verify that all zoom functions set the .scale variable and that the
      // scaleChanged will run. We are assuming a black box here for
      // scaleChanged. Also note that some of the zoom functions will default to
      // setting the scale to 1. Therefore we first set it to !== 1 to start the
      // test, and verify the zoom function did indeed change it
      function doTest(funcName) {
        // Set scale to !== 1 and reset our spy
        element.scale = 2;
        element.scaleChanged.reset();
        // Now run the actual test
        element[funcName].call(element);
        assert.equal(element.scaleChanged.callCount, 1, funcName + ' worked');
        element.scaleChanged.reset();
      }
      var zoomFunctions = [
          'zoomIn', 'zoomOut', 'zoomToWidth', 'zoomFullPage', 'zoomActualSize'];
      zoomFunctions.forEach(doTest);
      element.scaleChanged.restore();
    });

    it('should paginate when a page changes', function() {
      sinon.spy(element, 'paginate');
      element.fire('page-changed', {page: 'dummy'});
      assert.equal(element.paginate.callCount, 1, 'paginate on page-change');
      element.paginate.restore();
    });

    it('should ignore page changes when told to do so', function() {
      sinon.spy(element, 'paginate');
      element.ignoreMutations();
      element.fire('page-changed', {page: 'dummy'});
      assert.equal(element.paginate.callCount, 0, 'page-change ignored');
      element.listenForMutations();
      element.fire('page-changed', {page: 'dummy'});
      assert.equal(element.paginate.callCount, 1, 'paginate on page-change');
      element.paginate.restore();
    });

    it('should lose editability if it lost focus', function() {
      var newElement = document.createElement('div');
      var context = {
        oldSelection: {
          scope: element
        },
        newSelection:  {
          scope: newElement
        }
      };
      PubSub.publish('qowt:selectionChanged', context);
      assert.strictEqual(element.contentEditable, 'false');
    });

    it('should remain uneditable through multiple selection changes',
        function() {
      var newElement = document.createElement('div');
      var context = {
        oldSelection: {
          scope: element
        },
        newSelection:  {
          scope: newElement
        }
      };
      PubSub.publish('qowt:selectionChanged', context);

      var anotherElement = document.createElement('div');
      context = {
        oldSelection: {
          scope: newElement
        },
        newSelection:  {
          scope: anotherElement
        }
      };
      PubSub.publish('qowt:selectionChanged', context);
      assert.strictEqual(element.contentEditable, 'false');
    });

    it('should gain editability if it gets focus back', function() {
      var newElement = document.createElement('div');
      var context = {
        oldSelection: {
          scope: element
        },
        newSelection:  {
          scope: newElement
        }
      };
      PubSub.publish('qowt:selectionChanged', context);

      var oldElement = document.createElement('div');
      context = {
        oldSelection: {
          scope: oldElement
        },
        newSelection:  {
          scope: element
        }
      };
      PubSub.publish('qowt:selectionChanged', context);
      assert.strictEqual(element.contentEditable, 'true');
    });

    function assertFunctions_(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], element.nodeName + '.' + funcName);
      });
    }

  });

  return {};
});
