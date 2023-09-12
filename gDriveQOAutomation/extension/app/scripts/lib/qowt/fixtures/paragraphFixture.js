/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'paragraph',


    /**
     * simple empy paragraph element without any styling
     *
     * See qowt/comms/schema/paragraph-schema.js
     *
     */
    'paragraphElement': function(styles, ovrid) {
      var paraid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var el = {
        etp: 'par',
        eid: paraid,
        addChild: FIXTURES.addChild,
        setStyles: FIXTURES.setStyles,
        // TODO: Remove once DCP backwards compatibility is no longer required
        lsp: 12,
        ppr: {
          //12 means single line spacing, if font is 48pt and lsp is 18, then
          // line height should be 48*(18/12) (not in points! CSS a ccepts plain
          // number for line height vs font height)
          lsp: 12
        },
        elm: []
      };
      el.setStyles(styles);
      return el;
    },

    'alignedParagraphElement': function(alignment, ovrid) {
      var paraid = ovrid ? ovrid : ++FIXTURES.idCounter;
      if(alignment !== "L" && alignment !== "R" && alignment !== "C" &&
        alignment !== "J") {
        alignment = "L";
      }
      var el = {
        etp: 'par',
        // TODO: Remove once DCP backwards compatibility is no longer required
        jus: alignment,
        ppr: {
          jus: alignment
        },
        eid: paraid,
        addChild: FIXTURES.addChild,
        elm: []
      };
      return el;
    }

  };

});
