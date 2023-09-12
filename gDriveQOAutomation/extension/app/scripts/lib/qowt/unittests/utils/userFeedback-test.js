/**
 * @fileoverview Unit tests for the user feedback module
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/utils/userFeedback',
  'qowtRoot/messageBus/messageBus'
], function(
    UserFeedback,
    MessageBus) {

  'use strict';

  describe('user feedback module', function() {

    it('should send a message on the message bus when reportAnIssue() ' +
        'is invoked', function() {

          spyOn(MessageBus, 'pushMessage');
          UserFeedback.reportAnIssue();
          expect(MessageBus.pushMessage).toHaveBeenCalled();
        });
  });
});
