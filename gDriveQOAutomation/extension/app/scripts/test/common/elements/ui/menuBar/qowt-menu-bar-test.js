define([
  'qowtRoot/pubsub/pubsub'
], function(
    PubSub
) {

  'use strict';

  describe('qowt-menu-bar element', function() {
    var menuBar;

    beforeEach(function() {
      this.stampOutTempl('qowt-menu-bar-test-template');
      menuBar = this.getTestDiv().querySelector('qowt-menu-bar');
      assert.isNotNull(menuBar);
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(menuBar, QowtMenuBar);
    });
  });

  xdescribe('qowt-menu-bar qowt-item navigation', function() {
    var menuBar, subMenus, sandbox_, qowtItem_;
    var event = {
      detail: {
        keyboardEvent: {
          stopImmediatePropagation: function() {},
          preventDefault: function() {},
          detail: {
            key: 'enter'
          }
        }
      }
    };

    beforeEach(function() {
      this.stampOutTempl('qowt-menu-bar-test-template');
      menuBar = this.getTestDiv().querySelector('qowt-menu-bar');
      assert.isNotNull(menuBar);
      subMenus = menuBar.items;
      qowtItem_ = this.getTestDiv().querySelector('qowt-item');
      sandbox_ = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox_.restore();
      subMenus = undefined;
      menuBar = undefined;
      sandbox_ = undefined;
      qowtItem_ = undefined;
    });

    it('should navigate to next menu item', function(done) {
      event.detail.keyboardEvent.detail.key = 'down';
      selectSubMenuAndItem(0, 0);
      stubFocusChangedVerifyFocusedItems(0, 1, done);
      passOnEventWhenPolymerIsRenderReady('onSelectionKey_', event);
    });

    it('should navigate to previous menu item', function(done) {
      event.detail.keyboardEvent.detail.key = 'up';
      selectSubMenuAndItem(0, 1);
      stubFocusChangedVerifyFocusedItems(0, 0, done);
      passOnEventWhenPolymerIsRenderReady('onSelectionKey_', event);
    });

    it('should navigate to next menu', function(done) {
      event.detail.keyboardEvent.detail.key = 'right';
      selectSubMenuAndItem(0, 1);
      stubFocusChangedVerifyFocusedSubmenu(0, 1, done);
      passOnEventWhenPolymerIsRenderReady('onRightKey_', event);
    });

    it('should navigate to previous menu', function(done) {
      event.detail.keyboardEvent.detail.key = 'left';
      selectSubMenuAndItem(1, 1);
      stubFocusChangedVerifyFocusedSubmenu(1, 0, done);
      passOnEventWhenPolymerIsRenderReady('onLeftKey_', event);
    });

    it('should publish qowt:itemFocused signal', function(done) {
      var expectedSignal = 'qowt:itemFocused';
      assert.isNotNull(subMenus[0].items[1]);
      sandbox_.stub(PubSub, 'publish', function() {
        sinon.assert.calledWith(PubSub.publish, expectedSignal);
        done();
      });
      selectSubMenuAndItem(0, 1);
    });

    it('should publish qowt:itemBlurred signal ' +
      'after enter action', function(done) {
      event.detail.keyboardEvent.key = 'enter';
      var expectedSignal = 'qowt:itemBlurred';
      assert.isNotNull(subMenus[0].getEffectiveChildren()[1]);
      selectSubMenuAndItem(0, 1);
      sandbox_.stub(PubSub, 'publish', function() {
        sinon.assert.calledWith(PubSub.publish, expectedSignal);
        done();
      });
      passOnEventWhenPolymerIsRenderReadyOnEnter('onEnterKey_', event);
    });

    it('should close menubar', function(done) {
      var evt = document.createEvent('Event');
      evt.initEvent('keydown', { bubbles: true, cancelable: true});

      Object.defineProperty(evt, 'detail', {
        value: 0
      });
      Object.defineProperty(evt, 'key', {
        value: 'esc',
        writable: true
      });
      selectSubMenuAndItem(0, 1);
      sandbox_.stub(menuBar, 'blur', function() {
        done();
      });
      sandbox_.stub(PubSub, 'publish', function() {
        sinon.assert.calledWith(PubSub.publish, 'qowt:itemBlurred');
        done();
      });
      passOnEventWhenPolymerIsRenderReady('dispatchEvent', evt);
    });

    /**
     * MenuBar focuses on the subMenu identified by subMenuIndex. And the
     * focused subMenu in turn focuses on item identified by itemIndex
     * @param {number} subMenuIndex
     * @param {number} itemIndex
     */
    function selectSubMenuAndItem(subMenuIndex, itemIndex) {
      menuBar._setFocusedItem(subMenus[subMenuIndex]);
      subMenus[subMenuIndex].active = true;
      var item = subMenus[subMenuIndex].getEffectiveChildren()[itemIndex];
      subMenus[subMenuIndex]._setFocusedItem(item);
    }

    /**
     * Stub the focusedItemChanged_ method of the submenu identified by the
     * subMenuIndex. Verify that the submenu now focuses on itemIndex. Invoke
     * the mocha callback 'done'
     * @param {number} subMenuIndex
     * @param {number} itemIndex
     * @param {function} done
     */
    function stubFocusChangedVerifyFocusedItems(subMenuIndex, itemIndex, done) {
      sandbox_.stub(subMenus[subMenuIndex], 'focusedItemChanged_', function() {
        assert.isTrue(menuBar.focusedItem === subMenus[subMenuIndex]);
        var item = subMenus[subMenuIndex].items[itemIndex];
        assert.isTrue(item === subMenus[subMenuIndex].focusedItem);
        done();
      });
    }

    /**
     * Stub the focusedItemChanged_ method of the submenu focused before event
     * is fired. This submenu is identified by smFocused. Verify that the menBar
     * now focuses on submenu identified by smToFocus. Invoke the mocha callback
     * 'done'
     * @param {number} smFocused
     * @param {number} smToFocus
     * @param {function} done
     */
    function stubFocusChangedVerifyFocusedSubmenu(smFocused, smToFocus, done) {
      sandbox_.stub(subMenus[smFocused], 'focusedItemChanged_', function() {
        assert.isTrue(menuBar.focusedItem === subMenus[smToFocus]);
        done();
      });
    }

    /**
     * Invoke the MenuBar handler with the provided event when Polymer is render
     * ready
     * @param {function} handler
     * @param {object} event
     */
    function passOnEventWhenPolymerIsRenderReady(handler, event) {
      // QowtItem has iron-a11y-keys-behavior as Behaviour, it listens for
      // events on an element only after it is attached
      Polymer.RenderStatus.whenReady(function() {
        menuBar[handler](event);
      });
    }

    function passOnEventWhenPolymerIsRenderReadyOnEnter(handler, event) {
      // QowtItem has iron-a11y-keys-behavior as Behaviour, it listens for
      // events on an element only after it is attached
      Polymer.RenderStatus.whenReady(function() {
        qowtItem_[handler](event);
      });
    }
  });
});