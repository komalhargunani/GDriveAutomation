/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the modal spinner widget
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/ui/modalSpinner'], function(
  PubSub,
  ModalSpinner) {

  'use strict';

  describe('Modal Spinner & Shield', function() {

    var spinnerElem, shieldElem;

    beforeEach(function() {
      spinnerElem = document.getElementById('spinner');
      shieldElem = document.getElementById('shield');
      jasmine.Clock.useMock();
      jasmine.Clock.reset();
    });

    it('should initialize the spinner properly', function() {
      expect(spinnerElem).toBeDefined();
      expect(
        spinnerElem.parentNode.parentNode.classList.contains(
          'center-outer-container', 'loading-container')).toBe(true);
      expect(
        spinnerElem.parentNode.classList.contains(
          'center-inner-container')).toBe(true);
      expect(spinnerElem.childNodes.length).toEqual(1);
      expect(spinnerElem.childNodes[0].nodeName).toBe('IMG');
    });

    it('should initialize the shield properly', function() {
      expect(shieldElem).toBeDefined();
      expect(shieldElem.classList.contains('modal-shield',
            'qowt-fader')).toBe(true);
      expect(shieldElem.style.display).toBe('none');
      expect(shieldElem.style.opacity).toBe('0');
      expect(shieldElem.style.display).toBe('none');
    });

    it('should show and hide correctly', function() {
      ModalSpinner.show();
      // show sets the display to block, and then changes the
      // opacity in the next turn
      expect(shieldElem.style.display).toBe('block');
      jasmine.Clock.tick(1);
      expect(shieldElem.style.opacity).not.toBe('0');
      ModalSpinner.hide();
      // hiding the shield is done by setting the opacity to zero within
      // the same turn as the call to 'hide'. The display is not changed
      // within that turn and should thus still be 'block'
      expect(shieldElem.style.opacity).toBe('0');
      expect(shieldElem.style.display).toBe('block');
      // but after waiting a predefined time, it should be gone, meaning
      // the opacity should be set to zero, and the display should be 'none'
      jasmine.Clock.tick(ModalSpinner.REMOVE_DELAY + 1);
      expect(shieldElem.style.display).toBe('none');
      expect(shieldElem.style.opacity).toBe('0');
    });

    it('should remove subscribers & event listeners ' +
       'for qowt:disable signals', function() {
      // The modal spinner has 1 event listener
      spyOn(shieldElem, 'removeEventListener').andCallThrough();
      PubSub.publish('qowt:disable', {});
      expect(shieldElem.removeEventListener).toHaveBeenCalled();
      // We need to set the modal spinner back to a clean state
      // This also tests that the module can handle multiple initializations
      PubSub.publish('qowt:init', {});
    });

    it('should remove all HTML for qowt:destroy signals', function() {
      PubSub.publish('qowt:destroy', {});
      spinnerElem = document.getElementById('spinner') || undefined;
      shieldElem = document.getElementById('shield') || undefined;
      expect(spinnerElem).not.toBeDefined();
      expect(shieldElem).not.toBeDefined();
      // We need to set the modal spinner back to a clean state
      // This also tests that the module can handle multiple initializations
      PubSub.publish('qowt:init', {});
    });

  });

  return {};

});
