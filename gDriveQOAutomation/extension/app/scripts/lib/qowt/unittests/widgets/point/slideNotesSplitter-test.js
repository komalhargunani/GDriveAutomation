// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for slide notes splitter widget.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/widgets/point/slideNotesSplitter',
  'qowtRoot/unittests/__unittest-util'
], function(
    SlideNotesSplitter,
    UnitTestUtils) {

  'use strict';


  describe('slide notes splitter widget', function() {

    var _slideNotesSplitterNode;
    beforeEach(function() {
      SlideNotesSplitter.init();
      _slideNotesSplitterNode = SlideNotesSplitter.node();
    });

    afterEach(function() {
      _slideNotesSplitterNode = undefined;
    });

    it('should throw if slideNotesSplitter.init() called multiple times.',
       function() {
         expect(SlideNotesSplitter.init).toThrow(
             '_slideNotesSplitter.init() called multiple times.');
       });
    it('should return the slide notes splitter node.',
        function() {
          expect(_slideNotesSplitterNode).not.toBe(undefined);
        });
    it('should append the slide notes splitter node to the provided node.',
        function() {
          var _parentNode = UnitTestUtils.createTestAppendArea();
          SlideNotesSplitter.appendTo(_parentNode);
          expect(_parentNode.children[0]).not.toBe(undefined);
        });
    it('should return the offset top of the slide notes splitter node.',
        function() {
          var top = SlideNotesSplitter.top();
          expect(top).toBe(0);
        });
    it('should set the top of the slide notes splitter node.',
        function() {
          SlideNotesSplitter.setTop(10);
          expect(_slideNotesSplitterNode.style.top).toBe('10px');
        });
    it('should show the slide notes splitter node.',
        function() {
          SlideNotesSplitter.show(true);
          expect(_slideNotesSplitterNode.style.display).toBe('block');
        });
    it('should hide the slide notes splitter node.',
        function() {
          SlideNotesSplitter.show(false);
          expect(_slideNotesSplitterNode.style.display).toBe('none');
        });
    it('should return the id of slide notes splitter node.',
        function() {
          SlideNotesSplitter.show(false);
          expect(_slideNotesSplitterNode.id).toBe('qowt-point-notes-splitter');
        });
    it('should throw error when appendTo is called with undefined node',
        function() {
         var node;
         expect(function() {
           SlideNotesSplitter.appendTo(node);
         }).toThrow('SlideNotesSplitter widget - missing appendTo parameter!');
        });
    it('should throw error when show is called with undefined flag',
        function() {
         var flag;
         expect(function() {
           SlideNotesSplitter.show(flag);
         }).toThrow('SlideNotesSplitter widget - missing show parameters!');
        });
  });
});
