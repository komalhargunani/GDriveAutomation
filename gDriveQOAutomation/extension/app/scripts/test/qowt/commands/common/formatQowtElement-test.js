define([
  'qowtRoot/commands/common/formatQowtElement',
], function(
  FormatQowtElement
  ) {

  'use strict';

  describe('formatQowtElement tests', function() {

    describe('changeHtml', function() {
      it('should guard against a null node', function() {
        var context = {
          formatting: { bld : true },
          eid: 123
        };
        var cmd = FormatQowtElement.create(context);
        expect(cmd.changeHtml).to.not.throw();
      });
    });

  });
});