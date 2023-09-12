require(['qowtRoot/utils/mockMouse'], function(MockMouse) {

  describe('qowt-submenu element', function() {
    'use strict';
    var submenu, submenuWithArrow;

    beforeEach(function() {
      this.stampOutTempl('qowt-submenu-test-template');
      submenu = this.getTestDiv().querySelector('qowt-submenu#noArrow');
      submenuWithArrow = this.getTestDiv().querySelector(
          'qowt-submenu#hasArrow');
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(submenu, QowtSubmenu, 'is a qowt-submenu');
    });

    // TODO: Temporarily disabling this test. This should be re-enabled later.
    // Issue with this test mentioned below:
    // In 'qowt-submenu' polymer element we are adding, a div
    // (<div id="arrow">▸</div>) dynamically based on a boolean attribute value
    // ('showArrow'). But, at the time of execution of this test case, the dom
    // is not updated with the desired div which is supposed to be added to dom
    // before executing this test.
    xit('should have an arrow if showArrow was specified.', function() {
      assert.isDefined(submenuWithArrow.$$('#arrow'),
          'correctly has an arrow if showArrow was specified.');
      assert.isUndefined(submenu.$$('#arrow'),
          'correctly does not have an arrow if showArrow was not specified.');
    });

    it('should add the "focused" class on mousemove', function(done) {
      submenu.addEventListener('focus', function() {
        assert.isTrue(submenu.classList.contains('focused'));
        done();
      });

      assert.isFalse(submenu.classList.contains('focused'));
      submenu.parentNode.hasVirtualFocus = true;
      MockMouse.mouseMove(submenu);
    });

    // TODO: Temporarily disabling this test. When bug mentioned below is fixed
    // this test should be enabled. Probably, will need some modifications in
    // test.
    // *******
    // BUG = Open any menu. Hover on any menu item, this will add 'focused'
    // class to that menu-item. Now, moving out from that menu-item (move mouse
    // somewhere else in document), this should remove 'focus' from menu-item.
    // However, currently the focus is not removed from menu-item.
    xit('should remove the "focused" class on mousemove', function(done) {
      submenu.addEventListener('blur', function() {
        assert.isFalse(submenu.classList.contains('focused'));
        done();
      });

      // Pretend we're already focused.
      submenu.classList.add('focused');

      MockMouse.mouseMove(submenu); // TODO: move mouse out from menu-item
    });
  });
});