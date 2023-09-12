/**
 * @fileoverview
 * Modal spinner module;
 * this is a singleton to show a full screen spinner,
 * incorporating a shield that prevents user interaction.
 * Clients can call show() / hide().
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/htmlConstructor',
  'qowtRoot/pubsub/pubsub'], function(
  Html,
  PubSub) {

  'use strict';

  var api_ = {
    /**
     * public delay after 'hide' at which point we guarantee to
     * 'remove' the shield (eg set display to none)
     */
    REMOVE_DELAY: 200,
    show: show_,
    hide: hide_
  };

  // PRIVATE ===================================================================

  var eid_ = 'shield',
      shieldElement_,
      visible_ = false,
      showTimerId_,
      eventListenerAdded_ = false,
      spinnerAdded_ = false;

  function create_() {
    if (!getShieldElement_()) {
      createHtml_();
    }
    shieldElement_ = getShieldElement_();
    shieldElement_.style.display = 'none';
    shieldElement_.style.opacity = '0.0';
    if (!eventListenerAdded_) {
      shieldElement_.addEventListener(
        'webkitTransitionEnd', onTransitionEnd_, false);
      eventListenerAdded_ = true;
    }
    if (!spinnerAdded_) {
      // Now append a spinner to the shield element,
      // because it is a child of the shield its
      // visibility will be controlled by the parent.
      Html.constructHTML([{
        className: 'center-outer-container loading-container',
        children: [{
          className: 'center-inner-container',
          children: [{
            id: 'spinner',
            children: [{
              elType: 'img',
              src: '../img/progressSpinner.svg'
            }]
          }]
        }]
      }], shieldElement_);
      spinnerAdded_ = true;
    }
  }

  function getShieldElement_() {
    return document.getElementById(eid_);
  }

  function createHtml_() {
    Html.constructHTML([{
      id: 'shield',
      className: 'modal-shield qowt-fader'
    }], document.body);
  }

  function onTransitionEnd_() {
    if (!visible_) {
      remove_();
    }
  }

  function show_() {
    shieldElement_.style.display = 'block';
    // need to set the opacity in a different turn than setting the
    // display; in order for the css transition delay timer to work correctly
    showTimerId_ = window.setTimeout(unhide_, 0);
    visible_ = true;
  }

  function hide_() {
    if (showTimerId_) {
      // if we are still waiting to set the opacity for a previous
      // call to show_, then clear that timer
      window.clearTimeout(showTimerId_);
    }
    showTimerId_ = undefined;
    shieldElement_.style.opacity = '0.0';
    visible_ = false;
    // changing the opacity will result in a css transition
    // we monitor 'webkitTransitionEnd', at which point we
    // physically remove the shield. There can be race conditions
    // in which this event does not fire, so to be safe, we also
    // have a timeout of 200ms at which point we remove it.
    window.setTimeout(remove_, api_.REMOVE_DELAY);
  }

  function unhide_() {
    showTimerId_ = undefined;
    shieldElement_.style.opacity = '0.4';
  }

  function remove_() {
    if (shieldElement_) {
      shieldElement_.style.display = 'none';
    }
  }

  /**
   * Triggered by qowt:init signals
   * Set up the shield DOM and webkitTransitionEnd listener to remove.
   */
  var initialized_ = false;
  function init_() {
    if (!initialized_) {
      create_();
      remove_();
      initialized_ = true;
    }
  }

  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners,
   * and reset all internal state.
   */
  function disable_() {
    visible_ = false;
    if (showTimerId_) {
      window.clearTimeout(showTimerId_);
    }
    showTimerId_ = undefined;
    if (shieldElement_ && eventListenerAdded_) {
      shieldElement_.removeEventListener(
        'webkitTransitionEnd', onTransitionEnd_, false);
    }
    eventListenerAdded_ = false;
    initialized_ = false;
  }

  /**
   * Triggered by qowt:destroy signals
   * Should remove any HTML elements and references
   * created by this module.
   */
  function destroy_() {
    var spinnerElement = document.getElementById('spinner');
    if (spinnerElement && spinnerElement.parentNode) {
      spinnerElement.parentNode.removeChild(spinnerElement);
    }
    spinnerElement = undefined;
    spinnerAdded_ = false;
    if (shieldElement_ && shieldElement_.parentNode) {
      shieldElement_.parentNode.removeChild(shieldElement_);
    }
    shieldElement_ = undefined;
  }

  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except
  // subscribe to qowt:init qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
    PubSub.subscribe('qowt:destroy', destroy_);
  })();

  return api_;

});

