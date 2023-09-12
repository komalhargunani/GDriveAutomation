/**
 * @fileoverview suite wrapper for message bus tests
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'MessageBus',

    suites: [
      'unitTestRoot/messageBus/messageBus-test'
    ]
  };

  return _api;
});

