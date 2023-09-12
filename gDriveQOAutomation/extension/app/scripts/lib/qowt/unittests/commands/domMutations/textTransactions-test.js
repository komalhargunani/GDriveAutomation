// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the textTransactions module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/textTransactionStart',
  'qowtRoot/commands/domMutations/textTransactionEnd',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/unittests/commands/commandTestUtils'
], function(
    TextTransactionStart,
    TextTransactionEnd,
    SelectionManager,
    CommandTestUtils) {

  'use strict';

  function expectTextTransations(config) {
    CommandTestUtils.expectMakesDocumentDirty(config.cmd,
        config.makesDocumentDirty);
  }

  var dummyContext = {
    end: {
      eid: "E82",
      offset: 12
    },
    start: {
      eid: "E82",
      offset: 12
    }
  };


  describe('commands/domMutations/textTransactionStart', function() {
    var cmd;
    beforeEach(function() {
      spyOn(SelectionManager, 'snapshot').andReturn(dummyContext);
      cmd = TextTransactionStart.create();
    });

    it('should produce a well formed command', function() {
      expectTextTransations({
        cmd: cmd,
        makesDocumentDirty: true});
    });
  });

  describe('commands/domMutations/textTransactionEnd', function() {
    var cmd;
    beforeEach(function() {
      spyOn(SelectionManager, 'snapshot').andReturn(dummyContext);
      cmd = TextTransactionEnd.create();
    });

    it('should produce a well formed command', function() {
      expectTextTransations({
        cmd: cmd,
        makesDocumentDirty: false});
    });
  });
});
