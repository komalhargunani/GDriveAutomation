/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Mock Keyboard events.
 * Dispatches fake keyboard and textInput events.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/promiseUtils',
  'qowtRoot/models/env',
  'qowtRoot/utils/mockKeyboard/keyCodes'], function(
  PromiseUtils,
  EnvModel,
  KeyCodes) {

  'use strict';

  var api_ = {

    /**
     * Use the passed in keyInfo to create and dispatch
     * fake keyboard and textInput events.
     * @param {Object} keyInfo An object created by the keyCodes module.
     * @param {Node} opt_target Optional event target, default is document.
     * @param {String} opt_type Optional string from ENUM(down|up).
     *        If down, keyup events will not be dispatched.
     *        If up, keydown, keypress and textInput
     *        events will not be dispatched.
     * @return {Promise} Resolves to the number of events dispatched.
     */
    dispatchEvents: function(keyInfo, opt_target, opt_type) {
      opt_target = opt_target || document;
      return PromiseUtils.delay(0).then(
        dispatchEvents_.bind(this, opt_target, keyInfo, opt_type)
      );
    }

  };

  // PRIVATE ===================================================================

  var monitorModifiers_ = false,
      modifiersSet_ = {
        control: false,
        alt: false,
        shift: false,
        meta: false,
        altGraph: false
      };

  function dispatchEvents_(target, keyInfo, opt_type) {
    var dispatched = 0,
        currentModifiers,
        dispDown = (!opt_type || opt_type === 'down'),
        dispUp   = (!opt_type || opt_type === 'up'),
        keyData,
        keyDownEvt,
        keyPressEvt;

    // Check whether selection has selected region/area
    var isCollapsed = EnvModel.app === 'word' ?
      window.getSelection().isCollapsed : true;

    // Only the keys method specifies the type of event to dispatch,
    // therefore if the events are of type keydown we want to monitor
    // for modifier keys so that we can set them in subsequent events.
    monitorModifiers_ = !!(opt_type);
    if (dispDown) {
      currentModifiers = activateModifiers_(keyInfo);
      keyData = currentModifiers.shift ? keyInfo.shifted : keyInfo;
      keyDownEvt = makeKeyEvent_('keydown', keyData, currentModifiers);
      dispatched += target.dispatchEvent(keyDownEvt) ? 1 : 0;
      // Only some keys need to dispatch keypress and textInput events.
      if ((keyData.textInput !== undefined) && (keyData.textInput !== false)) {
        // Control / Meta modifiers, Alt Shift modifiers and special keys
        // suppress the keypress and textInput events.
        //Note: Special keys do not have charCodes/ ASCII codes.
        if ((!currentModifiers.control && !currentModifiers.meta) &&
           !(currentModifiers.alt && currentModifiers.shift) &&
           keyInfo.charCode) {
          keyPressEvt = makeKeyEvent_('keypress', keyData, currentModifiers);
          dispatched += target.dispatchEvent(keyPressEvt) ? 1 : 0;
          // If the keydown or keypress event was default prevented in the
          // code, we do not want to make a textInput event.
          if ((keyDownEvt && keyDownEvt.defaultPrevented !== true) &&
              (keyPressEvt && keyPressEvt.defaultPrevented !== true)) {
            var text = keyData.textInput === true ?
                         keyData.name : keyData.textInput;
            window.setTimeout(function () {
              document.execCommand("insertText", false, text);
              dispatched++;
            }, 0);
          }
        }
      }

      // The events for delete and backspace do not actually cause
      // the browser to execute the action, so we have to manually
      // execute the action.
      // http://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
      if (!window.dontUseExecCommand) {
        if (keyData.name === 'delete' && isCollapsed) {
          document.execCommand('forwarddelete', false);
        }
        if (keyData.name === 'backspace' && isCollapsed) {
          document.execCommand('delete', false);
        }
      }
    }
    if (dispUp) {
      currentModifiers = deactivateModifiers_(keyInfo);
      keyData = currentModifiers.shift ? keyInfo.shifted : keyInfo;
      dispatched += target.dispatchEvent(
          makeKeyEvent_('keyup', keyData, currentModifiers)
      ) ? 1 : 0;
    }
    return dispatched;
  }

  // Compiles and returns the modifier tracking object.
  function activateModifiers_(keyInfo) {
    // Check if the current key a modifier.
    if (KeyCodes.modifierNames.indexOf(keyInfo.name) !== -1) {
      if (monitorModifiers_) {
        modifiersSet_[keyInfo.name] = true;
      } else {
        // If we are not monitoring modifier keys then
        // we don't want to set the modifier in the tracker
        // object, so create a clone to set and return.
        var tempModifiers = dirtyClone_(modifiersSet_);
        tempModifiers[keyInfo.name] = true;
        return tempModifiers;
      }
    }
    return modifiersSet_;
  }

  // Compiles and returns the modifier tracking object.
  function deactivateModifiers_(keyInfo) {
    // Check if the current key a modifier.
    if (KeyCodes.modifierNames.indexOf(keyInfo.name) !== -1) {
      if (monitorModifiers_) {
        modifiersSet_[keyInfo.name] = false;
      }
    }
    // If we are monitoring modifier keys and now none are
    // set, then we can stop monitoring modifier keys.
    if (monitorModifiers_ &&
       (Object.keys(modifiersSet_).map(
          function(i) { return modifiersSet_[i]; }).indexOf(true) < 0)) {
      monitorModifiers_ = false;
    }
    return modifiersSet_;
  }

  // This is used to make a copy of the modifier tracking object
  // when we only want to set a modifier to true temporarily.
  function dirtyClone_(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Create and return a keyboard event of type specified,
  // use the passed key information and modifiers to populate the event.
  function makeKeyEvent_(type, key, modifiers) {
    var evt = document.createEvent('KeyboardEvent');
    evt.initKeyboardEvent(
        type, true, true,
        window,
        0,
        key.keyCode,
        !!modifiers.control,
        !!modifiers.alt,
        !!modifiers.shift,
        !!modifiers.meta,
        !!modifiers.altGraph);
    // Indicate that this event was generated by the mock keyboard.
    evt.origin = 'mockKeyboard';
    var charCode, keyCode, which;
    //In Chrome, keyCode and charCode are the same for keypress event.
    //Whereas keydown and keyup events have charCode as zero.
    if (type === 'keypress') {
      charCode = keyCode = which = key.charCode;
    } else {
      charCode = 0;
      keyCode = key.keyCode;
      which = key.which;
    }
    // The event init method does not set all the required
    // properties so we brute force set them on the object.
    forceEventProperty_(evt, 'charCode', charCode);
    forceEventProperty_(evt, 'keyCode', keyCode);
    forceEventProperty_(evt, 'keyIdentifier', key.keyIdentifier);
    // KeyboardEvent.keyIdentifier is better, and KeyBoardEvent.key is even
    // better than that.
    forceEventProperty_(evt, 'key', key.keyValues);
    forceEventProperty_(evt, 'which', which);
    return evt;
  }

  function forceEventProperty_(evt, prop, val) {
    Object.defineProperty(evt, prop, { get: function() { return val; } });
  }

  return api_;

});
