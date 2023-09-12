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
  'qowtRoot/widgets/point/slidenotes'
], function(SlideNotes) {

  'use strict';


  describe('point slide notes widget', function() {


    beforeEach(function() {
      SlideNotes.init('slide notes');
    });

    afterEach(function() {
      // tear shit down
    });

    it('should throw if _slideNotes.init() called multiple times.',
       function() {
         expect(SlideNotes.init).toThrow(
             '_slideNotes.init() called multiple times.');
       });

    it('it should update a slide note when slide contents are changed',
       function() {
         SlideNotes.setSlideNotes('changed slide notes');
         expect(SlideNotes.getSlideNotes()).toBe('changed slide notes');
       });

    it('it should update a slide note when slide contents are cleared',
       function() {
         SlideNotes.clearNotes();
         expect(SlideNotes.getSlideNotes()).toBe(' ');
       });

    it('should throw error when showNotes called with undefined parameter',
        function() {
         var show;
         expect(function() {
           SlideNotes.showNotes(show);
         }).toThrow('SlideNotes widget - missing setPosition parameters!');
        });
  });
});
