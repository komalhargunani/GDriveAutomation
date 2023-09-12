
// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview test cases for src/widgets/ui/feedbackButton.js
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['qowtRoot/widgets/ui/feedbackButton'], function(FeedbackButton) {

  'use strict';

  describe('Feedback Button', function() {

    var _fb, _node;

    beforeEach(function() {
      _fb = FeedbackButton.create('Foobar', 'http://somelink');
    });

    afterEach(function() {
      _fb = undefined;
      _node = undefined;
    });

    it('should construct a button with feedback css class', function() {
      expect(
          _fb.htmlNode().classList.contains('qowt-feedback-button')).toBe(true);
    });

    it('should append the button to given node', function() {
      _node = document.createElement('div');
      _fb.appendTo(_node);
      expect(_node.childNodes.length).toBe(1);
    });

  });
  return {};
});

