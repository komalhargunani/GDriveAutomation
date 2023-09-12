define([], function() {

  describe('qowt-submenu behaviour', function() {
    'use strict';
    var menuBar, prevSubmenu, currSubmenu, parentSubmenu, childSubmenu;

    beforeEach(function() {
      this.stampOutTempl('qowt-submenu-behaviour-test-template');
      menuBar = this.getTestDiv().querySelector('qowt-menu-bar');
      prevSubmenu = this.getTestDiv().querySelector('qowt-submenu#prevSubmenu');
      currSubmenu = this.getTestDiv().querySelector('qowt-submenu#currSubmenu');
      parentSubmenu = this.getTestDiv().
          querySelector('qowt-submenu#parentSubmenu');
      childSubmenu = this.getTestDiv().
          querySelector('qowt-submenu#childSubmenu');
    });
    afterEach(function() {
      menuBar = undefined;
      prevSubmenu = undefined;
      currSubmenu = undefined;
      parentSubmenu = undefined;
      childSubmenu = undefined;
    });

    it('should activate the submenu on selection ', function() {
      assertSubMenuState(currSubmenu, false);
      menuBar._setSelectedItem(currSubmenu);
      assertSubMenuState(currSubmenu, true);
    });

    it('should deactivate previous & activate current submenu', function() {
      assertSubMenuState(prevSubmenu, false);
      assertSubMenuState(currSubmenu, false);
      menuBar._setSelectedItem(prevSubmenu);
      assertSubMenuState(prevSubmenu, true);
      menuBar._setSelectedItem(currSubmenu);
      assertSubMenuState(prevSubmenu, false);
      assertSubMenuState(currSubmenu, true);
    });

    it('should deactivate submenu when clicked on document body', function() {
      assertSubMenuState(currSubmenu, false);
      menuBar._setSelectedItem(currSubmenu);
      assertSubMenuState(currSubmenu, true);
      // simulate click on document body (i.e null)
      menuBar._setSelectedItem(null);
      assertSubMenuState(currSubmenu, false);
    });

    xit('should keep parent & child submenu active', function() {
      // On child submenu selection should keep both parent & child submenu
      // active
      assertSubMenuState(parentSubmenu, false);
      assertSubMenuState(childSubmenu, false);
      menuBar._setSelectedItem(parentSubmenu);
      assertSubMenuState(parentSubmenu, true);
      menuBar._setSelectedItem(childSubmenu);
      assertSubMenuState(parentSubmenu, true);
      assertSubMenuState(childSubmenu, true);
    });

    xit('should deactivate parent & child submenu when selection changed' +
        ' to doc body', function() {
      assertSubMenuState(parentSubmenu, false);
      assertSubMenuState(childSubmenu, false);
      menuBar._setSelectedItem(parentSubmenu);
      menuBar._setSelectedItem(childSubmenu);
      assertSubMenuState(parentSubmenu, true);
      assertSubMenuState(childSubmenu, true);
      menuBar._setSelectedItem(null);
      assertSubMenuState(parentSubmenu, false);
      assertSubMenuState(childSubmenu, false);
    });

    xit('should deactivate parent & child submenu when selection changed' +
        ' to other submenu', function() {
      assertSubMenuState(parentSubmenu, false);
      assertSubMenuState(childSubmenu, false);
      menuBar._setSelectedItem(parentSubmenu);
      menuBar._setSelectedItem(childSubmenu);
      assertSubMenuState(parentSubmenu, true);
      assertSubMenuState(childSubmenu, true);
      menuBar._setSelectedItem(currSubmenu);
      assertSubMenuState(parentSubmenu, false);
      assertSubMenuState(childSubmenu, false);
      assertSubMenuState(currSubmenu, true);
    });

    function assertSubMenuState(subMenu, isSubMenuActivated) {
      if (isSubMenuActivated) {
        assert.isTrue(subMenu.active, 'should be activated');
      } else {
        assert.isFalse(subMenu.active, 'should be deactivated');
      }
    }
  });
});
