/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview helper module to open the chrome feedback UI.
 * Used from 'help' menu item.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/messageBus/messageBus'],
  function(
    MessageBus) {

  'use strict';

  var api_ = {

    /**
     * Helper function to take the user to the chrome feedback UI
     * @param {String | undefined} description The boilerplate text that will be
     *     written in the feedback UI.
     */
    reportAnIssue: function(description) {
      MessageBus.pushMessage({
        id: 'reportAnIssue',
        description: description
      });
    }
  };

  return api_;
});

