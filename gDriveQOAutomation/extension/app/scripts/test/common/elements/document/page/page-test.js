define(['common/elements/document/page/page'], function() {
  'use strict';

  describe('<qowt-page>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('page-test-template');
      element = document.querySelector('qowt-page');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should be an instance of QowtPage', function() {
      assert(element instanceof QowtPage, 'element is a QowtPage');
    });

    it('should support flowing', function() {
      assert.isTrue(element.supports('flow'), 'should support flowing');
      assertFunctions_(element, ['flow', 'unflow', 'isFlowing']);
    });

    it('should have the basic API defined', function() {
      var pageAPI = [
          'ready', 'attached', 'detached', 'ignoreMutations',
          'listenForMutations', 'isOverflowing', 'boundingBox', 'onFlowStart',
          'onFlowEnd', 'onUnflowStart', 'onUnflowEnd', 'getHeader', 'getFooter',
          'contentCount', 'getContentNode', 'firstContentNode',
          'lastContentNode', 'getContentWidget'];
      assertFunctions_(element, pageAPI);
    });

    it('should listen for internal mutations', function() {
      sinon.spy(element, 'handleMutations_');
      element.appendChild(document.createElement('div'));
      element.takeMutations();
      assert.equal(element.handleMutations_.callCount, 1, 'react to changes');
      element.handleMutations_.restore();
    });

    it('should set the page size when the section changes it', function() {
      assert.equal(element.style.width, '', 'has no width by default');
      assert.equal(element.style.height, '', 'has no height by default');
      // Fake some page size
      var section = document.createElement('qowt-section');
      section.pageSize = {
          width: 10,
          height: 20
        };
      element.appendChild(section);
      var fakeEvent = new window.CustomEvent('page-size-changed', {
        bubbles: true
      });
      section.dispatchEvent(fakeEvent);
      assert.equal(element.style.width, '0.5pt', 'width updated');
      assert.equal(element.style.height, '1pt', 'height updated');
    });

    it('should have page borders div match the page size', function() {
      var section = document.createElement('qowt-section');
      var pageBorders = element.$.pageBorders;
      // In twips --> 25 points each
      section.pageSize = {
        width: 500,
        height: 500
      };
      // No margins
      section.pageMargins = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      var border = {
        width: 4
      };
      section.pageBorders = {
        top: border,
        bottom: border,
        left: border,
        right: border
      };
      element.appendChild(section);
      var fakeEvent = new window.CustomEvent('page-borders-changed', {
        bubbles: true
      });
      section.dispatchEvent(fakeEvent);
      // Since there are no margins, should match page dimensions
      assert.equal(pageBorders.style.width, '25pt', 'width updated');
      assert.equal(pageBorders.style.height, '25pt', 'height updated');
    });

    it('should adjust page borders size when margins are set', function() {
      var section = document.createElement('qowt-section');
      var pageBorders = element.$.pageBorders;
      // In twips --> 25 points each
      section.pageSize = {
        width: 500,
        height: 500
      };
      section.pageMargins = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      };
      var border = {
        width: 4
      };
      section.pageBorders = {
        top: border,
        bottom: border,
        left: border,
        right: border
      };
      element.appendChild(section);
      var fakeEvent = new window.CustomEvent('page-borders-changed', {
        bubbles: true
      });
      section.dispatchEvent(fakeEvent);
      // Height/width should be page size (25pt) - margins (2 * 5pt)
      assert.equal(pageBorders.style.width, '15pt', 'width updated');
      assert.equal(pageBorders.style.height, '15pt', 'height updated');
    });

    it('should set the page margins when the section changes it', function() {
      var headerStyle = element.$.header.style;
      var footerStyle = element.$.footer.style;
      var contentStyle = element.$.contentsContainer.style;
      assert.equal(headerStyle.minHeight, '', 'no top margin');
      assert.equal(footerStyle.minHeight, '', 'no bottom margin');
      assert.equal(headerStyle.paddingRight, '', 'no right margin on header');
      assert.equal(contentStyle.paddingRight, '', 'no right margin on content');
      assert.equal(footerStyle.paddingRight, '', 'no right margin on footer');
      assert.equal(headerStyle.paddingLeft, '', 'no left margin on header');
      assert.equal(contentStyle.paddingLeft, '', 'no left margin on content');
      assert.equal(footerStyle.paddingLeft, '', 'no left margin on footer');
      // Fake some page size
      var section = document.createElement('qowt-section');
      section.pageSize = {
        width: 12240,
        height: 15840
      };
      section.pageMargins = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        };
      element.appendChild(section);
      var fakeEvent = new window.CustomEvent('page-margins-changed', {
        bubbles: true
      });
      section.dispatchEvent(fakeEvent);
      assert.equal(headerStyle.minHeight, '10pt', 'top margin updated');
      assert.equal(footerStyle.minHeight, '10pt', 'bottom margin updated');
      assert.equal(headerStyle.paddingRight, '10pt', 'right header margin');
      assert.equal(contentStyle.paddingRight, '10pt', 'right margin content');
      assert.equal(footerStyle.paddingRight, '10pt', 'right margin footer');
      assert.equal(headerStyle.paddingLeft, '10pt', 'left margin on header');
      assert.equal(contentStyle.paddingLeft, '10pt', 'left margin on content');
      assert.equal(footerStyle.paddingLeft, '10pt', 'left margin on footer');
    });

    it("should not drop pending mutations when we ignore mutations",
        function() {
      var mutationObserver = element.mutationObserver_;
      var pendingMutations = 'blah';
      sinon.stub(mutationObserver,
           'disconnect').returns(pendingMutations);
      var spy = sinon.spy(element, 'handleMutations_');
      element.ignoreMutations();
      assert.equal(spy.withArgs(pendingMutations).callCount, 1);

      mutationObserver.disconnect.restore();
      element.handleMutations_.restore();
    });

    function assertFunctions_(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], element.nodeName + '.' + funcName);
      });
    }

  });

  return {};
});
