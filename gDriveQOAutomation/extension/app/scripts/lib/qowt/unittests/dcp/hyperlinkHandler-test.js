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
  'qowtRoot/fixtures/_all',
  'qowtRoot/dcp/hyperlinkHandler'
], function(
    FIXTURES,
    Hyperlink) {

  'use strict';

  describe('Hyperlink handler', function() {

    var rootNode;
    var handler;

    var visitableEl;
    var visitableEl_NotHyperlinkType;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      handler = Hyperlink;
      visitableEl = {
        el: FIXTURES.hyperlink('http://www.google.com/', 'Google'),
        node: rootNode,
        accept: function() {}
      };
      visitableEl_NotHyperlinkType = {
        el: FIXTURES.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
    });

    it('should ignore any DCP element that is not a hyperlink', function() {
      var returnValue = handler.visit(visitableEl_NotHyperlinkType);
      expect(returnValue).toBe(undefined);
      expect(visitableEl_NotHyperlinkType.node.childNodes.length).toBe(0);
    });

    it("should ignore any DCP element that has doesn't have an element type",
        function() {
          visitableEl_NotHyperlinkType.el.etp = undefined;
          var returnValue = handler.visit(visitableEl_NotHyperlinkType);
          expect(returnValue).toBe(undefined);
          expect(visitableEl_NotHyperlinkType.node.childNodes.length).toBe(0);
        });

    it("should ignore any DCP element that has doesn't have a valid " +
        'element id', function() {
          visitableEl.el.eid = undefined;
          var returnValue = handler.visit(visitableEl);
          expect(returnValue).toBe(undefined);
          expect(visitableEl.node.childNodes.length).toBe(0);
        });

  });

});
