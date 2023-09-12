/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/dcp/lineSeparatorHandler',
  'qowtRoot/fixtures/lineSeparatorFixture'
], function(LSEP, FixLsep) {

  'use strict';

  describe('line separator handler', function() {

    var rootNode, newLsepElement;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
    });


    afterEach(function() {
    });


    it('should create a new line separator element from DCP', function() {
      newLsepElement = LSEP.visit({
        el: FixLsep.lsepElement(),
        node: rootNode
      });
      expect(newLsepElement.nodeName).toBe('BR');
    });

  });

});
