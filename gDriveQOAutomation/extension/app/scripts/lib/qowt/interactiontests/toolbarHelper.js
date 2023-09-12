define([
    'qowtRoot/utils/mockMouse',
    'qowtRoot/interactiontests/waitHelper',
    'qowtRoot/controls/viewLayoutControl'
  ], function(
    MockMouse,
    WaitFor,
    ViewLayoutControl
  ) {

  'use strict';

  var _api = {

    /**
     * Simulates menu item selection by using toolbar dropdown button (e.g.
     * selects a color from text-color or highlight-color picker dropdown, or
     * selects a font-family in fontface or a font-size from fontSize picker
     * dropdown list and simulates a click event on the selected menu item and
     * then perform the subsequent actions on it.)
     *
     * @param menuItem - selected menu item div from dropdown list
     */
    waitForMenuItemClicked: function(menuItem, opt_msg) {
      WaitFor.runsEdit(function() {
        MockMouse.click(menuItem);
      }, opt_msg || 'menu item clicked');
    },

    /**
     * Simulates the main toolbar buttons click(e.g. bold,italic,underline
     * buttons)
     * @param buttonId - Id of clicked button
     */
    waitForButtonClicked: function(buttonId) {
      WaitFor.runsEdit(function() {
        _api.clickButton(buttonId);
      }, 'button clicked');
    },

    /**
     *  Simulates clicking on a button.
     *  @param buttonId - Id of clicked button
     */
    clickButton: function(buttonId){
      var button = ViewLayoutControl.getToolbarItem(buttonId);
      MockMouse.click(button.getWidgetElement(), 'click');
    }
  };

  return _api;
});
