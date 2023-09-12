require([
  'common/elements/ui/buttonGroup/buttonGroup'],
  function(/* button group itself */) {

  'use strict';

  describe('QowtButtonGroup Polymer Element', function() {

    var buttonGroup;

    beforeEach(function() {
      buttonGroup = new window.QowtButtonGroupTestElement();
      buttonGroup.appendChild(document.createElement('div'));
    });

    afterEach(function() {
      buttonGroup = undefined;
    });

    it('should be able to get its constituent members', function() {
      assert.isTrue(_.isArray(buttonGroup.getGroupMembers()),
        'can get an array of the group\'s members');
    });
  });
});