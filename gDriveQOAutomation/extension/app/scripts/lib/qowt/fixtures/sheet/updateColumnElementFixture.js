// Copyright 2013 Google Inc. All Rights Reserved.

define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  return {

    'id': 'updateColumnElement',

    'updateColumnElement': function(index, formatting) {
      return {
        addChild: FIXTURES.addChild,
        etp:"ucn",
        ci: (index || 0),
        fm: formatting
      };
    }

  };

});
